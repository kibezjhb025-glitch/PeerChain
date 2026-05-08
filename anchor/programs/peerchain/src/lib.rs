use anchor_lang::prelude::*;
use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod peerchain {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>, name: String) -> Result<()> {
        let profile = &mut ctx.accounts.user_profile;
        profile.authority = ctx.accounts.authority.key();
        profile.name = name;
        profile.reputation = 0;
        profile.total_sessions = 0;
        profile.total_funded = 0;
        profile.bump = ctx.bumps.user_profile;

        msg!("User profile created for: {}", profile.authority);
        Ok(())
    }

    pub fn log_session(
        ctx: Context<LogSession>,
        session_id: Pubkey,
        duration: i64,
        session_type: SessionType,
    ) -> Result<()> {
        let session = &mut ctx.accounts.session;
        let clock = Clock::get()?;

        session.session_id = session_id;
        session.student = ctx.accounts.student.key();
        session.mentor = ctx.accounts.mentor.key();
        session.duration = duration;
        session.session_type = session_type;
        session.completed = true;
        session.timestamp = clock.unix_timestamp;
        session.bump = ctx.bumps.session;

        let student_profile = &mut ctx.accounts.student_profile;
        student_profile.total_sessions = student_profile
            .total_sessions
            .checked_add(1)
            .unwrap();

        let mentor_profile = &mut ctx.accounts.mentor_profile;
        mentor_profile.total_sessions = mentor_profile
            .total_sessions
            .checked_add(1)
            .unwrap();

        msg!("Session logged: {} minutes", duration);
        Ok(())
    }

    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        session_duration: i64,
        rating: u8,
    ) -> Result<()> {
        let reputation = &mut ctx.accounts.reputation_state;
        let clock = Clock::get()?;

        reputation.user = ctx.accounts.user.key();
        reputation.sessions_completed = reputation
            .sessions_completed
            .checked_add(1)
            .unwrap();
        reputation.total_duration = reputation
            .total_duration
            .checked_add(session_duration)
            .unwrap();

        if rating > 0 && rating <= 5 {
            let new_rating = [rating];
            reputation.peer_ratings = [reputation.peer_ratings.as_slice(), &new_rating].concat();
            if reputation.peer_ratings.len() > 10 {
                reputation.peer_ratings.remove(0);
            }
        }

        let mut total_rating: u64 = 0;
        for r in &reputation.peer_ratings {
            total_rating = total_rating.checked_add(*r as u64).unwrap();
        }
        let avg_rating = if reputation.peer_ratings.is_empty() {
            0
        } else {
            total_rating
                .checked_div(reputation.peer_ratings.len() as u64)
                .unwrap()
        };

        let duration_bonus = (session_duration
            .checked_div(60)
            .unwrap()
            .min(10) as u64)
            .checked_mul(2)
            .unwrap();

        reputation.score = reputation
            .score
            .checked_add(avg_rating)
            .unwrap()
            .checked_add(duration_bonus)
            .unwrap();
        reputation.last_updated = clock.unix_timestamp;

        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.reputation = reputation.score;

        msg!("Reputation updated: {}", reputation.score);
        Ok(())
    }

    pub fn request_funding(
        ctx: Context<RequestFunding>,
        request_id: Pubkey,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;
        let clock = Clock::get()?;

        require!(
            ctx.accounts.user_profile.reputation >= 10,
            FundingError::InsufficientReputation
        );

        request.request_id = request_id;
        request.requester = ctx.accounts.requester.key();
        request.amount = amount;
        request.reason = reason;
        request.status = FundingStatus::Pending;
        request.reputation_score = ctx.accounts.user_profile.reputation;
        request.timestamp = clock.unix_timestamp;
        request.bump = ctx.bumps.funding_request;

        let treasury = &mut ctx.accounts.treasury;
        treasury.active_requests = treasury
            .active_requests
            .checked_add(1)
            .unwrap();

        msg!("Funding request submitted: {} lamports", amount);
        Ok(())
    }

    pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.total_funds = 0;
        treasury.distributed_funds = 0;
        treasury.active_requests = 0;
        treasury.bump = ctx.bumps.treasury;

        msg!("Treasury initialized");
        Ok(())
    }

    pub fn approve_funding(ctx: Context<ApproveFunding>) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;

        require!(
            request.status == FundingStatus::Pending,
            FundingError::RequestNotPending
        );

        require!(
            ctx.accounts.authority.key() == ctx.accounts.treasury.authority,
            FundingError::Unauthorized
        );

        require!(
            ctx.accounts.treasury.total_funds >= request.amount,
            FundingError::InsufficientTreasuryFunds
        );

        request.status = FundingStatus::Approved;

        msg!("Funding request approved");
        Ok(())
    }

    pub fn distribute_funds(ctx: Context<DistributeFunds>) -> Result<()> {
        let request = &mut ctx.accounts.funding_request;
        let treasury = &mut ctx.accounts.treasury;

        require!(
            request.status == FundingStatus::Approved,
            FundingError::RequestNotApproved
        );

        let amount = request.amount;
        let requester = request.requester;

        **treasury.to_account_info().try_borrow_mut_lamports()? = treasury
            .to_account_info()
            .lamports()
            .checked_sub(amount)
            .ok_or(FundingError::InsufficientTreasuryFunds)?;

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
            .unwrap();

        request.status = FundingStatus::Distributed;

        treasury.distributed_funds = treasury
            .distributed_funds
            .checked_add(amount)
            .unwrap();
        treasury.active_requests = treasury
            .active_requests
            .checked_sub(1)
            .unwrap();
        treasury.total_funds = treasury
            .total_funds
            .checked_sub(amount)
            .unwrap();

        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.total_funded = user_profile
            .total_funded
            .checked_add(amount)
            .unwrap();

        msg!("Funds distributed: {} lamports to {}", amount, requester);
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

    pub student: Signer<'info>,
    pub mentor: AccountInfo<'info>,

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
        space = 8 + ReputationState::LEN,
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

#[error_code]
pub enum FundingError {
    InsufficientReputation,
    RequestNotApproved,
    InsufficientTreasuryFunds,
    Unauthorized,
    RequestNotPending,
}
