import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { fetchReputation, buildUpdateReputationTransaction } from "@/lib/solana"

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
    const reputation = await fetchReputation(wallet)

    if (!reputation) {
      return NextResponse.json(
        { success: false, error: "Reputation state not found. Create a user profile first." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: reputation,
      source: "blockchain",
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
        { success: false, error: "Missing required fields: user, sessionDuration" },
        { status: 400 }
      )
    }

    const wallet = new PublicKey(user)

    const tx = await buildUpdateReputationTransaction(
      wallet,
      sessionDuration,
      rating ?? 5
    )

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized,
        message: "Reputation update transaction built — sign and send with your wallet",
      },
    })
  } catch (error) {
    console.error("Reputation update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build reputation transaction" },
      { status: 500 }
    )
  }
}
