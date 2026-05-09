import { NextRequest, NextResponse } from "next/server"
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import type { SessionLogRequest } from "@/shared/types"
import { getConnection } from "@/lib/connection"

const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")

export async function POST(request: NextRequest) {
  try {
    const body: SessionLogRequest = await request.json()

    if (!body.sessionId || !body.student || !body.mentor) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const connection = getConnection()

    // Build the transaction for logging session on-chain
    const sessionPubkey = new PublicKey(body.sessionId)
    const studentPubkey = new PublicKey(body.student)
    const mentorPubkey = new PublicKey(body.mentor)

    // In production, this would create and return a serialized transaction
    // for the wallet to sign
    const transaction = new Transaction()

    // This is a simplified version - in reality, you'd use Anchor's
    // program.methods.logSession().accounts().transaction()
    const instruction = SystemProgram.transfer({
      fromPubkey: studentPubkey,
      toPubkey: mentorPubkey,
      lamports: 1000, // Placeholder
    })

    transaction.add(instruction)

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = studentPubkey

    const serialized = transaction.serialize({ requireAllSignatures: false })

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized.toString("base64"),
        message: "Session logged successfully",
      },
    })
  } catch (error) {
    console.error("Session logging error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to log session" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user = searchParams.get("user")

    const connection = getConnection()

    // Fetch user's sessions from blockchain
    // This is a placeholder - in reality, you'd query the program accounts
    const mockSessions = [
      {
        sessionId: "session1",
        student: user || "",
        mentor: "mentor1",
        duration: 60,
        sessionType: "OneOnOne",
        completed: true,
        timestamp: Date.now(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockSessions,
    })
  } catch (error) {
    console.error("Fetch sessions error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}
