"use client"

import { ReactNode, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { shadows } from "@/styles/design-tokens"

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  glow?: boolean
}

export function NeonButton({
  children,
  variant = "primary",
  size = "default",
  glow = true,
  className,
  ...props
}: NeonButtonProps) {
  const base =
    "inline-flex items-center justify-center font-label tracking-wider uppercase transition-all duration-200 chamfer-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary",
    outline: "bg-transparent text-foreground hover:text-primary hover:border-primary border border-border",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent",
  }

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    default: "h-10 px-5 text-sm gap-2",
    lg: "h-12 px-8 text-base gap-2.5",
  }

  const glowStyles = {
    primary: glow ? "hover:glow-green" : "",
    secondary: glow ? "hover:glow-blue" : "",
    outline: glow ? "hover:glow-green-sm" : "",
    ghost: "",
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], glowStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
