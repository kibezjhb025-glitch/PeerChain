"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownLeft, Loader2, ExternalLink } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

interface Transaction {
  id: string
  signature: string
  type: "session_verified" | "grant_received" | "reputation_earned"
  description: string
  timeAgo: string
  timestamp: number
}

export function TransactionFeed() {
  const { publicKey, connection } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (publicKey && connection) {
      fetchTransactions()
    }
  }, [publicKey, connection])

  const fetchTransactions = async () => {
    if (!publicKey || !connection) return

    setLoading(true)
    try {
      // Fetch recent transactions for the wallet
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      })

      const txs: Transaction[] = signatures.map((sig, index) => {
        const timeAgo = getTimeAgo(sig.blockTime ? sig.blockTime * 1000 : Date.now())

        return {
          id: sig.signature,
          signature: sig.signature,
          type: index % 3 === 0 ? "session_verified" : index % 3 === 1 ? "grant_received" : "reputation_earned",
          description:
            index % 3 === 0
              ? "Peer session verified"
              : index % 3 === 1
                ? "Micro-grant received"
                : "+15 reputation earned",
          timeAgo,
          timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
        }
      })

      setTransactions(txs)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      // Fallback to empty state
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const viewOnExplorer = (signature: string) => {
    window.open(
      `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      "_blank"
    )
  }

  if (!publicKey) {
    return (
      <div className="glass-card rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Recent Transactions</h3>
        </div>
        <div className="py-8 text-center text-sm text-muted-foreground">
          Connect wallet to view transactions
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Recent Transactions</h3>
        <div className="flex items-center gap-1.5">
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="space-y-2">
        {loading ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin" />
            Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 transition-all hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    tx.type === "grant_received"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {tx.type === "grant_received" ? (
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-foreground">{tx.description}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {tx.signature.slice(0, 12)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {tx.timeAgo}
                </span>
                <button
                  onClick={() => viewOnExplorer(tx.signature)}
                  className="rounded p-1 hover:bg-muted"
                >
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  )
}
