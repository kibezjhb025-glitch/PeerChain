import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js"
import { PROGRAM_ID, getUserProfilePda, getSessionPda, getReputationPda, getFundingPda, getTreasuryPda } from "./pda"
import { getConnection } from "@/lib/connection"

const connection = getConnection()

async function createInstruction(
  data: Buffer,
  accounts: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[]
): Promise<TransactionInstruction> {
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    data,
    keys: accounts.map((a) => ({
      pubkey: a.pubkey,
      isSigner: a.isSigner,
      isWritable: a.isWritable,
    })),
  })
}

function packCreateUserData(name: string): Buffer {
  const nameBytes = Buffer.from(name, "utf-8")
  const data = Buffer.alloc(1 + 4 + nameBytes.length)
  let offset = 0
  data.writeUInt8(0, offset); offset += 1
  data.writeUInt32LE(nameBytes.length, offset); offset += 4
  nameBytes.copy(data, offset)
  return data
}

export async function buildCreateUserTransaction(
  wallet: PublicKey,
  name: string
): Promise<Transaction> {
  const { pda: userProfilePda } = getUserProfilePda(wallet)
  const ix = await createInstruction(packCreateUserData(name), [
    { pubkey: userProfilePda, isSigner: false, isWritable: true },
    { pubkey: wallet, isSigner: true, isWritable: true },
    { pubkey: PublicKey.default, isSigner: false, isWritable: false },
  ])
  return buildTransaction([ix], wallet)
}

function packLogSessionData(sessionId: PublicKey, duration: number, sessionType: number, topic: string): Buffer {
  const topicBytes = Buffer.from(topic, "utf-8")
  const data = Buffer.alloc(1 + 32 + 8 + 1 + 4 + topicBytes.length)
  let offset = 0
  data.writeUInt8(1, offset); offset += 1
  sessionId.toBuffer().copy(data, offset); offset += 32
  data.writeBigInt64LE(BigInt(duration), offset); offset += 8
  data.writeUInt8(sessionType, offset); offset += 1
  data.writeUInt32LE(topicBytes.length, offset); offset += 4
  topicBytes.copy(data, offset)
  return data
}

export async function buildLogSessionTransaction(
  student: PublicKey,
  mentor: PublicKey,
  sessionId: PublicKey,
  duration: number,
  sessionType: number,
  topic: string
): Promise<Transaction> {
  const { pda: sessionPda } = getSessionPda(sessionId)
  const { pda: studentProfilePda } = getUserProfilePda(student)
  const { pda: mentorProfilePda } = getUserProfilePda(mentor)

  const ix = await createInstruction(packLogSessionData(sessionId, duration, sessionType, topic), [
    { pubkey: sessionPda, isSigner: false, isWritable: true },
    { pubkey: student, isSigner: true, isWritable: true },
    { pubkey: mentor, isSigner: true, isWritable: false },
    { pubkey: studentProfilePda, isSigner: false, isWritable: true },
    { pubkey: mentorProfilePda, isSigner: false, isWritable: true },
    { pubkey: PublicKey.default, isSigner: false, isWritable: false },
  ])
  return buildTransaction([ix], student)
}

function packUpdateReputationData(sessionDuration: number, rating: number): Buffer {
  const data = Buffer.alloc(1 + 8 + 1)
  let offset = 0
  data.writeUInt8(2, offset); offset += 1
  data.writeBigInt64LE(BigInt(sessionDuration), offset); offset += 8
  data.writeUInt8(rating, offset)
  return data
}

export async function buildUpdateReputationTransaction(
  wallet: PublicKey,
  sessionDuration: number,
  rating: number
): Promise<Transaction> {
  const { pda: reputationPda } = getReputationPda(wallet)
  const { pda: userProfilePda } = getUserProfilePda(wallet)

  const ix = await createInstruction(packUpdateReputationData(sessionDuration, rating), [
    { pubkey: reputationPda, isSigner: false, isWritable: true },
    { pubkey: wallet, isSigner: true, isWritable: true },
    { pubkey: userProfilePda, isSigner: false, isWritable: true },
    { pubkey: PublicKey.default, isSigner: false, isWritable: false },
  ])
  return buildTransaction([ix], wallet)
}

function packRequestFundingData(requestId: PublicKey, amount: number, reason: string): Buffer {
  const reasonBytes = Buffer.from(reason, "utf-8")
  const data = Buffer.alloc(1 + 32 + 8 + 4 + reasonBytes.length)
  let offset = 0
  data.writeUInt8(3, offset); offset += 1
  requestId.toBuffer().copy(data, offset); offset += 32
  data.writeBigUInt64LE(BigInt(amount), offset); offset += 8
  data.writeUInt32LE(reasonBytes.length, offset); offset += 4
  reasonBytes.copy(data, offset)
  return data
}

export async function buildRequestFundingTransaction(
  wallet: PublicKey,
  requestId: PublicKey,
  amount: number,
  reason: string
): Promise<Transaction> {
  const { pda: fundingPda } = getFundingPda(requestId)
  const { pda: userProfilePda } = getUserProfilePda(wallet)
  const { pda: treasuryPda } = getTreasuryPda()

  const ix = await createInstruction(packRequestFundingData(requestId, amount, reason), [
    { pubkey: fundingPda, isSigner: false, isWritable: true },
    { pubkey: wallet, isSigner: true, isWritable: true },
    { pubkey: userProfilePda, isSigner: false, isWritable: true },
    { pubkey: treasuryPda, isSigner: false, isWritable: true },
    { pubkey: PublicKey.default, isSigner: false, isWritable: false },
  ])
  return buildTransaction([ix], wallet)
}

function packApproveFundingData(): Buffer {
  return Buffer.from([4])
}

function packRejectFundingData(): Buffer {
  return Buffer.from([5])
}

function packDistributeFundsData(): Buffer {
  return Buffer.from([6])
}

export async function buildApproveFundingTransaction(
  authority: PublicKey,
  requestId: PublicKey
): Promise<Transaction> {
  const { pda: fundingPda } = getFundingPda(requestId)
  const { pda: treasuryPda } = getTreasuryPda()

  const ix = await createInstruction(packApproveFundingData(), [
    { pubkey: fundingPda, isSigner: false, isWritable: true },
    { pubkey: treasuryPda, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: true, isWritable: false },
  ])
  return buildTransaction([ix], authority)
}

export async function buildRejectFundingTransaction(
  authority: PublicKey,
  requestId: PublicKey
): Promise<Transaction> {
  const { pda: fundingPda } = getFundingPda(requestId)
  const { pda: treasuryPda } = getTreasuryPda()

  const ix = await createInstruction(packRejectFundingData(), [
    { pubkey: fundingPda, isSigner: false, isWritable: true },
    { pubkey: treasuryPda, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: true, isWritable: false },
  ])
  return buildTransaction([ix], authority)
}

export async function buildDistributeFundsTransaction(
  authority: PublicKey,
  requestId: PublicKey
): Promise<Transaction> {
  const { pda: fundingPda } = getFundingPda(requestId)
  const { pda: treasuryPda } = getTreasuryPda()

  const funding = await fetchFundingRequestPda(fundingPda)
  if (!funding) throw new Error("Funding request not found")

  const requesterPubkey = new PublicKey(funding.requester)
  const { pda: userProfilePda } = getUserProfilePda(requesterPubkey)

  const ix = await createInstruction(packDistributeFundsData(), [
    { pubkey: fundingPda, isSigner: false, isWritable: true },
    { pubkey: userProfilePda, isSigner: false, isWritable: true },
    { pubkey: treasuryPda, isSigner: false, isWritable: true },
    { pubkey: requesterPubkey, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: true, isWritable: false },
  ])
  return buildTransaction([ix], authority)
}

async function buildTransaction(
  instructions: TransactionInstruction[],
  feePayer: PublicKey
): Promise<Transaction> {
  const tx = new Transaction()
  tx.add(...instructions)
  const { blockhash } = await connection.getLatestBlockhash()
  tx.recentBlockhash = blockhash
  tx.feePayer = feePayer
  return tx
}

async function fetchFundingRequestPda(pda: PublicKey) {
  const { decodeFundingRequest } = await import("./accounts")
  const { getConnection } = await import("@/lib/connection")
  const conn = getConnection()
  const info = await conn.getAccountInfo(pda)
  if (!info) return null
  return decodeFundingRequest(info.data.slice(8))
}
