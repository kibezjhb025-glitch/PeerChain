"use client"

import { cn } from "@/lib/utils"

interface GridBackgroundProps {
  className?: string
  dotColor?: string
}

export function GridBackground({ className, dotColor = "rgba(0, 255, 136, 0.03)" }: GridBackgroundProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: `
          linear-gradient(${dotColor} 1px, transparent 1px),
          linear-gradient(90deg, ${dotColor} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  )
}

export function CircuitNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute w-2 h-2 rounded-full bg-primary/40 animate-pulse",
        "shadow-[0_0_6px_#00ff88,0_0_12px_rgba(0,255,136,0.3)]",
        className
      )}
    />
  )
}
