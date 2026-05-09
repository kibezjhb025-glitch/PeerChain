"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TerminalCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "terminal" | "holographic"
  hoverEffect?: boolean
  onClick?: () => void
}

export function TerminalCard({
  children,
  className,
  variant = "default",
  hoverEffect = true,
  onClick,
}: TerminalCardProps) {
  const base = "glass-card p-6 transition-all duration-300"

  const variants = {
    default: "",
    terminal: "bg-background border-border",
    holographic:
      "bg-muted/30 backdrop-blur-sm border-primary/30 glow-green-sm",
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        base,
        variants[variant],
        hoverEffect && "hover:border-primary/50 hover:glow-green-sm cursor-pointer",
        className
      )}
    >
      {variant === "terminal" && (
        <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-border/50">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
      )}
      {children}
    </div>
  )
}
