#!/usr/bin/env node

/**
 * PeerChain Treasury Initialization Script
 * Run: node scripts/init-treasury.js
 */

const anchor = require("@coral-xyz/anchor")
const { Connection, PublicKey, Keypair } = require("@solana/web3.js")
const fs = require("fs")
const path = require("path")

async function main() {
  // Load the wallet keypair
  const walletPath = process.env.HOME + "/.config/solana/id.json"
  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
  )

  const connection = new Connection("https://api.devnet.solana.com", "confirmed")

  // Load the program
  const programId = new PublicKey(process.env.PROGRAM_ID || "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")

  console.log("Initializing treasury...")
  console.log("Program ID:", programId.toBase58())
  console.log("Authority:", walletKeypair.publicKey.toBase58())

  // This is a placeholder - in reality, use Anchor's provider to call the program
  console.log("\nPlease use `anchor run` or build a proper client script.")
  console.log("See anchor/DEPLOYMENT.md for details.")
}

main().catch(console.error)
