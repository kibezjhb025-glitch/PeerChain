import { PublicKey, Connection, AccountInfo } from "@solana/web3.js"
import { PROGRAM_ID, getUserProfilePda, getReputationPda, getFundingPda, getTreasuryPda, getSessionPda } from "./pda"
import { getConnection } from "@/lib/connection"

const connection = getConnection()

function decodeAccount<T>(
  accountInfo: AccountInfo<Buffer> | null,
  decodeFn: (buffer: Buffer) => T
): T | null {
  if (!accountInfo) return null
  if (accountInfo.data.length < 8) return null
  const data = accountInfo.data.slice(8)
  try {
    return decodeFn(data)
  } catch {
    return null
  }
}

function readString(buf: Buffer, offset: number): { value: string; newOffset: number } {
  const len = buf.readUInt32LE(offset)
  const value = buf.slice(offset + 4, offset + 4 + len).toString("utf-8")
  return { value, newOffset: offset + 4 + len }
}

function readPubkey(buf: Buffer, offset: number): { value: PublicKey; newOffset: number } {
  return { value: new PublicKey(buf.slice(offset, offset + 32)), newOffset: offset + 32 }
}

function readU64(buf: Buffer, offset: number): { value: number; newOffset: number } {
  const value = Number(buf.readBigUInt64LE(offset))
  return { value, newOffset: offset + 8 }
}

function readI64(buf: Buffer, offset: number): { value: number; newOffset: number } {
  const value = Number(buf.readBigInt64LE(offset))
  return { value, newOffset: offset + 8 }
}

function readU8(buf: Buffer, offset: number): { value: number; newOffset: number } {
  return { value: buf.readUInt8(offset), newOffset: offset + 1 }
}

function readBool(buf: Buffer, offset: number): { value: boolean; newOffset: number } {
  return { value: buf.readUInt8(offset) === 1, newOffset: offset + 1 }
}

function readVecU8(buf: Buffer, offset: number): { value: number[]; newOffset: number } {
  const len = buf.readUInt32LE(offset)
  const values: number[] = []
  for (let i = 0; i < len; i++) {
    values.push(buf.readUInt8(offset + 4 + i))
  }
  return { value: values, newOffset: offset + 4 + len }
}

export interface DecodedUserProfile {
  authority: string
  name: string
  role: number
  reputation: number
  totalSessions: number
  totalFunded: number
  bump: number
}

export function decodeUserProfile(buf: Buffer): DecodedUserProfile {
  let offset = 0
  const { value: authority, newOffset: o1 } = readPubkey(buf, offset); offset = o1
  const { value: name, newOffset: o2 } = readString(buf, offset); offset = o2
  const { value: role, newOffset: o3 } = readU8(buf, offset); offset = o3
  const { value: reputation, newOffset: o4 } = readU64(buf, offset); offset = o4
  const { value: totalSessions, newOffset: o5 } = readU64(buf, offset); offset = o5
  const { value: totalFunded, newOffset: o6 } = readU64(buf, offset); offset = o6
  const { value: bump } = readU8(buf, offset)
  return { authority: authority.toBase58(), name, role, reputation, totalSessions, totalFunded, bump }
}

export interface DecodedMentorshipSession {
  sessionId: string
  student: string
  mentor: string
  duration: number
  sessionType: number
  topic: string
  completed: boolean
  timestamp: number
  bump: number
}

export function decodeMentorshipSession(buf: Buffer): DecodedMentorshipSession {
  let offset = 0
  const { value: sessionId, newOffset: o1 } = readPubkey(buf, offset); offset = o1
  const { value: student, newOffset: o2 } = readPubkey(buf, offset); offset = o2
  const { value: mentor, newOffset: o3 } = readPubkey(buf, offset); offset = o3
  const { value: duration, newOffset: o4 } = readI64(buf, offset); offset = o4
  const { value: sessionType, newOffset: o5 } = readU8(buf, offset); offset = o5
  const { value: topic, newOffset: o6 } = readString(buf, offset); offset = o6
  const { value: completed, newOffset: o7 } = readBool(buf, offset); offset = o7
  const { value: timestamp, newOffset: o8 } = readI64(buf, offset); offset = o8
  const { value: bump } = readU8(buf, offset)
  return { sessionId: sessionId.toBase58(), student: student.toBase58(), mentor: mentor.toBase58(), duration, sessionType, topic, completed, timestamp, bump }
}

export interface DecodedFundingRequest {
  requestId: string
  requester: string
  amount: number
  reason: string
  status: number
  reputationScore: number
  timestamp: number
  bump: number
}

export function decodeFundingRequest(buf: Buffer): DecodedFundingRequest {
  let offset = 0
  const { value: requestId, newOffset: o1 } = readPubkey(buf, offset); offset = o1
  const { value: requester, newOffset: o2 } = readPubkey(buf, offset); offset = o2
  const { value: amount, newOffset: o3 } = readU64(buf, offset); offset = o3
  const { value: reason, newOffset: o4 } = readString(buf, offset); offset = o4
  const { value: status, newOffset: o5 } = readU8(buf, offset); offset = o5
  const { value: reputationScore, newOffset: o6 } = readU64(buf, offset); offset = o6
  const { value: timestamp, newOffset: o7 } = readI64(buf, offset); offset = o7
  const { value: bump } = readU8(buf, offset)
  return { requestId: requestId.toBase58(), requester: requester.toBase58(), amount, reason, status, reputationScore, timestamp, bump }
}

export interface DecodedReputationState {
  user: string
  sessionsCompleted: number
  totalDuration: number
  peerRatings: number[]
  score: number
  lastUpdated: number
  bump: number
}

export function decodeReputationState(buf: Buffer): DecodedReputationState {
  let offset = 0
  const { value: user, newOffset: o1 } = readPubkey(buf, offset); offset = o1
  const { value: sessionsCompleted, newOffset: o2 } = readU64(buf, offset); offset = o2
  const { value: totalDuration, newOffset: o3 } = readI64(buf, offset); offset = o3
  const { value: peerRatings, newOffset: o4 } = readVecU8(buf, offset); offset = o4
  const { value: score, newOffset: o5 } = readU64(buf, offset); offset = o5
  const { value: lastUpdated, newOffset: o6 } = readI64(buf, offset); offset = o6
  const { value: bump } = readU8(buf, offset)
  return { user: user.toBase58(), sessionsCompleted, totalDuration, peerRatings, score, lastUpdated, bump }
}

export interface DecodedTreasuryPool {
  authority: string
  totalFunds: number
  distributedFunds: number
  activeRequests: number
  bump: number
}

export function decodeTreasuryPool(buf: Buffer): DecodedTreasuryPool {
  let offset = 0
  const { value: authority, newOffset: o1 } = readPubkey(buf, offset); offset = o1
  const { value: totalFunds, newOffset: o2 } = readU64(buf, offset); offset = o2
  const { value: distributedFunds, newOffset: o3 } = readU64(buf, offset); offset = o3
  const { value: activeRequests, newOffset: o4 } = readU64(buf, offset); offset = o4
  const { value: bump } = readU8(buf, offset)
  return { authority: authority.toBase58(), totalFunds, distributedFunds, activeRequests, bump }
}

export async function fetchUserProfile(wallet: PublicKey): Promise<DecodedUserProfile | null> {
  const { pda } = getUserProfilePda(wallet)
  const info = await connection.getAccountInfo(pda)
  return decodeAccount(info, decodeUserProfile)
}

export async function fetchUserProfileByPda(pda: PublicKey): Promise<DecodedUserProfile | null> {
  const info = await connection.getAccountInfo(pda)
  return decodeAccount(info, decodeUserProfile)
}

export async function fetchReputation(wallet: PublicKey): Promise<DecodedReputationState | null> {
  const { pda } = getReputationPda(wallet)
  const info = await connection.getAccountInfo(pda)
  return decodeAccount(info, decodeReputationState)
}

export async function fetchFundingRequest(requestId: PublicKey): Promise<DecodedFundingRequest | null> {
  const { pda } = getFundingPda(requestId)
  const info = await connection.getAccountInfo(pda)
  return decodeAccount(info, decodeFundingRequest)
}

export async function fetchTreasury(): Promise<DecodedTreasuryPool | null> {
  const { pda } = getTreasuryPda()
  const info = await connection.getAccountInfo(pda)
  return decodeAccount(info, decodeTreasuryPool)
}

export async function fetchAllFundingRequests(): Promise<DecodedFundingRequest[]> {
  const { pda: treasuryPda } = getTreasuryPda()
  const programId = PROGRAM_ID

  const accounts = await connection.getProgramAccounts(programId, {
    filters: [
      {
        memcmp: {
          offset: 0,
          bytes: programId.toBase58(),
        },
      },
    ],
  })

  return accounts
    .filter((a) => a.account.data.length >= 8)
    .map((a) => decodeAccount(a.account.data, decodeFundingRequest))
    .filter((r): r is DecodedFundingRequest => r !== null)
}

export async function fetchAllSessionsForUser(wallet: PublicKey): Promise<DecodedMentorshipSession[]> {
  const programId = PROGRAM_ID
  const walletBase58 = wallet.toBase58()

  const accounts = await connection.getProgramAccounts(programId, {
    filters: [
      {
        memcmp: {
          offset: 0,
          bytes: programId.toBase58(),
        },
      },
    ],
  })

  return accounts
    .filter((a) => a.account.data.length >= 8)
    .map((a) => decodeAccount(a.account.data, decodeMentorshipSession))
    .filter((r): r is DecodedMentorshipSession => r !== null)
    .filter((s) => s.student === walletBase58 || s.mentor === walletBase58)
}
