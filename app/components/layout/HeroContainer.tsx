"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { spacing } from "@/styles/design-tokens"

interface HeroContainerProps {
  children: ReactNode
  className?: string
  alignment?: "default" | "center"
}

export function HeroContainer({ children, className, alignment = "default" }: HeroContainerProps) {
  return (
    <section
      className={cn(
        "relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden",
        spacing.container,
        className
      )}
    >
      <div
        className={cn(
          "grid w-full gap-12 lg:gap-16",
          alignment === "center"
            ? "items-center justify-center text-center"
            : "lg:grid-cols-2 items-center"
        )}
      >
        {children}
      </div>
    </section>
  )
}

export function HeroGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none",
        "bg-gradient-radial from-primary/20 via-secondary/5 to-transparent",
        "blur-3xl",
        className
      )}
    />
  )
}
