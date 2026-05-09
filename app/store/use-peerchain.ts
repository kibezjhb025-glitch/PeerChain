import { create } from "zustand"
import { PublicKey } from "@solana/web3.js"
import { dedupFetch, invalidateCache } from "@/lib/api-client"

interface UserProfile {
  id: string
  email: string
  name: string | null
  walletAddress: string | null
  role: "STUDENT" | "TUTOR" | "VOLUNTEER" | "ADMIN"
  reputationScore: number
}

interface Session {
  id: string
  mentorId: string
  studentId: string
  topic: string
  duration: number
  rating: number | null
  completed: boolean
  createdAt: string
}

interface FundingRequest {
  id: string
  userId: string
  amount: number
  reason: string
  status: string
  voicePitchUrl: string | null
  createdAt: string
}

interface ReputationData {
  user: string
  score: number
  sessionsCompleted: number
  totalDuration: number
  peerRatings: number[]
  lastUpdated: number
}

interface SessionData {
  sessionId: string
  student: string
  mentor: string
  duration: number
  sessionType: string
  completed: boolean
  timestamp: number
}

interface FundingData {
  requestId: string
  requester: string
  amount: number
  reason: string
  status: string
  reputationScore: number
  timestamp: number
}

interface PeerChainState {
  // Auth
  isAuthenticated: boolean
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  setIsAuthenticated: (val: boolean) => void

  // Wallet
  walletAddress: string | null
  walletBalance: number | null
  setWalletAddress: (address: string | null) => void
  setWalletBalance: (balance: number | null) => void

  // Sessions
  sessions: Session[]
  setSessions: (sessions: Session[]) => void
  addSession: (session: Session) => void

  // Funding
  fundingRequests: FundingRequest[]
  setFundingRequests: (requests: FundingRequest[]) => void

  // UI
  isSidebarCollapsed: boolean
  toggleSidebar: () => void

  // Loading
  isLoading: boolean
  setIsLoading: (val: boolean) => void

  // Cached API data
  cachedReputation: ReputationData | null
  cachedSessions: SessionData[]
  cachedFunding: FundingData[]
  reputationLoading: boolean
  sessionsLoading: boolean
  fundingLoading: boolean
  transactionsLoading: boolean
  cachedTransactions: any[]
  fetchAllData: (publicKey: string) => Promise<void>
  setCachedReputation: (data: ReputationData | null) => void
  setCachedSessions: (data: SessionData[]) => void
  setCachedFunding: (data: FundingData[]) => void
  setCachedTransactions: (data: any[]) => void
  setTransactionsLoading: (val: boolean) => void
}

export const usePeerChainStore = create<PeerChainState>((set, get) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),

  // Wallet
  walletAddress: null,
  walletBalance: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setWalletBalance: (balance) => set({ walletBalance: balance }),

  // Sessions
  sessions: [],
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),

  // Funding
  fundingRequests: [],
  setFundingRequests: (requests) => set({ fundingRequests: requests }),

  // UI
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Loading
  isLoading: false,
  setIsLoading: (val) => set({ isLoading: val }),

  // Cached API data
  cachedReputation: null,
  cachedSessions: [],
  cachedFunding: [],
  reputationLoading: false,
  sessionsLoading: false,
  fundingLoading: false,
  transactionsLoading: false,
  cachedTransactions: [],
  setCachedReputation: (data) => set({ cachedReputation: data, reputationLoading: false }),
  setCachedSessions: (data) => set({ cachedSessions: data, sessionsLoading: false }),
  setCachedFunding: (data) => set({ cachedFunding: data, fundingLoading: false }),
  setCachedTransactions: (data) => set({ cachedTransactions: data, transactionsLoading: false }),
  setTransactionsLoading: (val) => set({ transactionsLoading: val }),

  fetchAllData: async (publicKey: string) => {
    set({ reputationLoading: true, sessionsLoading: true, fundingLoading: true })

    const results = await Promise.allSettled([
      dedupFetch<ReputationData>(`/api/reputation?user=${publicKey}`),
      dedupFetch<SessionData[]>(`/api/sessions?user=${publicKey}`),
      dedupFetch<FundingData[]>(`/api/funding?user=${publicKey}`),
    ])

    const repResult = results[0]
    const sessResult = results[1]
    const fundResult = results[2]

    if (repResult.status === "fulfilled" && repResult.value.success) {
      set({ cachedReputation: repResult.value.data, reputationLoading: false })
    } else {
      set({ reputationLoading: false })
    }

    if (sessResult.status === "fulfilled" && sessResult.value.success) {
      set({ cachedSessions: sessResult.value.data, sessionsLoading: false })
    } else {
      set({ sessionsLoading: false })
    }

    if (fundResult.status === "fulfilled" && fundResult.value.success) {
      set({ cachedFunding: fundResult.value.data, fundingLoading: false })
    } else {
      set({ fundingLoading: false })
    }
  },
}))
