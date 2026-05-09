import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import type { FundingRequestPayload } from "@/shared/types"
import { getConnection } from "@/lib/connection"

export async function POST(request: NextRequest) {
  try {
    const body: FundingRequestPayload = await request.json()

    if (!body.requestId || !body.amount || !body.reason) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const connection = getConnection()

    // In production, this would create a transaction for funding request
    // that the user signs with their wallet
    const requestId = new PublicKey(body.requestId)

    // Placeholder for on-chain funding request
    // This would be replaced with actual Anchor program call
    const mockFundingRequest = {
      requestId: body.requestId,
      amount: body.amount,
      reason: body.reason,
      status: "Pending",
      reputationScore: body.reputationScore,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      success: true,
      data: mockFundingRequest,
      message: "Funding request submitted successfully",
    })
  } catch (error) {
    console.error("Funding request error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit funding request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user = searchParams.get("user")

    const connection = getConnection()

    // Placeholder - in reality, fetch from blockchain
    const mockRequests = [
      {
        requestId: "request1",
        requester: user || "",
        amount: 1000000000, // 1 SOL in lamports
        reason: "Need funding for course materials",
        status: "Pending",
        reputationScore: 25,
        timestamp: Date.now(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockRequests,
    })
  } catch (error) {
    console.error("Fetch funding requests error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch funding requests" },
      { status: 500 }
    )
  }
}
