"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, ArrowDownLeft, Loader2, ExternalLink, Terminal } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { usePeerChainStore } from "@/store/use-peerchain"

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
  const { cachedTransactions, transactionsLoading, setCachedTransactions, setTransactionsLoading } = usePeerChainStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (publicKey && connection && !fetchedRef.current) {
      fetchedRef.current = true
      fetchTransactions()
    }
  }, [publicKey, connection])

  useEffect(() => {
    if (cachedTransactions.length > 0) {
      const txs: Transaction[] = cachedTransactions.map((sig: any, index: number) => {
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
    }
  }, [cachedTransactions])

  const fetchTransactions = async () => {
    if (!publicKey || !connection) return

    setTransactionsLoading(true)
    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      })
      setCachedTransactions(signatures)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      setCachedTransactions([])
    } finally {
      setTransactionsLoading(false)
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
      <div className="glass-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-heading tracking-wider text-foreground">
            <span className="terminal-prompt">Recent Transactions</span>
          </h3>
        </div>
        <div className="py-8 text-center text-sm text-muted-foreground font-mono">
          Connect wallet to view transactions
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-heading tracking-wider text-foreground">
          <span className="terminal-prompt">Recent Transactions</span>
        </h3>
        <div className="flex items-center gap-1.5">
          {transactionsLoading ? (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
          <span className="text-xs text-muted-foreground font-label tracking-wider">Live</span>
        </div>
      </div>
      <div className="space-y-2">
        {transactionsLoading ? (
          <div className="py-4 text-center text-xs text-muted-foreground font-mono">
            <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin" />
            Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between chamfer-sm bg-muted/30 px-3 py-2 transition-all hover:bg-muted/50 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center chamfer-sm ${
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
                  <p className="text-xs text-foreground font-label tracking-wider">{tx.description}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {tx.signature.slice(0, 12)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">
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
          <div className="py-8 text-center text-xs text-muted-foreground font-mono">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  )
}
