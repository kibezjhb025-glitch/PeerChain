"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section, SectionHeader } from "@/components/layout/Section"
import { TerminalCard } from "@/components/layout/TerminalCard"

const faqs = [
  {
    q: "What is PeerChain?",
    a: "PeerChain is a decentralized peer-learning and micro-funding platform built on Solana. It allows learners and mentors to connect, verify knowledge exchange on-chain, build portable reputation, and unlock micro-grants based on that reputation.",
  },
  {
    q: "Is cryptocurrency required to use PeerChain?",
    a: "You need a Solana wallet to interact with the platform, but you don't need to buy crypto upfront. A small amount of SOL is required for transaction fees (less than $0.01 per transaction). You can get started with as little as $1 worth of SOL.",
  },
  {
    q: "How do rewards work?",
    a: "Every verified learning session, peer review, and mentorship activity earns you reputation points. Your reputation score determines your eligibility for micro-grants. Higher reputation unlocks larger grants, priority processing, and governance participation.",
  },
  {
    q: "Is this a real university?",
    a: "No. PeerChain is not an accredited university. It's a protocol for peer-to-peer knowledge exchange and reputation building. We don't issue degrees — we issue on-chain proof of learning that's transparent, verifiable, and portable.",
  },
  {
    q: "What wallets are supported?",
    a: "Currently Phantom and Solflare wallets are supported. Both are browser extensions that work with Chrome, Firefox, and Brave. Mobile app support is coming soon.",
  },
  {
    q: "How are sessions verified?",
    a: "Each session is recorded as a Solana transaction. Both the mentor and student confirm participation. The transaction includes session duration, topic, and participant ratings. This data is immutable and publicly verifiable on the Solana blockchain.",
  },
  {
    q: "Is funding guaranteed?",
    a: "No. Micro-grants are funded by a community treasury and distributed based on reputation scores, availability of funds, and the strength of your funding request (including voice pitches). Higher reputation and well-articulated requests have significantly higher approval rates.",
  },
  {
    q: "What happens to my data?",
    a: "Your wallet address, session history, and reputation score are public on Solana (by design — this is what makes reputation portable). Your email and personal information are stored securely in our database and never shared. Voice recordings for funding pitches are stored on IPFS.",
  },
]

export default function FAQPage() {
  return (
    <>
      <Header />
      <Section>
        <SectionHeader
          label="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about PeerChain."
        />
        <div className="space-y-4 mt-8 max-w-3xl">
          {faqs.map((faq) => (
            <TerminalCard key={faq.q} variant="terminal">
              <h3 className="text-base font-heading tracking-wider text-foreground mb-3 terminal-prompt">{faq.q}</h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">{faq.a}</p>
            </TerminalCard>
          ))}
        </div>
      </Section>
      <Footer />
    </>
  )
}
