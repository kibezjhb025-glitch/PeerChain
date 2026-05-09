import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { buildDistributeFundsTransaction } from "@/lib/solana"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { authority, requestId } = body

    if (!authority || !requestId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: authority, requestId" },
        { status: 400 }
      )
    }

    const authorityPubkey = new PublicKey(authority)
    const requestPubkey = new PublicKey(requestId)

    const tx = await buildDistributeFundsTransaction(authorityPubkey, requestPubkey)
    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized,
        message: "Distribution transaction built — sign and send with your wallet",
      },
    })
  } catch (error) {
    console.error("Distribution error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build distribution transaction" },
      { status: 500 }
    )
  }
}
