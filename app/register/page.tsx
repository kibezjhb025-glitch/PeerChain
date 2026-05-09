"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NeonButton } from "@/components/layout/NeonButton"
import { TerminalCard } from "@/components/layout/TerminalCard"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement NextAuth registration
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-primary glow-green-sm">
              <span className="text-xl font-bold text-primary-foreground font-heading">P</span>
            </div>
            <span className="text-2xl font-heading tracking-wider text-foreground">
              Peer<span className="text-primary">Chain</span>
            </span>
          </Link>
        </div>

        <TerminalCard hoverEffect={false}>
          <h1 className="text-xl font-heading tracking-wider text-foreground mb-1 terminal-prompt">Create Account</h1>
          <p className="text-sm text-muted-foreground font-mono mb-6">Join the decentralized learning network</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-label tracking-wider text-muted-foreground">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 bg-input border border-border chamfer-sm pl-10 pr-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:glow-green-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label tracking-wider text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-input border border-border chamfer-sm pl-10 pr-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:glow-green-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label tracking-wider text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 bg-input border border-border chamfer-sm pl-10 pr-10 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:glow-green-sm"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <NeonButton type="submit" variant="primary" size="lg" className="w-full">
              <Wallet className="h-4 w-4" />
              Create Account
              <ArrowRight className="h-4 w-4" />
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground font-mono">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-glow-green transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          {/* Step 2 hint */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-mono text-center">
              After registration, you&apos;ll connect your Solana wallet to activate your on-chain profile.
            </p>
          </div>
        </TerminalCard>
      </div>
    </div>
  )
}
