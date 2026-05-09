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
  Zap,
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
import { usePeerChainStore } from "@/store/use-peerchain"

function SocialCollateralMeter({ score }: { score: number }) {
  const getEligibilityLevel = (s: number) => {
    if (s >= 80) return { level: "PREMIUM", color: "text-primary", bg: "bg-primary/20" }
    if (s >= 60) return { level: "STANDARD", color: "text-secondary", bg: "bg-secondary/20" }
    if (s >= 40) return { level: "BASIC", color: "text-accent", bg: "bg-accent/20" }
    return { level: "BUILDING", color: "text-muted-foreground", bg: "bg-muted/30" }
  }

  const eligibility = getEligibilityLevel(score)

  return (
    <Card className="glass-card border-glow-blue">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-label tracking-wider">
          <span className="text-muted-foreground terminal-prompt">Social Collateral</span>
          <Badge className={`${eligibility.bg} ${eligibility.color} border-0 font-label tracking-wider`}>
            {eligibility.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-secondary text-glow-blue font-heading tracking-wider">{score}</span>
            <span className="text-sm text-muted-foreground font-mono">/ 100</span>
          </div>
          <Progress value={score} className="h-2 bg-muted/30 [&>div]:bg-secondary" />
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="chamfer-sm bg-muted/30 p-2 border border-border/30">
              <p className="text-muted-foreground font-label text-[10px] tracking-wider">Sessions</p>
              <p className="font-semibold text-primary font-heading text-sm">0</p>
            </div>
            <div className="chamfer-sm bg-muted/30 p-2 border border-border/30">
              <p className="text-muted-foreground font-label text-[10px] tracking-wider">Reviews</p>
              <p className="font-semibold text-primary font-heading text-sm">0</p>
            </div>
            <div className="chamfer-sm bg-muted/30 p-2 border border-border/30">
              <p className="text-muted-foreground font-label text-[10px] tracking-wider">Endorse</p>
              <p className="font-semibold text-primary font-heading text-sm">0</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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
          amount: parseFloat(amount) * 1_000_000_000,
          reason: purpose,
          reputationScore: 0,
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
        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-blue font-label tracking-wider chamfer-sm">
          <Plus className="mr-2 h-4 w-4" />
          Request Micro-Grant
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading tracking-wider">
            <Sparkles className="h-5 w-5 text-secondary" />
            Request Micro-Grant
          </DialogTitle>
          <DialogDescription className="font-label text-xs tracking-wider text-muted-foreground">
            Submit your funding request with a voice pitch to increase your chances.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-label tracking-wider text-xs text-muted-foreground">
              <span className="terminal-prompt text-primary">Amount (SOL)</span>
            </Label>
            <Input
              id="amount"
              placeholder="0.5"
              type="number"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-input/50 border-border/50 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose" className="font-label tracking-wider text-xs text-muted-foreground">
              <span className="terminal-prompt text-primary">Purpose</span>
            </Label>
            <Textarea
              id="purpose"
              placeholder="Describe what you'll use the funding for..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="bg-input/50 border-border/50 min-h-[80px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-label tracking-wider text-xs text-muted-foreground">
              <span className="terminal-prompt text-primary">Voice Pitch</span>
            </Label>
            <div className="chamfer-sm border border-border/50 bg-muted/30 p-4">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`font-label tracking-wider chamfer-sm ${
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
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-blue font-label tracking-wider chamfer-sm"
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
  const { publicKey, connected } = useWallet()
  const {
    cachedReputation,
    cachedFunding,
    fundingLoading,
    fetchAllData,
  } = usePeerChainStore()
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([])

  useEffect(() => {
    if (connected && publicKey) {
      fetchAllData(publicKey.toBase58())
    }
  }, [connected, publicKey, fetchAllData])

  useEffect(() => {
    if (cachedFunding) {
      const formatted = cachedFunding.map((r: any) => ({
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
  }, [cachedFunding])

  const reputationScore = cachedReputation?.score ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <SocialCollateralMeter score={reputationScore} />

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-label tracking-wider text-muted-foreground">
              <span className="terminal-prompt">Funding Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-secondary" />
                <span className="text-sm text-muted-foreground font-mono">Total Received</span>
              </div>
              <span className="font-semibold text-secondary font-heading">0 SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground font-mono">Backers</span>
              </div>
              <span className="font-semibold text-primary font-heading">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground font-mono">Success Rate</span>
              </div>
              <span className="font-semibold text-primary font-heading">0%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-label tracking-wider text-muted-foreground">
              <span className="terminal-prompt">Need Funding?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connected ? (
              <>
                <p className="text-sm text-muted-foreground font-mono">
                  Your social collateral qualifies you for micro-grants up to{" "}
                  <span className="text-secondary font-semibold text-glow-blue">1.5 SOL</span>
                </p>
                <RequestGrantModal />
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center font-mono">
                Connect wallet to request funding
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading tracking-wider text-foreground">
            <span className="terminal-prompt">Funding Marketplace</span>
          </h3>
          {fundingLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Badge variant="outline" className="text-secondary border-secondary/30 font-label tracking-wider">
              {fundingRequests.length} Active Requests
            </Badge>
          )}
        </div>
        {!connected ? (
          <div className="text-center py-8 text-sm text-muted-foreground font-mono">
            Connect wallet to view funding requests
          </div>
        ) : fundingLoading ? (
          <div className="text-center py-4">
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-primary" />
          </div>
        ) : fundingRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fundingRequests.map((request) => (
              <Card key={request.requestId} className="glass-card hover:border-secondary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-secondary" />
                        <p className="font-mono text-sm text-foreground">{request.requester.slice(0, 12)}...</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-label tracking-wider mt-1">
                        Score: {request.collateralScore}
                      </p>
                    </div>
                    {request.hasVoicePitch && (
                      <AudioLines className="h-4 w-4 text-secondary" />
                    )}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground font-mono line-clamp-2">
                    {request.purpose}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm font-label tracking-wider">
                      <span className="text-secondary font-semibold">{request.amount}</span>
                      <span className="text-muted-foreground">{request.progress}% funded</span>
                    </div>
                    <Progress value={request.progress} className="h-1.5 bg-muted/30 [&>div]:bg-secondary" />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {request.hasVoicePitch && (
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <AudioLines className="h-3 w-3" />
                        Pitch available
                      </span>
                    )}
                    <Button size="sm" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/30 font-label tracking-wider chamfer-sm ml-auto">
                      Back Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground font-mono">
            No funding requests yet. Be the first to request!
          </div>
        )}
      </div>
    </div>
  )
}
