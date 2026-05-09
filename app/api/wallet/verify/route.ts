import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { sign } from "tweetnacl"
import { Buffer } from "buffer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet, signature, message } = body

    if (!wallet || !signature || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: wallet, signature, message" },
        { status: 400 }
      )
    }

    const publicKey = new PublicKey(wallet)
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = Buffer.from(signature, "base64")

    const verified = sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    )

    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Signature verification failed" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        verified: true,
        wallet,
        message: "Wallet ownership verified",
      },
    })
  } catch (error) {
    console.error("Wallet verification error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify wallet signature" },
      { status: 500 }
    )
  }
}
