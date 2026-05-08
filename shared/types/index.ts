// PeerChain Shared Types
// These interfaces mirror the Anchor program accounts

export interface UserProfile {
  authority: string
  name: string
  reputation: number
  totalSessions: number
  totalFunded: number
  bump: number
}

export interface MentorshipSession {
  sessionId: string
  student: string
  mentor: string
  duration: number
  sessionType: SessionType
  completed: boolean
  timestamp: number
  bump: number
}

export enum SessionType {
  OneOnOne = "OneOnOne",
  GroupStudy = "GroupStudy",
  CodeReview = "CodeReview",
  Mentorship = "Mentorship",
}

export interface FundingRequest {
  requestId: string
  requester: string
  amount: number
  reason: string
  status: FundingStatus
  reputationScore: number
  timestamp: number
  bump: number
}

export enum FundingStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Distributed = "Distributed",
}

export interface ReputationState {
  user: string
  sessionsCompleted: number
  totalDuration: number
  peerRatings: number[]
  score: number
  lastUpdated: number
  bump: number
}

export interface TreasuryPool {
  authority: string
  totalFunds: number
  distributedFunds: number
  activeRequests: number
  bump: number
}

// Frontend state types
export interface PeerChainState {
  userProfile: UserProfile | null
  reputation: ReputationState | null
  sessions: MentorshipSession[]
  fundingRequests: FundingRequest[]
  treasury: TreasuryPool | null
  loading: boolean
  error: string | null
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface SessionLogRequest {
  sessionId: string
  student: string
  mentor: string
  duration: number
  sessionType: SessionType
}

export interface FundingRequestPayload {
  requestId: string
  amount: number
  reason: string
  reputationScore: number
}

// ElevenLabs types
export interface AudioBriefRequest {
  text: string
  voiceId?: string
}

export interface AudioBriefResponse {
  audioUrl: string
  transcript: string
}
