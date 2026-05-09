use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    pub authority: Pubkey,
    pub name: String,
    pub role: UserRole,
    pub reputation: u64,
    pub total_sessions: u64,
    pub total_funded: u64,
    pub bump: u8,
}

impl UserProfile {
    pub const LEN: usize = 32 + 4 + 50 + 1 + 8 + 8 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum UserRole {
    Student,
    Mentor,
    Volunteer,
    Admin,
}

#[account]
pub struct MentorshipSession {
    pub session_id: Pubkey,
    pub student: Pubkey,
    pub mentor: Pubkey,
    pub duration: i64,
    pub session_type: SessionType,
    pub topic: String,
    pub completed: bool,
    pub timestamp: i64,
    pub bump: u8,
}

impl MentorshipSession {
    pub const LEN: usize = 32 + 32 + 32 + 8 + 1 + 4 + 64 + 1 + 8 + 1;
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
    pub const LEN: usize = 32 + 32 + 8 + 4 + 200 + 1 + 8 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum FundingStatus {
    Pending,
    Approved,
    Rejected,
    Distributed,
    Cancelled,
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
    pub const LEN: usize = 32 + 8 + 8 + 4 + 10 + 8 + 8 + 1;
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
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1;
}

#[event]
pub struct UserCreated {
    pub authority: Pubkey,
    pub name: String,
    pub timestamp: i64,
}

#[event]
pub struct UserUpdated {
    pub authority: Pubkey,
    pub name: String,
    pub new_role: UserRole,
    pub timestamp: i64,
}

#[event]
pub struct SessionLogged {
    pub session_id: Pubkey,
    pub student: Pubkey,
    pub mentor: Pubkey,
    pub duration: i64,
    pub session_type: SessionType,
    pub timestamp: i64,
}

#[event]
pub struct ReputationUpdated {
    pub user: Pubkey,
    pub new_score: u64,
    pub sessions_completed: u64,
    pub timestamp: i64,
}

#[event]
pub struct FundingRequested {
    pub request_id: Pubkey,
    pub requester: Pubkey,
    pub amount: u64,
    pub reason: String,
    pub timestamp: i64,
}

#[event]
pub struct FundingApproved {
    pub request_id: Pubkey,
    pub approved_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct FundingRejected {
    pub request_id: Pubkey,
    pub rejected_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct FundsDistributed {
    pub request_id: Pubkey,
    pub requester: Pubkey,
    pub amount: u64,
    pub treasury_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct FundingCancelled {
    pub request_id: Pubkey,
    pub requester: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TreasuryInitialized {
    pub authority: Pubkey,
    pub timestamp: i64,
}
