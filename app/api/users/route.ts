import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { fetchUserProfile, buildCreateUserTransaction, getUserProfilePda } from "@/lib/solana"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get("wallet")

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet parameter required" },
        { status: 400 }
      )
    }

    const walletPubkey = new PublicKey(wallet)
    const profile = await fetchUserProfile(walletPubkey)

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "User profile not found on-chain" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: profile,
      source: "blockchain",
    })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet, name } = body

    if (!wallet || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: wallet, name" },
        { status: 400 }
      )
    }

    const walletPubkey = new PublicKey(wallet)

    const tx = await buildCreateUserTransaction(walletPubkey, name)
    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")

    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { walletAddress: wallet },
        }).catch(() => {})
      }
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        transaction: serialized,
        message: "User creation transaction built — sign and send with your wallet",
      },
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build user creation transaction" },
      { status: 500 }
    )
  }
}
