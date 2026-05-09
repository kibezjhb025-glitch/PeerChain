#!/usr/bin/env node

/**
 * PeerChain Treasury Initialization Script
 *
 * Initializes the TreasuryPool PDA on Solana devnet.
 *
 * Usage:
 *   node scripts/init-treasury.js
 *
 * Prerequisites:
 *   1. Anchor program deployed to devnet
 *   2. Solana CLI configured with a funded wallet
 *   3. Program ID set in environment or .env.local
 */

const anchor = require("@coral-xyz/anchor")
const { Connection, PublicKey, Keypair, SystemProgram } = require("@solana/web3.js")
const fs = require("fs")
const path = require("path")
// Load environment from .env.local
const envPath = path.resolve(__dirname, "..", ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8")
  envContent.split("\n").forEach((line) => {
    const [key, ...rest] = line.split("=")
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim()
    }
  })
}

async function main() {
  const walletPath =
    process.env.ANCHOR_WALLET || path.resolve(process.env.HOME, ".config", "solana", "id.json")

  if (!fs.existsSync(walletPath)) {
    console.error("Wallet not found at:", walletPath)
    console.error("Generate one with: solana-keygen new --outfile ~/.config/solana/id.json")
    process.exit(1)
  }

  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
  )

  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
  const programIdStr = process.env.NEXT_PUBLIC_PROGRAM_ID || "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
  const programId = new PublicKey(programIdStr)

  const connection = new Connection(rpcUrl, "confirmed")
  const wallet = new anchor.Wallet(walletKeypair)
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  })
  anchor.setProvider(provider)

  // Derive treasury PDA
  const [treasuryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    programId
  )

  console.log("=== PeerChain Treasury Initialization ===")
  console.log("Network:     Devnet")
  console.log("RPC URL:     ", rpcUrl)
  console.log("Program ID:  ", programId.toBase58())
  console.log("Authority:   ", walletKeypair.publicKey.toBase58())
  console.log("Treasury PDA:", treasuryPda.toBase58())
  console.log("")

  // Check if treasury already exists
  const existingTreasury = await connection.getAccountInfo(treasuryPda)
  if (existingTreasury) {
    console.log("Treasury already initialized at:", treasuryPda.toBase58())
    console.log("Balance:", existingTreasury.lamports / 1e9, "SOL")
    console.log("")

    // Show treasury state
    const [treasuryAccount] = await PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      programId
    )
    const balance = await connection.getBalance(treasuryAccount)
    console.log("Current treasury balance:", balance / 1e9, "SOL")
    process.exit(0)
  }

  // Build the initialize treasury instruction manually
  const treasurySize = 8 + 32 + 8 + 8 + 8 + 1 // discriminator + TreasuryPool::LEN

  const ix = SystemProgram.createAccount({
    fromPubkey: walletKeypair.publicKey,
    newAccountPubkey: treasuryPda,
    lamports: await connection.getMinimumBalanceForRentExemption(treasurySize),
    space: treasurySize,
    programId,
  })

  const tx = new anchor.web3.Transaction().add(ix)
  tx.feePayer = walletKeypair.publicKey

  const blockhash = await connection.getLatestBlockhash("confirmed")
  tx.recentBlockhash = blockhash.blockhash

  console.log("Initializing treasury...")
  const signature = await anchor.web3.sendAndConfirmTransaction(connection, tx, [walletKeypair])
  console.log("Transaction sent:", signature)
  console.log("Treasury initialized at:", treasuryPda.toBase58())
  console.log("")
  console.log("Next steps:")
  console.log("  1. Fund the treasury: solana transfer", treasuryPda.toBase58(), "<AMOUNT>", "--allow-unfunded-recipient")
  console.log("  2. View on explorer: https://explorer.solana.com/address/" + treasuryPda.toBase58() + "?cluster=devnet")
}

main().catch((err) => {
  console.error("Initialization failed:", err.message)
  process.exit(1)
})
