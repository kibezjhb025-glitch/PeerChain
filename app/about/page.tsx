"use client"

import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section, SectionHeader } from "@/components/layout/Section"
import { TerminalCard } from "@/components/layout/TerminalCard"
import { NeonButton } from "@/components/layout/NeonButton"

export default function AboutPage() {
  return (
    <>
      <Header />
      <Section>
        <SectionHeader
          label="About"
          title="Why PeerChain Exists"
          description="The world has a learning poverty crisis. 70% of children in low-income countries cannot read by age 10. Traditional education financing is broken — gated by credit scores, geography, and bureaucracy."
        />
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <TerminalCard variant="terminal">
            <h3 className="text-lg font-heading tracking-wider text-foreground mb-3">The Problem</h3>
            <ul className="space-y-3 text-sm text-muted-foreground font-mono">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Learning is treated as a cost, not an investment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Reputation is locked inside institutional silos (transcripts, CVs, references)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Micro-funding for education requires credit history or collateral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Millions of skilled people have no way to prove or monetize their knowledge</span>
              </li>
            </ul>
          </TerminalCard>
          <TerminalCard variant="terminal">
            <h3 className="text-lg font-heading tracking-wider text-foreground mb-3">The Solution</h3>
            <ul className="space-y-3 text-sm text-muted-foreground font-mono">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>On-chain reputation that you own and carry anywhere</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Peer-to-peer learning verified by Solana consensus</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Reputation-based micro-grants without banks or credit checks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">&gt;</span>
                <span>Borderless access — anyone with internet and a wallet can participate</span>
              </li>
            </ul>
          </TerminalCard>
        </div>
      </Section>
      <Footer />
    </>
  )
}
