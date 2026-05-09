import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { getConnection } from "@/lib/connection"

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

    const connection = getConnection()
    const userPubkey = new PublicKey(user)

    // Fetch user profile from blockchain
    // This is a placeholder - in reality, you'd fetch the PDA and deserialize
    const mockReputation = {
      user: user,
      score: 25,
      sessionsCompleted: 3,
      totalDuration: 180, // minutes
      peerRatings: [5, 4, 5],
      lastUpdated: Date.now(),
    }

    return NextResponse.json({
      success: true,
      data: mockReputation,
    })
  } catch (error) {
    console.error("Reputation fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reputation" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user, sessionDuration, rating } = body

    if (!user || !sessionDuration) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const connection = getConnection()

    // In production, this would create an update_reputation transaction
    // for the user to sign
    const mockUpdated = {
      user,
      score: 27, // Updated score
      sessionsCompleted: 4,
      newRating: rating || 5,
    }

    return NextResponse.json({
      success: true,
      data: mockUpdated,
      message: "Reputation updated successfully",
    })
  } catch (error) {
    console.error("Reputation update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update reputation" },
      { status: 500 }
    )
  }
}
