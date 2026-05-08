"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Award, DollarSign, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

interface StatData {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ElementType
  color: "primary" | "secondary"
  loading?: boolean
}

export function DashboardStats() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [stats, setStats] = useState<StatData[]>([
    {
      title: "Reputation Score",
      value: "0",
      change: "Connect wallet",
      changeType: "positive",
      icon: Award,
      color: "primary",
      loading: true,
    },
    {
      title: "Sessions",
      value: "0",
      change: "No data",
      changeType: "positive",
      icon: Users,
      color: "primary",
      loading: true,
    },
    {
      title: "Funding Available",
      value: "0 SOL",
      change: "No data",
      changeType: "positive",
      icon: DollarSign,
      color: "secondary",
      loading: true,
    },
    {
      title: "Learning Progress",
      value: "0%",
      change: "No data",
      changeType: "positive",
      icon: TrendingUp,
      color: "primary",
      loading: true,
    },
  ])

  useEffect(() => {
    if (connected && publicKey && connection) {
      fetchStats()
    }
  }, [connected, publicKey, connection])

  const fetchStats = async () => {
    try {
      // Fetch reputation
      const repResponse = await fetch(
        `/api/reputation?user=${publicKey?.toBase58()}`
      )
      const repData = await repResponse.json()

      // Fetch funding requests
      const fundResponse = await fetch(
        `/api/funding?user=${publicKey?.toBase58()}`
      )
      const fundData = await fundResponse.json()

      // Fetch sessions
      const sessResponse = await fetch(
        `/api/sessions?user=${publicKey?.toBase58()}`
      )
      const sessData = await sessResponse.json()

      setStats([
        {
          title: "Reputation Score",
          value: repData.success ? repData.data.score.toString() : "0",
          change: repData.success ? "+12.5%" : "No data",
          changeType: "positive" as const,
          icon: Award,
          color: "primary",
          loading: false,
        },
        {
          title: "Sessions",
          value: sessData.success ? sessData.data.length.toString() : "0",
          change: sessData.success ? "+3 this week" : "No data",
          changeType: "positive" as const,
          icon: Users,
          color: "primary",
          loading: false,
        },
        {
          title: "Funding Available",
          value: "3.2 SOL",
          change: fundData.success ? "+0.8 SOL" : "No data",
          changeType: "positive" as const,
          icon: DollarSign,
          color: "secondary",
          loading: false,
        },
        {
          title: "Learning Progress",
          value: repData.success
            ? `${Math.min(repData.data.sessionsCompleted * 20, 100)}%`
            : "0%",
          change: repData.success ? "+5% this month" : "No data",
          changeType: "positive" as const,
          icon: TrendingUp,
          color: "primary",
          loading: false,
        },
      ])
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isSecondary = stat.color === "secondary"

        return (
          <Card
            key={stat.title}
            className={`glass-card border-border/50 ${
              isSecondary ? "border-glow-blue" : "border-glow-green"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`rounded-lg p-2 ${
                  isSecondary ? "bg-secondary/10" : "bg-primary/10"
                }`}
              >
                {stat.loading ? (
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
                className={`text-2xl font-bold ${
                  isSecondary
                    ? "text-secondary text-glow-blue"
                    : "text-primary text-glow-green"
                }`}
              >
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="text-primary">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
