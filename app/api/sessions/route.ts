import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { fetchAllSessionsForUser, buildLogSessionTransaction } from "@/lib/solana"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user = searchParams.get("user")

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User parameter required" },
        { status: 400 }
      )
    }

    const wallet = new PublicKey(user)
    const sessions = await fetchAllSessionsForUser(wallet)

    return NextResponse.json({
      success: true,
      data: sessions,
      source: "blockchain",
    })
  } catch (error) {
    console.error("Fetch sessions error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, student, mentor, duration, sessionType, topic } = body

    if (!sessionId || !student || !mentor || !duration || topic === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, student, mentor, duration, topic" },
        { status: 400 }
      )
    }

    const sessionPubkey = new PublicKey(sessionId)
    const studentPubkey = new PublicKey(student)
    const mentorPubkey = new PublicKey(mentor)

    const tx = await buildLogSessionTransaction(
      studentPubkey,
      mentorPubkey,
      sessionPubkey,
      duration,
      sessionType ?? 0,
      topic
    )

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")

    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        await prisma.mentorshipSession.create({
          data: {
            mentorId: session.user.id,
            studentId: session.user.id,
            topic,
            duration,
            txSignature: null,
            completed: true,
          },
        }).catch(() => {})
      }
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized,
        message: "Session transaction built — sign and send with your wallet",
      },
    })
  } catch (error) {
    console.error("Session logging error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build session transaction" },
      { status: 500 }
    )
  }
}
