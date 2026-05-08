"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  AudioLines,
  CheckCircle,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useWallet } from "@solana/wallet-adapter-react"

// Social Collateral Meter
function SocialCollateralMeter({ score }: { score: number }) {
  const getEligibilityLevel = (s: number) => {
    if (s >= 80) return { level: "Premium", color: "text-primary", bg: "bg-primary/20" }
    if (s >= 60) return { level: "Standard", color: "text-secondary", bg: "bg-secondary/20" }
    if (s >= 40) return { level: "Basic", color: "text-yellow-500", bg: "bg-yellow-500/20" }
    return { level: "Building", color: "text-muted-foreground", bg: "bg-muted/30" }
  }

  const eligibility = getEligibilityLevel(score)

  return (
    <Card className="glass-card border-border/50 border-glow-blue">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="text-muted-foreground">Social Collateral Score</span>
          <Badge className={`${eligibility.bg} ${eligibility.color} border-0`}>
            {eligibility.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-secondary text-glow-blue">{score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <Progress value={score} className="h-2 bg-muted/30" />
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-muted/30 p-2">
              <p className="text-muted-foreground">Sessions</p>
              <p className="font-semibold text-primary">0</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-2">
              <p className="text-muted-foreground">Reviews</p>
              <p className="font-semibold text-primary">0</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-2">
              <p className="text-muted-foreground">Endorsements</p>
              <p className="font-semibold text-primary">0</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Request Grant Modal
function RequestGrantModal() {
  const [isRecording, setIsRecording] = useState(false)
  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const { publicKey } = useWallet()

  const handleSubmit = async () => {
    if (!publicKey || !amount || !purpose) return

    try {
      const response = await fetch("/api/funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: publicKey.toBase58(),
          amount: parseFloat(amount) * 1_000_000_000, // Convert SOL to lamports
          reason: purpose,
          reputationScore: 0, // Will be fetched from profile
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Funding request submitted!")
      }
    } catch (error) {
      console.error("Failed to submit funding request:", error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-blue">
          <Plus className="mr-2 h-4 w-4" />
          Request Micro-Grant
        </Button>
      </DialogTrigger>
      <DialogContent className="glass sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            Request Micro-Grant
          </DialogTitle>
          <DialogDescription>
            Submit your funding request with a voice pitch to increase your chances.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Requested Amount (SOL)</Label>
            <Input
              id="amount"
              placeholder="0.5"
              type="number"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-input/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="Describe what you'll use the funding for..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="bg-input/50 border-border/50 min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Voice Pitch (ElevenLabs)</Label>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${
                    isRecording
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-secondary/10 text-secondary border-secondary/30"
                  }`}
                >
                  <AudioLines className="mr-2 h-4 w-4" />
                  {isRecording ? "Stop Recording" : "Record Pitch"}
                </Button>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-blue"
            onClick={handleSubmit}
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface FundingRequest {
  requestId: string
  requester: string
  amount: string
  purpose: string
  collateralScore: number
  progress: number
  hasVoicePitch: boolean
}

export function FundingLedger() {
  const { publicKey, connected, connection } = useWallet()
  const [reputationScore, setReputationScore] = useState(0)
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      fetchData()
    }
  }, [connected, publicKey])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch reputation
      const repResponse = await fetch(`/api/reputation?user=${publicKey?.toBase58()}`)
      const repData = await repResponse.json()
      if (repData.success) {
        setReputationScore(repData.data.score)
      }

      // Fetch funding requests
      const fundResponse = await fetch(`/api/funding?user=${publicKey?.toBase58()}`)
      const fundData = await fundResponse.json()
      if (fundData.success) {
        const formatted = fundData.data.map((r: any) => ({
          requestId: r.requestId,
          requester: r.requester,
          amount: `${r.amount / 1_000_000_000} SOL`,
          purpose: r.reason,
          collateralScore: r.reputationScore,
          progress: r.status === "Approved" ? 100 : r.status === "Pending" ? 50 : 0,
          hasVoicePitch: false,
        }))
        setFundingRequests(formatted)
      }
    } catch (error) {
      console.error("Failed to fetch funding data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Social Collateral Meter */}
        <SocialCollateralMeter score={reputationScore} />

        {/* Quick Stats */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funding Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Total Received</span>
              </div>
              <span className="font-semibold text-secondary">0 SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Backers</span>
              </div>
              <span className="font-semibold text-primary">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Success Rate</span>
              </div>
              <span className="font-semibold text-primary">0%</span>
            </div>
          </CardContent>
        </Card>

        {/* Request Grant */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Need Funding?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connected ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Your social collateral qualifies you for micro-grants up to{" "}
                  <span className="text-secondary font-semibold">1.5 SOL</span>
                </p>
                <RequestGrantModal />
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Connect wallet to request funding
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Funding Marketplace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Funding Marketplace</h3>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Badge variant="outline" className="text-secondary border-secondary/30">
              {fundingRequests.length} Active Requests
            </Badge>
          )}
        </div>
        {!connected ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Connect wallet to view funding requests
          </div>
        ) : loading ? (
          <div className="text-center py-4">
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-primary" />
          </div>
        ) : fundingRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fundingRequests.map((request) => (
              <Card key={request.requestId} className="glass-card border-border/50 hover:border-secondary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm text-foreground">{request.requester.slice(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground">
                        Score: {request.collateralScore}
                      </p>
                    </div>
                    {request.hasVoicePitch && (
                      <AudioLines className="h-4 w-4 text-secondary" />
                    )}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {request.purpose}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary font-semibold">{request.amount}</span>
                      <span className="text-muted-foreground">{request.progress}% funded</span>
                    </div>
                    <Progress value={request.progress} className="h-1.5 bg-muted/30" />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {/* Backers count would come from API */}
                    </span>
                    <Button size="sm" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                      Back Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No funding requests yet. Be the first to request!
          </div>
        )}
      </div>
    </div>
  )
}
