"use client"

import Link from "next/link"

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "How to Earn", href: "/earn" },
      { label: "FAQ", href: "/faq" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center chamfer-sm bg-primary glow-green-sm">
                <span className="text-lg font-bold text-primary-foreground font-heading">P</span>
              </div>
              <span className="text-lg font-heading tracking-wider text-foreground">
                Peer<span className="text-primary">Chain</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed max-w-xs">
              Decentralized peer-learning and micro-funding powered by Solana. Learn, earn reputation, and fund your education.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-label tracking-wider text-foreground mb-4 uppercase">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary font-mono transition-colors"
                    >
                      {'>'} {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} PeerChain. Built on Solana.
          </p>
        </div>
      </div>
    </footer>
  )
}
