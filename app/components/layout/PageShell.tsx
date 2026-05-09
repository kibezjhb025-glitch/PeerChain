"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageShellProps {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("relative min-h-screen bg-background text-foreground", className)}>
      {children}
    </div>
  )
}
