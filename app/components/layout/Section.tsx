"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { spacing } from "@/styles/design-tokens"

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  skewed?: boolean
}

export function Section({ children, className, id, skewed }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-b border-border/30",
        spacing.section,
        skewed && "-skew-y-1",
        className
      )}
    >
      <div className={skewed ? "skew-y-1" : ""}>
        <div className={spacing.container}>
          {children}
        </div>
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16 max-w-3xl", className)}>
      {label && (
        <p className="text-primary font-label text-xs tracking-[0.2em] mb-3 uppercase terminal-prompt">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-wider text-foreground uppercase">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground font-mono leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}
