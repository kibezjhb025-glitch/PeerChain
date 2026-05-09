"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, Shield, Zap, Users, BookOpen, Coins, Globe, Wallet, ChevronRight } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section, SectionHeader } from "@/components/layout/Section"
import { TerminalCard } from "@/components/layout/TerminalCard"
import { NeonButton } from "@/components/layout/NeonButton"
import { GridBackground, CircuitNode } from "@/components/layout/GridBackground"
import { HeroContainer, HeroGlow } from "@/components/layout/HeroContainer"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Shield,
    title: "On-Chain Reputation",
    description: "Every session, review, and contribution is recorded immutably on Solana. Your reputation is portable and provable.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Peer Mentorship",
    description: "Connect with mentors and learners worldwide. Exchange knowledge in one-on-one or group sessions.",
    color: "secondary",
  },
  {
    icon: Coins,
    title: "Micro-Funding",
    description: "Earn reputation to unlock micro-grants. Fund your learning journey without traditional barriers.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Real-Time Verification",
    description: "Sessions are verified on-chain with Solana's high-speed consensus. Proof of Learning, not proof of payment.",
    color: "secondary",
  },
  {
    icon: Globe,
    title: "Borderless Access",
    description: "No bank account required. Anyone with an internet connection and a Solana wallet can participate.",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "AI-Enhanced Learning",
    description: "ElevenLabs-powered audio briefs turn documentation into conversational learning experiences.",
    color: "secondary",
  },
]

const steps = [
  {
    step: "01",
    title: "Connect Wallet",
    description: "Sign up with email and link your Solana wallet. Your identity is the bridge between Web2 simplicity and Web3 power.",
  },
  {
    step: "02",
    title: "Find a Mentor",
    description: "Browse verified mentors by skill, reputation, and availability. Every mentor has a provable on-chain track record.",
  },
  {
    step: "03",
    title: "Learn & Earn",
    description: "Participate in sessions, get verified on-chain, and build your reputation score. Teaching earns just as much as learning.",
  },
  {
    step: "04",
    title: "Fund Your Future",
    description: "Use your accumulated reputation to request micro-grants. No credit check. No paperwork. Just proof of contribution.",
  },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <>
      <Header />

      {/* HERO */}
      <HeroContainer>
        <HeroGlow />
        <GridBackground />

        {/* Left: Text */}
        <div className="relative z-10">
          <p className="text-primary font-label text-xs tracking-[0.25em] mb-4 uppercase terminal-prompt">
            Decentralized Learning Protocol
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-wider leading-none text-foreground uppercase">
            Proof of
            <br />
            <span className="text-primary text-glow-green glitch-text" data-text="Learning.">
              Learning.
            </span>
            <br />
            <span className="text-secondary text-glow-blue">Powered by</span>
            <br />
            Solana.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground font-mono leading-relaxed max-w-xl">
            A decentralized platform where knowledge is currency. Learn from peers, earn on-chain reputation,
            and unlock micro-funding for your education. No intermediaries. No gatekeepers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <NeonButton variant="primary" size="lg" onClick={() => router.push("/register")}>
              <Wallet className="h-5 w-5" />
              Connect Wallet
              <ArrowRight className="h-4 w-4 ml-1" />
            </NeonButton>
            <NeonButton variant="outline" size="lg" onClick={() => router.push("/how-it-works")}>
              How It Works
            </NeonButton>
          </div>

          {/* Floating stats */}
          <div className="mt-12 flex items-center gap-6 md:gap-10">
            {[
              { value: "0", label: "Active Learners" },
              { value: "0", label: "Sessions Completed" },
              { value: "0", label: "SOL Funded" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-primary text-glow-green">
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted-foreground font-label tracking-wider mt-1 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: HUD Visual */}
        <div className="relative z-10 hidden lg:block">
          <div className="relative w-full max-w-md mx-auto">
            {/* Main HUD panel */}
            <div className="glass-card p-6 space-y-4 border-primary/30">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="font-label text-xs tracking-wider text-primary terminal-prompt">Network Status</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[10px] text-primary">Devnet</span>
                </span>
              </div>

              {/* Reputation meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>Reputation Score</span>
                  <span className="text-primary text-glow-green">2,450</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-none overflow-hidden">
                  <div className="h-full w-3/5 bg-primary glow-green-sm transition-all" />
                </div>
              </div>

              {/* Live feed */}
              <div className="space-y-2">
                <p className="font-label text-[10px] tracking-wider text-muted-foreground uppercase terminal-prompt">
                  Live Feed
                </p>
                {[
                  { action: "Session Verified", detail: "+50 rep", color: "text-primary" },
                  { action: "Mentor Match", detail: "Rust Dev", color: "text-secondary" },
                  { action: "Grant Approved", detail: "1.5 SOL", color: "text-cyan" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between chamfer-sm bg-muted/30 px-3 py-2 border border-border/30"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <span className="font-mono text-xs text-foreground">{item.action}</span>
                    <span className={cn("font-mono text-[10px]", item.color)}>{item.detail}</span>
                  </div>
                ))}
              </div>

              {/* Pulse nodes */}
              <div className="flex justify-center gap-2 pt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary/60"
                    style={{ animation: `pulse 2s ease-in-out ${i * 0.5}s infinite` }}
                  />
                ))}
              </div>
            </div>

            {/* Floating reputation badge */}
            <div className="absolute -top-4 -right-4 chamfer-sm bg-secondary/20 border border-secondary/30 px-4 py-2 backdrop-blur-sm animate-pulse">
              <p className="font-label text-xs tracking-wider text-secondary text-glow-blue">TOP CONTRIBUTOR</p>
            </div>

            {/* Circuit decorations */}
            <CircuitNode className="top-1/2 -left-3" />
            <CircuitNode className="bottom-8 -right-2 bg-secondary/40 shadow-[0_0_6px_#ff00ff,0_0_12px_rgba(255,0,255,0.3)]" />
          </div>
        </div>
      </HeroContainer>

      {/* FEATURES */}
      <Section id="features" skewed>
        <SectionHeader
          label="Features"
          title="Built for the Future of Learning"
          description="Every feature is designed around transparency, accessibility, and on-chain verifiability."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            const isSecondary = feature.color === "secondary"
            return (
              <TerminalCard key={feature.title}>
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center chamfer-sm mb-4",
                  isSecondary ? "bg-secondary/10" : "bg-primary/10"
                )}>
                  <Icon className={cn("h-5 w-5", isSecondary ? "text-secondary" : "text-primary")} />
                </div>
                <h3 className="text-lg font-heading tracking-wider text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">{feature.description}</p>
              </TerminalCard>
            )
          })}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section id="how-it-works">
        <SectionHeader
          label="How It Works"
          title="From Zero to On-Chain Reputation"
          description="Four steps to start learning, earning, and funding your education on Solana."
        />
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-0 relative">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0
              return (
                <div
                  key={step.step}
                  className="md:grid md:grid-cols-2 md:gap-12 md:items-center"
                >
                  {/* Step number - desktop */}
                  <div className={cn(
                    "hidden md:flex justify-center",
                    isEven ? "md:order-1 md:justify-end" : "md:order-2 md:justify-start"
                  )}>
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center chamfer-sm bg-primary/20 border border-primary/30">
                        <span className="font-heading text-lg font-bold text-primary">{step.step}</span>
                      </div>
                      {/* Connector dot */}
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary glow-green-sm">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "md:flex md:flex-col",
                    isEven ? "md:order-2 md:items-start" : "md:order-1 md:items-end"
                  )}>
                    {/* Step number - mobile */}
                    <div className="flex items-center gap-3 mb-4 md:hidden">
                      <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-primary/20 border border-primary/30">
                        <span className="font-heading text-sm font-bold text-primary">{step.step}</span>
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <TerminalCard variant="terminal" className={cn(
                      "max-w-lg",
                      isEven ? "md:text-left" : "md:text-right"
                    )}>
                      <h3 className="text-xl font-heading tracking-wider text-foreground mb-3">{step.title}</h3>
                      <p className="text-sm text-muted-foreground font-mono leading-relaxed">{step.description}</p>
                    </TerminalCard>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <GridBackground />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-primary font-label text-xs tracking-[0.25em] mb-4 uppercase terminal-prompt">
            Ready to Start?
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-wider text-foreground uppercase">
            Your Reputation is
            <br />
            <span className="text-primary text-glow-green">Waiting.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-mono max-w-lg mx-auto">
            No bank account. No credit check. Just knowledge, contribution, and proof on Solana.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <NeonButton variant="primary" size="lg" onClick={() => router.push("/register")}>
              <Wallet className="h-5 w-5" />
              Start Learning
              <ChevronRight className="h-4 w-4" />
            </NeonButton>
            <NeonButton variant="outline" size="lg" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </NeonButton>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  )
}
