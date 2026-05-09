import type { Metadata } from 'next'
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './styles/globals.css'

import { SolanaProvider } from '@/lib/solana-provider'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { AuthProvider } from '@/components/shared/auth-provider'

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" })
const shareTechMono = Share_Tech_Mono({ weight: "400", subsets: ["latin"], variable: "--font-share-tech", display: "swap" })

export const metadata: Metadata = {
  title: 'PeerChain - Decentralized Peer-Learning & Micro-Funding',
  description: 'A decentralized platform for peer learning and micro-funding powered by blockchain technology',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${jetbrainsMono.variable} ${shareTechMono.variable} font-mono antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <SolanaProvider>
              {children}
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </SolanaProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
