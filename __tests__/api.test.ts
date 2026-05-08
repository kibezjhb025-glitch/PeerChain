import { NextRequest, NextResponse } from "next/server"
import { GET, POST } from "@/app/api/sessions/route"
import { GET as RepGet, POST as RepPost } from "@/app/api/reputation/route"
import { POST as FundPost } from "@/app/api/funding/route"
import { POST as TtsPost } from "@/app/api/tts/route"

// Mock Solana web3.js
jest.mock("@solana/web3.js", () => ({
  Connection: jest.fn().mockImplementation(() => ({
    getSignaturesForAddress: jest.fn().mockResolvedValue([]),
    getBalance: jest.fn().mockResolvedValue(2000000000),
  })),
  PublicKey: jest.fn().mockImplementation((key) => ({
    toBase58: () => key,
    toBuffer: () => Buffer.from(key),
  })),
  Transaction: jest.fn(),
  SystemProgram: {
    transfer: jest.fn(),
  },
}))

describe("/api/sessions", () => {
  it("should return sessions for a user", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/sessions?user=test123",
      { method: "GET" }
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toBeInstanceOf(Array)
  })

  it("should reject session creation without required fields", async () => {
    const request = new NextRequest("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })
})

describe("/api/reputation", () => {
  it("should require user parameter", async () => {
    const request = new NextRequest("http://localhost:3000/api/reputation", {
      method: "GET",
    })
    const response = await RepGet(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it("should return reputation for valid user", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/reputation?user=test123",
      { method: "GET" }
    )
    const response = await RepGet(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty("score")
  })
})

describe("/api/funding", () => {
  it("should reject funding request without amount", async () => {
    const request = new NextRequest("http://localhost:3000/api/funding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "test" }),
    })
    const response = await FundPost(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })
})

describe("/api/tts", () => {
  it("should require text parameter", async () => {
    const request = new NextRequest("http://localhost:3000/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const response = await TtsPost(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it("should return error without ElevenLabs API key", async () => {
    const request = new NextRequest("http://localhost:3000/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hello world" }),
    })
    const response = await TtsPost(request)
    const data = await response.json()

    // Should fail because ELEVENLABS_API_KEY is not set
    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
  })
})
