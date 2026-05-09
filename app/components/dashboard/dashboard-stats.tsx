"use client"

import { useEffect } from "react"
import { TrendingUp, Users, Award, DollarSign, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@solana/wallet-adapter-react"
import { usePeerChainStore } from "@/store/use-peerchain"

export function DashboardStats() {
  const { publicKey, connected } = useWallet()
  const {
    cachedReputation,
    cachedSessions,
    cachedFunding,
    reputationLoading,
    sessionsLoading,
    fundingLoading,
    fetchAllData,
  } = usePeerChainStore()

  useEffect(() => {
    if (connected && publicKey) {
      fetchAllData(publicKey.toBase58())
    }
  }, [connected, publicKey, fetchAllData])

  const repScore = cachedReputation?.score ?? 0
  const sessionsCompleted = cachedReputation?.sessionsCompleted ?? 0
  const sessionsCount = cachedSessions?.length ?? 0
  const fundingCount = cachedFunding?.length ?? 0
  const loading = reputationLoading || sessionsLoading || fundingLoading

  const stats = [
    {
      title: "Reputation Score",
      value: loading ? "..." : repScore.toString(),
      change: loading ? "Loading..." : cachedReputation ? "+12.5%" : "No data",
      changeType: "positive" as const,
      icon: Award,
      color: "primary" as const,
    },
    {
      title: "Sessions",
      value: loading ? "..." : sessionsCount.toString(),
      change: loading ? "Loading..." : sessionsCount > 0 ? "+3 this week" : "No data",
      changeType: "positive" as const,
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Funding Available",
      value: loading ? "..." : "3.2 SOL",
      change: loading ? "Loading..." : fundingCount > 0 ? "+0.8 SOL" : "No data",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "secondary" as const,
    },
    {
      title: "Learning Progress",
      value: loading ? "..." : `${Math.min(sessionsCompleted * 20, 100)}%`,
      change: loading ? "Loading..." : sessionsCompleted > 0 ? "+5% this month" : "No data",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "primary" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isSecondary = stat.color === "secondary"

        return (
          <Card
            key={stat.title}
            className={`glass-card ${isSecondary ? "border-glow-blue" : "border-glow-green"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-heading tracking-wider text-muted-foreground">
                <span className="terminal-prompt">{stat.title}</span>
              </CardTitle>
              <div
                className={`chamfer-sm p-2 ${
                  isSecondary ? "bg-secondary/10" : "bg-primary/10"
                }`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Icon
                    className={`h-4 w-4 ${
                      isSecondary ? "text-secondary" : "text-primary"
                    }`}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold font-heading tracking-wider ${
                  isSecondary
                    ? "text-secondary text-glow-blue"
                    : "text-primary text-glow-green"
                }`}
              >
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-label tracking-wider">
                <span className="text-primary">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
