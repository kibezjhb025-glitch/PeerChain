"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { NeonButton } from "./NeonButton"

const navLinks = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "How to Earn", href: "/earn" },
  { label: "FAQ", href: "/faq" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center chamfer-sm bg-primary glow-green-sm">
              <span className="text-lg font-bold text-primary-foreground font-heading">P</span>
            </div>
            <span className="text-lg font-heading tracking-wider text-foreground">
              Peer<span className="text-primary">Chain</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-label tracking-wider transition-colors chamfer-sm",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <NeonButton variant="outline" size="sm" onClick={() => router.push("/login")}>
              <Wallet className="h-3.5 w-3.5" />
              Sign In
            </NeonButton>
            <NeonButton variant="primary" size="sm" onClick={() => router.push("/register")}>
              Get Started
            </NeonButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm font-label tracking-wider chamfer-sm transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <NeonButton variant="outline" size="sm" onClick={() => router.push("/login")} className="w-full">
                <Wallet className="h-3.5 w-3.5" />
                Sign In
              </NeonButton>
              <NeonButton variant="primary" size="sm" onClick={() => router.push("/register")} className="w-full">
                Get Started
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
