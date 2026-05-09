import { NextRequest, NextResponse } from "next/server"
import { fetchTreasury } from "@/lib/solana"

export async function GET() {
  try {
    const treasury = await fetchTreasury()

    if (!treasury) {
      return NextResponse.json(
        { success: false, error: "Treasury not initialized. Run initialize_treasury first." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: treasury,
      source: "blockchain",
    })
  } catch (error) {
    console.error("Treasury fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch treasury state" },
      { status: 500 }
    )
  }
}
