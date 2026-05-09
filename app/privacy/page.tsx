"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section, SectionHeader } from "@/components/layout/Section"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <Section>
        <SectionHeader
          label="Privacy Policy"
          title="How We Handle Your Data"
          description="Last updated: May 2026"
        />
        <div className="max-w-3xl space-y-6 mt-8 text-sm text-muted-foreground font-mono leading-relaxed">
          <div className="glass-card p-6">
            <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">Information We Collect</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Email address and encrypted password (registration)</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Solana wallet address (public key)</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Session history and reputation scores (stored on-chain)</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Voice recordings for funding pitches (IPFS)</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Basic analytics (page views, feature usage)</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">How We Use Your Data</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> To authenticate you and manage your account</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> To calculate and display reputation scores</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> To process funding requests and distributions</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> To improve the platform experience</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">Blockchain Transparency</h3>
            <p>Session data, reputation scores, and funding transactions are stored on the Solana blockchain. This data is public by design — it enables portable, verifiable reputation that you can use across any platform integrating with Solana.</p>
            <p className="mt-3">Your email and password are NEVER stored on-chain.</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">AI Voice Data</h3>
            <p>Voice recordings submitted with funding requests are processed through ElevenLabs for text-to-speech and stored on IPFS. These recordings are used exclusively for your funding pitch and are not used to train AI models.</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">POPIA Compliance (South Africa)</h3>
            <p>PeerChain is committed to compliance with the Protection of Personal Information Act (POPIA). If you are a South African resident, you have the right to:</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Request access to your personal data</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Request correction or deletion of your data</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Object to processing of your data</li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span> Lodge a complaint with the Information Regulator</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">Contact</h3>
            <p>For privacy-related inquiries, contact our data protection officer at privacy@peerchain.io</p>
          </div>
        </div>
      </Section>
      <Footer />
    </>
  )
}
