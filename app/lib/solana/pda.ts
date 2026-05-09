import { PublicKey } from "@solana/web3.js"

const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
)

export function getUserProfilePda(wallet: PublicKey): {
  pda: PublicKey
  bump: number
} {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-profile"), wallet.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

export function getSessionPda(sessionId: PublicKey): {
  pda: PublicKey
  bump: number
} {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("session"), sessionId.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

export function getReputationPda(wallet: PublicKey): {
  pda: PublicKey
  bump: number
} {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("reputation"), wallet.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

export function getFundingPda(requestId: PublicKey): {
  pda: PublicKey
  bump: number
} {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("funding"), requestId.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

export function getTreasuryPda(): {
  pda: PublicKey
  bump: number
} {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    PROGRAM_ID
  )
  return { pda, bump }
}

export { PROGRAM_ID }
