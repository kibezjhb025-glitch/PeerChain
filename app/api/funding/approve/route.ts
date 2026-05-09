import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { buildApproveFundingTransaction, buildRejectFundingTransaction } from "@/lib/solana"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { authority, requestId, action } = body

    if (!authority || !requestId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: authority, requestId, action (approve|reject)" },
        { status: 400 }
      )
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    const authorityPubkey = new PublicKey(authority)
    const requestPubkey = new PublicKey(requestId)

    const tx = action === "approve"
      ? await buildApproveFundingTransaction(authorityPubkey, requestPubkey)
      : await buildRejectFundingTransaction(authorityPubkey, requestPubkey)

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized,
        message: `${action === "approve" ? "Approval" : "Rejection"} transaction built — sign and send with your wallet`,
      },
    })
  } catch (error) {
    console.error("Funding action error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build funding action transaction" },
      { status: 500 }
    )
  }
}
