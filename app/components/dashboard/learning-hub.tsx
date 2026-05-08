"use client"

import { useState, useEffect } from "react"
import { Search, Star, Calendar, CheckCircle, Clock, Filter, Loader2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

const techTags = ["All", "Java", "Rust", "Web3", "Solidity", "Python", "TypeScript"]

interface Mentor {
  id: string
  name: string
  handle: string
  avatar: string
  reputation: number
  tags: string[]
  sessionsCompleted: number
  rating: number
  available: boolean
}

// Mock mentors - in production, fetch from backend/program
const mentors: Mentor[] = [
  {
    id: "1",
    name: "Alex Rustacean",
    handle: "@rustdev",
    avatar: "AR",
    reputation: 1250,
    tags: ["Rust", "Web3", "Solidity"],
    sessionsCompleted: 48,
    rating: 4.9,
    available: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    handle: "@web3mentor",
    avatar: "SC",
    reputation: 980,
    tags: ["Web3", "TypeScript", "React"],
    sessionsCompleted: 32,
    rating: 4.8,
    available: true,
  },
  {
    id: "3",
    name: "Marcus Java",
    handle: "@javaguru",
    avatar: "MJ",
    reputation: 1100,
    tags: ["Java", "Spring", "Microservices"],
    sessionsCompleted: 56,
    rating: 4.7,
    available: false,
  },
  {
    id: "4",
    name: "Elena Solana",
    handle: "@solanadev",
    avatar: "ES",
    reputation: 890,
    tags: ["Solidity", "Rust", "Web3"],
    sessionsCompleted: 28,
    rating: 4.9,
    available: true,
  },
]

interface Session {
  id: string
  mentor: string
  topic: string
  date: string
  status: "upcoming" | "verified"
  txHash?: string
}

export function LearningHub() {
  const { publicKey, connected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("All")
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      fetchSessions()
    }
  }, [connected, publicKey])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sessions?user=${publicKey?.toBase58()}`)
      const data = await response.json()
      if (data.success) {
        // Transform API data to UI format
        const formattedSessions = data.data.map((s: any) => ({
          id: s.sessionId,
          mentor: s.mentor,
          topic: "Peer Learning Session",
          date: new Date(s.timestamp).toLocaleDateString(),
          status: s.completed ? "verified" as const : "upcoming" as const,
          txHash: s.sessionId.slice(0, 12),
        }))
        setSessions(formattedSessions)
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesTag =
      selectedTag === "All" || mentor.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search mentors, skills, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input/50 pl-9 border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {techTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Mentors */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Active Mentors</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="glass-card border-border/50 hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                        {mentor.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{mentor.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {mentor.handle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mentor.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-muted/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      <span className="text-primary font-semibold">{mentor.reputation}</span> Rep
                    </div>
                    <div className="text-muted-foreground">
                      {mentor.sessionsCompleted} sessions
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className={`mt-4 w-full ${
                          mentor.available
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-muted/30 text-muted-foreground"
                        }`}
                        disabled={!mentor.available}
                      >
                        {mentor.available ? "View Profile" : "Unavailable"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                            {mentor.avatar}
                          </div>
                          <div>
                            <span>{mentor.name}</span>
                            <p className="text-sm font-normal text-muted-foreground font-mono">
                              {mentor.handle}
                            </p>
                          </div>
                        </DialogTitle>
                        <DialogDescription>
                          Mentor Profile & Proof of Learning
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">
                            {mentor.sessionsCompleted} sessions completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary fill-current" />
                          <span className="text-sm text-foreground">
                            {mentor.rating} average rating
                          </span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-green">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Session
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your Sessions</h3>
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {connected ? "Your peer learning sessions" : "Connect wallet to view"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="py-4 text-center">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin text-primary" />
                </div>
              ) : !connected ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Connect your wallet to view sessions
                </div>
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-lg bg-muted/30 p-3 transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {session.topic}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          with {session.mentor}
                        </p>
                      </div>
                      {session.status === "verified" ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {session.date}
                      </span>
                      {session.txHash && (
                        <span className="font-mono text-[10px] text-primary">
                          tx: {session.txHash}...
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No sessions yet. Start learning!
                </div>
              )}
              {connected && (
                <Button variant="outline" className="w-full mt-2 border-dashed border-border/50">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Session
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
