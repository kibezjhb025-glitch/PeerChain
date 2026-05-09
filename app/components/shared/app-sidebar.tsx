"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  AudioWaveform,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  {
    label: "Command Center",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Learning Hub",
    href: "/learning",
    icon: GraduationCap,
  },
  {
    label: "Funding Vaults",
    href: "/funding",
    icon: Wallet,
  },
  {
    label: "Audio Briefs",
    href: "/audio",
    icon: AudioWaveform,
  },
]

export function AppSidebar({ className }: { className?: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center chamfer-sm bg-primary glow-green-sm">
                <span className="text-lg font-bold text-primary-foreground font-heading">P</span>
              </div>
              <span className="text-lg font-semibold text-foreground font-heading tracking-wider">
                Peer<span className="text-primary">Chain</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center chamfer-sm bg-primary glow-green-sm">
              <span className="text-lg font-bold text-primary-foreground font-heading">P</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 chamfer-sm px-3 py-2.5 text-sm font-medium transition-all duration-200 font-label tracking-wider",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30 glow-green-sm"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="glass border-border font-label text-xs tracking-wider">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-muted-foreground hover:text-foreground font-label text-xs tracking-wider"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
