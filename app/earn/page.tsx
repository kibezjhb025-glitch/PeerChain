"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section, SectionHeader } from "@/components/layout/Section"
import { TerminalCard } from "@/components/layout/TerminalCard"
import { NeonButton } from "@/components/layout/NeonButton"
import { useRouter } from "next/navigation"
import { Award, Users, Coins, TrendingUp, ArrowRight, Zap, Star, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const earnings = [
  {
    icon: Users,
    title: "Mentorship Sessions",
    description: "Earn reputation for every session you mentor. The longer the session, the more you earn.",
    rate: "+10-50 rep per session",
    color: "primary",
  },
  {
    icon: Award,
    title: "Peer Reviews",
    description: "Rate and review your learning partners. Quality reviews boost both sides of the exchange.",
    rate: "+5 rep per review",
    color: "secondary",
  },
  {
    icon: TrendingUp,
    title: "Consistency Bonuses",
    description: "Regular participation earns multipliers. Maintain streaks to accelerate your reputation growth.",
    rate: "1.5x-3x streak multiplier",
    color: "primary",
  },
  {
    icon: Star,
    title: "Top Contributor Status",
    description: "Top-rated mentors and learners earn bonus reputation and priority access to funding pools.",
    rate: "+100 rep monthly",
    color: "secondary",
  },
  {
    icon: Shield,
    title: "Community Moderation",
    description: "Help maintain quality by moderating sessions and flagging bad actors. Earn for keeping the network healthy.",
    rate: "+5-20 rep per action",
    color: "primary",
  },
  {
    icon: Coins,
    title: "Micro-Grants",
    description: "Redeem your reputation for real funding. Higher reputation = larger grants with less friction.",
    rate: "Up to 5 SOL",
    color: "secondary",
  },
]

const tiers = [
  { name: "Building", minRep: 0, color: "text-muted-foreground", benefits: ["Browse mentors", "View public sessions", "Read documentation"] },
  { name: "Basic", minRep: 40, color: "text-accent", benefits: ["Join sessions", "Rate peers", "Access audio briefs"] },
  { name: "Standard", minRep: 60, color: "text-secondary", benefits: ["Mentor others", "Request micro-grants up to 0.5 SOL", "Voice pitch funding requests"] },
  { name: "Premium", minRep: 80, color: "text-primary", benefits: ["Priority grant approval", "Grants up to 5 SOL", "Mentor multiplier", "Governance voting"] },
]

export default function EarnPage() {
  const router = useRouter()

  return (
    <>
      <Header />
      <Section>
        <SectionHeader
          label="How to Earn"
          title="Your Reputation is Your Capital"
          description="Every interaction on PeerChain builds your on-chain reputation. Here's exactly how."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {earnings.map((item) => {
            const Icon = item.icon
            const isSecondary = item.color === "secondary"
            return (
              <TerminalCard key={item.title}>
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center chamfer-sm mb-4",
                  isSecondary ? "bg-secondary/10" : "bg-primary/10"
                )}>
                  <Icon className={cn("h-5 w-5", isSecondary ? "text-secondary" : "text-primary")} />
                </div>
                <h3 className="text-lg font-heading tracking-wider text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed mb-3">{item.description}</p>
                <p className="text-xs font-label tracking-wider text-primary terminal-prompt">{item.rate}</p>
              </TerminalCard>
            )
          })}
        </div>
      </Section>

      <Section>
        <SectionHeader
          label="Reputation Tiers"
          title="Unlock More as You Grow"
          description="Your reputation score unlocks new capabilities. Climb the tiers to access more funding and features."
        />
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {tiers.map((tier) => (
            <TerminalCard key={tier.name} className="text-center" hoverEffect={false}>
              <p className={cn("text-2xl font-heading font-bold", tier.color)}>{tier.name}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{tier.minRep}+ Rep</p>
              <ul className="mt-4 space-y-2 text-left">
                {tier.benefits.map((b) => (
                  <li key={b} className="text-xs text-muted-foreground font-mono flex items-start gap-2">
                    <span className="text-primary mt-0.5">&gt;</span>
                    {b}
                  </li>
                ))}
              </ul>
            </TerminalCard>
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-wider text-foreground uppercase">
          Start Earning Today
        </h2>
        <p className="mt-4 text-muted-foreground font-mono max-w-md mx-auto">
          Your first session is the hardest. After that, your reputation compounds.
        </p>
        <div className="mt-6">
          <NeonButton variant="primary" size="lg" onClick={() => router.push("/register")}>
            <Zap className="h-5 w-5" />
            Start Earning
            <ArrowRight className="h-4 w-4 ml-1" />
          </NeonButton>
        </div>
      </Section>
      <Footer />
    </>
  )
}
