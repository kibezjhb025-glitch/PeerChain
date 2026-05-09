export interface UserProfile {
  authority: string
  name: string
  role: number
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
  topic: string
  completed: boolean
  timestamp: number
  bump: number
}

export enum SessionType {
  OneOnOne,
  GroupStudy,
  CodeReview,
  Mentorship,
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
  Pending,
  Approved,
  Rejected,
  Distributed,
  Cancelled,
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

export interface WalletVerificationRequest {
  wallet: string
  signature: string
  message: string
}

export interface WalletVerificationResponse {
  verified: boolean
  wallet: string
  message: string
}

export interface FundingActionRequest {
  authority: string
  requestId: string
  action: "approve" | "reject"
}

export interface DistributeRequest {
  authority: string
  requestId: string
}

export interface UserCreateRequest {
  wallet: string
  name: string
}

export interface SessionLogRequest {
  sessionId: string
  student: string
  mentor: string
  duration: number
  sessionType: SessionType
  topic: string
}

export interface ReputationUpdateRequest {
  user: string
  sessionDuration: number
  rating: number
}

export interface FundingRequestPayload {
  requestId: string
  requester: string
  amount: number
  reason: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  source?: string
}

export interface TransactionResponse {
  transaction: string
  message: string
}

export interface AudioBriefRequest {
  text: string
  voiceId?: string
}

export interface AudioBriefResponse {
  audioUrl: string
  transcript: string
}

export interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  link: string | null
  createdAt: string
}

export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string | null
  wallet: string | null
  txSignature: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}
