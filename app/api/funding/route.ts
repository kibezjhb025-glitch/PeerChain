import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { fetchAllFundingRequests, fetchFundingRequest, buildRequestFundingTransaction } from "@/lib/solana"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user = searchParams.get("user")
    const requestId = searchParams.get("requestId")

    if (requestId) {
      const funding = await fetchFundingRequest(new PublicKey(requestId))
      if (!funding) {
        return NextResponse.json(
          { success: false, error: "Funding request not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: funding, source: "blockchain" })
    }

    const requests = await fetchAllFundingRequests()

    if (user) {
      const filtered = requests.filter((r) => r.requester === user)
      return NextResponse.json({ success: true, data: filtered, source: "blockchain" })
    }

    return NextResponse.json({ success: true, data: requests, source: "blockchain" })
  } catch (error) {
    console.error("Fetch funding error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch funding requests" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, requester, amount, reason } = body

    if (!requestId || !requester || !amount || !reason) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: requestId, requester, amount, reason" },
        { status: 400 }
      )
    }

    const requestPubkey = new PublicKey(requestId)
    const requesterPubkey = new PublicKey(requester)

    const tx = await buildRequestFundingTransaction(
      requesterPubkey,
      requestPubkey,
      amount,
      reason
    )

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized,
        message: "Funding request transaction built — sign and send with your wallet",
      },
    })
  } catch (error) {
    console.error("Funding request error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build funding transaction" },
      { status: 500 }
    )
  }
}
