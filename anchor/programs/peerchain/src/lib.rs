use anchor_lang::prelude::*;
use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod peerchain {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>, name: String) -> Result<()> {
        require!(name.len() > 0 && name.len() <= 50, ErrorCode::NameTooLong);

        let profile = &mut ctx.accounts.user_profile;
        profile.authority = ctx.accounts.authority.key();
        profile.name = name;
        profile.role = UserRole::Student;
        profile.reputation = 0;
        profile.total_sessions = 0;
        profile.total_funded = 0;
        profile.bump = ctx.bumps.user_profile;

        emit!(UserCreated {
            authority: profile.authority,
            name: profile.name.clone(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn update_user(ctx: Context<UpdateUser>, name: Option<String>, role: Option<UserRole>) -> Result<()> {
        let profile = &mut ctx.accounts.user_profile;

        if let Some(new_name) = name {
            require!(new_name.len() <= 50, ErrorCode::NameTooLong);
            profile.name = new_name;
        }

        if let Some(new_role) = role {
            require!(
                ctx.accounts.authority.key() == ctx.accounts.admin.key(),
                ErrorCode::Unauthorized
            );
            profile.role = new_role.clone();
        }

        emit!(UserUpdated {
            authority: profile.authority,
            name: profile.name.clone(),
            new_role: profile.role.clone(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn log_session(
        ctx: Context<LogSession>,
        session_id: Pubkey,
        duration: i64,
        session_type: SessionType,
        topic: String,
    ) -> Result<()> {
        require!(duration > 0 && duration <= 1440, ErrorCode::InvalidDuration);
        require!(topic.len() <= 64, ErrorCode::TopicTooLong);
        require!(
            ctx.accounts.student.key() != ctx.accounts.mentor.key(),
            ErrorCode::SelfSessionNotAllowed
        );

        let session = &mut ctx.accounts.session;
        let clock = Clock::get()?;

        session.session_id = session_id;
        session.student = ctx.accounts.student.key();
        session.mentor = ctx.accounts.mentor.key();
        session.duration = duration;
        session.session_type = session_type.clone();
        session.topic = topic;
        session.completed = true;
        session.timestamp = clock.unix_timestamp;
        session.bump = ctx.bumps.session;

        let student_profile = &mut ctx.accounts.student_profile;
        student_profile.total_sessions = student_profile
            .total_sessions
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        let mentor_profile = &mut ctx.accounts.mentor_profile;
        mentor_profile.total_sessions = mentor_profile
            .total_sessions
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(SessionLogged {
            session_id,
            student: ctx.accounts.student.key(),
            mentor: ctx.accounts.mentor.key(),
            duration,
            session_type,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        session_duration: i64,
        rating: u8,
    ) -> Result<()> {
        require!(rating >= 1 && rating <= 5, ErrorCode::InvalidRating);

        let reputation = &mut ctx.accounts.reputation_state;
        let clock = Clock::get()?;

        reputation.user = ctx.accounts.user.key();
        reputation.sessions_completed = reputation
            .sessions_completed
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;
        reputation.total_duration = reputation
            .total_duration
            .checked_add(session_duration)
            .ok_or(ErrorCode::Overflow)?;

        if reputation.peer_ratings.len() >= 10 {
            reputation.peer_ratings.remove(0);
        }
        reputation.peer_ratings.push(rating);

        let mut total_rating: u64 = 0;
        for r in &reputation.peer_ratings {
            total_rating = total_rating.checked_add(*r as u64).ok_or(ErrorCode::Overflow)?;
        }
        let avg_rating = if reputation.peer_ratings.is_empty() {
            0
        } else {
            total_rating
                .checked_div(reputation.peer_ratings.len() as u64)
                .ok_or(ErrorCode::Overflow)?
        };

        let duration_bonus = (session_duration
            .checked_div(60)
            .ok_or(ErrorCode::Overflow)?
            .min(10) as u64)
            .checked_mul(2)
            .ok_or(ErrorCode::Overflow)?;

        reputation.score = reputation
            .score
            .checked_add(avg_rating)
            .ok_or(ErrorCode::Overflow)?
            .checked_add(duration_bonus)
            .ok_or(ErrorCode::Overflow)?;
        reputation.last_updated = clock.unix_timestamp;

        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.reputation = reputation.score;

        emit!(ReputationUpdated {
            user: ctx.accounts.user.key(),
            new_score: reputation.score,
            sessions_completed: reputation.sessions_completed,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn request_funding(
        ctx: Context<RequestFunding>,
        request_id: Pubkey,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(amount <= 1_000_000_000_000, ErrorCode::AmountTooLarge);
        require!(reason.len() > 0 && reason.len() <= 200, ErrorCode::InvalidReason);
        require!(
            ctx.accounts.user_profile.reputation >= 10,
            ErrorCode::InsufficientReputation
        );

        let request = &mut ctx.accounts.funding_request;
        let clock = Clock::get()?;

        request.request_id = request_id;
        request.requester = ctx.accounts.requester.key();
        request.amount = amount;
        request.reason = reason.clone();
        request.status = FundingStatus::Pending;
        request.reputation_score = ctx.accounts.user_profile.reputation;
        request.timestamp = clock.unix_timestamp;
        request.bump = ctx.bumps.funding_request;

        let treasury = &mut ctx.accounts.treasury;
        treasury.active_requests = treasury
            .active_requests
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(FundingRequested {
            request_id,
            requester: ctx.accounts.requester.key(),
            amount,
            reason,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.total_funds = 0;
        treasury.distributed_funds = 0;
        treasury.active_requests = 0;
        treasury.bump = ctx.bumps.treasury;

        emit!(TreasuryInitialized {
            authority: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn approve_funding(ctx: Context<ApproveFunding>) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;

        require!(
            request.status == FundingStatus::Pending,
            ErrorCode::RequestNotPending
        );
        require!(
            ctx.accounts.authority.key() == ctx.accounts.treasury.authority,
            ErrorCode::Unauthorized
        );
        require!(
            ctx.accounts.treasury.total_funds >= request.amount,
            ErrorCode::InsufficientTreasuryFunds
        );

        request.status = FundingStatus::Approved;

        emit!(FundingApproved {
            request_id: request.request_id,
            approved_by: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn reject_funding(ctx: Context<ApproveFunding>) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;

        require!(
            request.status == FundingStatus::Pending,
            ErrorCode::RequestNotPending
        );
        require!(
            ctx.accounts.authority.key() == ctx.accounts.treasury.authority,
            ErrorCode::Unauthorized
        );

        request.status = FundingStatus::Rejected;

        let treasury = &mut ctx.accounts.treasury;
        treasury.active_requests = treasury
            .active_requests
            .checked_sub(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(FundingRejected {
            request_id: request.request_id,
            rejected_by: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn distribute_funds(ctx: Context<DistributeFunds>) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;
        let treasury = &mut ctx.accounts.treasury;

        require!(
            request.status == FundingStatus::Approved,
            ErrorCode::RequestNotApproved
        );
        require!(
            ctx.accounts.authority.key() == treasury.authority,
            ErrorCode::Unauthorized
        );

        let amount = request.amount;
        let requester_key = request.requester;

        **treasury
            .to_account_info()
            .try_borrow_mut_lamports()? = treasury
            .to_account_info()
            .lamports()
            .checked_sub(amount)
            .ok_or(ErrorCode::InsufficientTreasuryFunds)?;

        **ctx
            .accounts
            .requester
            .to_account_info()
            .try_borrow_mut_lamports()? = ctx
            .accounts
            .requester
            .to_account_info()
            .lamports()
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        request.status = FundingStatus::Distributed;

        treasury.distributed_funds = treasury
            .distributed_funds
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        treasury.active_requests = treasury
            .active_requests
            .checked_sub(1)
            .ok_or(ErrorCode::Overflow)?;
        treasury.total_funds = treasury
            .total_funds
            .checked_sub(amount)
            .ok_or(ErrorCode::Overflow)?;

        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.total_funded = user_profile
            .total_funded
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        emit!(FundsDistributed {
            request_id: request.request_id,
            requester: requester_key,
            amount,
            treasury_balance: treasury.total_funds,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn close_request(ctx: Context<CloseRequest>) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;

        require!(
            request.requester == ctx.accounts.requester.key(),
            ErrorCode::Unauthorized
        );
        require!(
            request.status == FundingStatus::Pending,
            ErrorCode::RequestNotPending
        );

        request.status = FundingStatus::Cancelled;

        let treasury = &mut ctx.accounts.treasury;
        treasury.active_requests = treasury
            .active_requests
            .checked_sub(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(FundingCancelled {
            request_id: request.request_id,
            requester: ctx.accounts.requester.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + UserProfile::LEN,
        seeds = [b"user-profile", authority.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(
        mut,
        seeds = [b"user-profile", authority.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-profile", admin.key().as_ref()],
        bump = admin_profile.bump
    )]
    pub admin_profile: Account<'info, UserProfile>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(session_id: Pubkey)]
pub struct LogSession<'info> {
    #[account(
        init,
        payer = student,
        space = 8 + MentorshipSession::LEN,
        seeds = [b"session", session_id.as_ref()],
        bump
    )]
    pub session: Account<'info, MentorshipSession>,

    #[account(mut)]
    pub student: Signer<'info>,

    /// Mentor must also sign to confirm
    pub mentor: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-profile", student.key().as_ref()],
        bump = student_profile.bump
    )]
    pub student_profile: Account<'info, UserProfile>,

    #[account(
        mut,
        seeds = [b"user-profile", mentor.key().as_ref()],
        bump = mentor_profile.bump
    )]
    pub mentor_profile: Account<'info, UserProfile>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateReputation<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + ReputationState::LEN + 10,
        seeds = [b"reputation", user.key().as_ref()],
        bump
    )]
    pub reputation_state: Account<'info, ReputationState>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-profile", user.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(request_id: Pubkey)]
pub struct RequestFunding<'info> {
    #[account(
        init,
        payer = requester,
        space = 8 + FundingRequest::LEN,
        seeds = [b"funding", request_id.as_ref()],
        bump
    )]
    pub funding_request: Account<'info, FundingRequest>,

    #[account(mut)]
    pub requester: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-profile", requester.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, TreasuryPool>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TreasuryPool::LEN,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, TreasuryPool>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveFunding<'info> {
    #[account(
        mut,
        seeds = [b"funding", funding_request.request_id.as_ref()],
        bump = funding_request.bump
    )]
    pub funding_request: Account<'info, FundingRequest>,

    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, TreasuryPool>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DistributeFunds<'info> {
    #[account(
        mut,
        seeds = [b"funding", funding_request.request_id.as_ref()],
        bump = funding_request.bump
    )]
    pub funding_request: Account<'info, FundingRequest>,

    #[account(
        mut,
        seeds = [b"user-profile", funding_request.requester.as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, TreasuryPool>,

    #[account(
        mut,
        address = funding_request.requester
    )]
    pub requester: AccountInfo<'info>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseRequest<'info> {
    #[account(
        mut,
        seeds = [b"funding", funding_request.request_id.as_ref()],
        bump = funding_request.bump
    )]
    pub funding_request: Account<'info, FundingRequest>,

    #[account(mut)]
    pub requester: Signer<'info>,

    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, TreasuryPool>,

    #[account(
        mut,
        seeds = [b"user-profile", requester.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Name exceeds maximum length of 50 characters")]
    NameTooLong,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Session duration must be between 1 and 1440 minutes")]
    InvalidDuration,
    #[msg("Topic exceeds maximum length of 64 characters")]
    TopicTooLong,
    #[msg("Cannot log a session with yourself")]
    SelfSessionNotAllowed,
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Reputation below minimum threshold of 10")]
    InsufficientReputation,
    #[msg("Funding amount must be greater than 0")]
    InvalidAmount,
    #[msg("Funding amount exceeds maximum of 1000 SOL")]
    AmountTooLarge,
    #[msg("Reason must be between 1 and 200 characters")]
    InvalidReason,
    #[msg("Funding request is not in pending state")]
    RequestNotPending,
    #[msg("Funding request is not approved")]
    RequestNotApproved,
    #[msg("Insufficient treasury funds")]
    InsufficientTreasuryFunds,
    #[msg("User profile not found")]
    ProfileNotFound,
}
