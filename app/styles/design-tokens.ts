export const colors = {
  void: "#0a0a0f",
  foreground: "#e0e0e0",
  card: "#12121a",
  cardForeground: "#e0e0e0",
  muted: "#1c1c2e",
  mutedForeground: "#6b7280",
  neonGreen: "#00ff88",
  magenta: "#ff00ff",
  cyan: "#00d4ff",
  destructive: "#ff3366",
  border: "#2a2a3a",
  input: "#12121a",
}

export const fonts = {
  heading: "'Orbitron', monospace",
  body: "'JetBrains Mono', 'Fira Code', monospace",
  label: "'Share Tech Mono', monospace",
}

export const spacing = {
  section: "py-24 md:py-32",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  cardGap: "gap-4 md:gap-6",
}

export const shadows = {
  neonGreen: "0 0 5px #00ff88, 0 0 10px rgba(0, 255, 136, 0.4)",
  neonGreenSm: "0 0 3px #00ff88, 0 0 6px rgba(0, 255, 136, 0.3)",
  neonGreenLg: "0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.6), 0 0 40px rgba(0, 255, 136, 0.3)",
  neonMagenta: "0 0 5px #ff00ff, 0 0 10px rgba(255, 0, 255, 0.4)",
  neonCyan: "0 0 5px #00d4ff, 0 0 10px rgba(0, 212, 255, 0.4)",
}

export const textShadows = {
  neonGreen: "0 0 10px rgba(0, 255, 136, 0.5)",
  neonMagenta: "0 0 10px rgba(255, 0, 255, 0.5)",
  neonCyan: "0 0 10px rgba(0, 212, 255, 0.5)",
}

export const animation = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  digital: "100ms steps(4)",
}

export const chamfer = {
  sm: "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
  md: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
  lg: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
}
