"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section, SectionHeader } from "@/components/layout/Section"
import { TerminalCard } from "@/components/layout/TerminalCard"
import { NeonButton } from "@/components/layout/NeonButton"
import { useRouter } from "next/navigation"
import { Wallet, Search, Award, Coins, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Wallet,
    title: "Create Your Account",
    description: "Sign up with email and connect your Solana wallet (Phantom or Solflare). Your wallet is your identity on PeerChain.",
    details: [
      "Register with email and password",
      "Connect your Solana wallet",
      "Your wallet address becomes your on-chain identity",
      "No KYC required — pseudonymous participation",
    ],
    color: "primary",
  },
  {
    icon: Search,
    title: "Find Your Mentor or Learner",
    description: "Browse our marketplace of verified mentors and learners. Filter by skill, reputation score, and availability.",
    details: [
      "Search by skill (Rust, Web3, Python, etc.)",
      "View verified reputation scores and session history",
      "Check availability and response rates",
      "All mentors have on-chain proof of expertise",
    ],
    color: "secondary",
  },
  {
    icon: Award,
    title: "Learn & Earn Reputation",
    description: "Join peer learning sessions. Each session is verified on Solana, building your permanent reputation score.",
    details: [
      "Schedule one-on-one or group sessions",
      "Sessions verified on-chain via Solana transactions",
      "Both mentor and student earn reputation",
      "Peer ratings influence your score",
    ],
    color: "primary",
  },
  {
    icon: Coins,
    title: "Unlock Micro-Funding",
    description: "Your reputation becomes your collateral. Request micro-grants to fund your learning journey.",
    details: [
      "Reputation score determines grant eligibility",
      "Submit funding requests with voice pitches",
      "Community-backed funding marketplace",
      "Grants distributed on-chain with full transparency",
    ],
    color: "secondary",
  },
]

export default function HowItWorksPage() {
  const router = useRouter()

  return (
    <>
      <Header />
      <Section>
        <SectionHeader
          label="How It Works"
          title="Four Steps to On-Chain Reputation"
          description="PeerChain transforms learning into a verifiable, fundable asset. Here's how."
        />
        <div className="space-y-8 mt-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isSecondary = step.color === "secondary"
            return (
              <div key={step.title} className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <TerminalCard variant="terminal">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center chamfer-sm",
                        isSecondary ? "bg-secondary/20" : "bg-primary/20"
                      )}>
                        <Icon className={cn("h-6 w-6", isSecondary ? "text-secondary" : "text-primary")} />
                      </div>
                      <div>
                        <p className="text-sm font-mono text-muted-foreground">Step {i + 1}</p>
                        <h3 className="text-xl font-heading tracking-wider text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono leading-relaxed">{step.description}</p>
                  </TerminalCard>
                </div>
                <div className="md:col-span-3">
                  <div className="glass-card p-6 h-full">
                    <h4 className="text-sm font-label tracking-wider text-foreground mb-4 terminal-prompt">Details</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-3 text-sm text-muted-foreground font-mono">
                          <span className={cn("mt-1 h-1.5 w-1.5 rounded-full shrink-0", isSecondary ? "bg-secondary" : "bg-primary")} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
      <Section className="text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-wider text-foreground uppercase">
          Ready to Start?
        </h2>
        <p className="mt-4 text-muted-foreground font-mono max-w-md mx-auto">
          Connect your wallet and start building your on-chain reputation today.
        </p>
        <div className="mt-6">
          <NeonButton variant="primary" size="lg" onClick={() => router.push("/register")}>
            Get Started
            <ArrowRight className="h-4 w-4 ml-1" />
          </NeonButton>
        </div>
      </Section>
      <Footer />
    </>
  )
}

import { cn } from "@/lib/utils"
