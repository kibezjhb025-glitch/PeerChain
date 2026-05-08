use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    pub authority: Pubkey,
    pub name: String,
    pub reputation: u64,
    pub total_sessions: u64,
    pub total_funded: u64,
    pub bump: u8,
}

impl UserProfile {
    pub const LEN: usize = 32 + // authority
        4 + 50 + // name (max 50 chars)
        8 + // reputation
        8 + // total_sessions
        8 + // total_funded
        1; // bump
}

#[account]
pub struct MentorshipSession {
    pub session_id: Pubkey,
    pub student: Pubkey,
    pub mentor: Pubkey,
    pub duration: i64,
    pub session_type: SessionType,
    pub completed: bool,
    pub timestamp: i64,
    pub bump: u8,
}

impl MentorshipSession {
    pub const LEN: usize = 32 + // session_id
        32 + // student
        32 + // mentor
        8 + // duration
        1 + // session_type
        1 + // completed
        8 + // timestamp
        1; // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SessionType {
    OneOnOne,
    GroupStudy,
    CodeReview,
    Mentorship,
}

#[account]
pub struct FundingRequest {
    pub request_id: Pubkey,
    pub requester: Pubkey,
    pub amount: u64,
    pub reason: String,
    pub status: FundingStatus,
    pub reputation_score: u64,
    pub timestamp: i64,
    pub bump: u8,
}

impl FundingRequest {
    pub const LEN: usize = 32 + // request_id
        32 + // requester
        8 + // amount
        4 + 200 + // reason (max 200 chars)
        1 + // status
        8 + // reputation_score
        8 + // timestamp
        1; // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum FundingStatus {
    Pending,
    Approved,
    Rejected,
    Distributed,
}

#[account]
pub struct ReputationState {
    pub user: Pubkey,
    pub sessions_completed: u64,
    pub total_duration: i64,
    pub peer_ratings: Vec<u8>,
    pub score: u64,
    pub last_updated: i64,
    pub bump: u8,
}

impl ReputationState {
    pub const LEN: usize = 32 + // user
        8 + // sessions_completed
        8 + // total_duration
        4 + 10 + // peer_ratings (max 10 ratings)
        8 + // score
        8 + // last_updated
        1; // bump
}

#[account]
pub struct TreasuryPool {
    pub authority: Pubkey,
    pub total_funds: u64,
    pub distributed_funds: u64,
    pub active_requests: u64,
    pub bump: u8,
}

impl TreasuryPool {
    pub const LEN: usize = 32 + // authority
        8 + // total_funds
        8 + // distributed_funds
        8 + // active_requests
        1; // bump
}
