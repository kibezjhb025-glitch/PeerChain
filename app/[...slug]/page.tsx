"use client"

import { usePathname, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { ConnectWallet } from "@/components/shared/connect-wallet"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { LearningHub } from "@/components/dashboard/learning-hub"
import { FundingLedger } from "@/components/dashboard/funding-ledger"
import { AudioSuite } from "@/components/dashboard/audio-suite"
import { TransactionFeed } from "@/components/dashboard/transaction-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LayoutDashboard, 
  GraduationCap, 
  Wallet, 
  AudioWaveform,
  Bell,
  Menu,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar border-border">
        <MobileNav />
      </SheetContent>
    </Sheet>
  )
}

function MobileNav() {
  const pathname = usePathname()
  
  const navItems = [
    { label: "Command Center", href: "/", icon: LayoutDashboard },
    { label: "Learning Hub", href: "/learning", icon: GraduationCap },
    { label: "Funding Vaults", href: "/funding", icon: Wallet },
    { label: "Audio Briefs", href: "/audio", icon: AudioWaveform },
  ]

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center chamfer-sm bg-primary glow-green-sm">
            <span className="text-lg font-bold text-primary-foreground font-heading">P</span>
          </div>
          <span className="text-lg font-semibold text-foreground font-heading tracking-wider">
            Peer<span className="text-primary">Chain</span>
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/') || pathname.startsWith(item.href) && item.href !== '/';
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 chamfer-sm px-3 py-2.5 text-sm font-medium transition-all duration-200 font-label tracking-wider",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30 glow-green-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}

export default function DashboardPage() {
  const pathname = usePathname()
  const router = useRouter()

  let activeTab = "dashboard"
  if (pathname === "/learning") activeTab = "learning"
  else if (pathname === "/funding") activeTab = "funding"
  else if (pathname === "/audio") activeTab = "audio"

  const handleTabChange = (value: string) => {
    if (value === "dashboard") router.push("/")
    else router.push(`/${value}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <div>
              <h1 className="text-xl font-heading tracking-wider text-foreground flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                {activeTab === "dashboard" && "COMMAND CENTER"}
                {activeTab === "learning" && "LEARNING HUB"}
                {activeTab === "funding" && "FUNDING VAULTS"}
                {activeTab === "audio" && "AUDIO BRIEFS"}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                {'>'} {activeTab === "dashboard" && "Your decentralized learning overview"}
                {activeTab === "learning" && "Find mentors and schedule peer sessions"}
                {activeTab === "funding" && "Manage and request micro-grants"}
                {activeTab === "audio" && "Technical documentation summaries"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground font-label">
                3
              </span>
            </Button>
            <ConnectWallet />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="glass inline-flex h-12 p-1 border-border">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-label tracking-wider chamfer-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="learning"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-label tracking-wider chamfer-sm"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Learning</span>
              </TabsTrigger>
              <TabsTrigger
                value="funding"
                className="flex items-center gap-2 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary font-label tracking-wider chamfer-sm"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Funding</span>
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-label tracking-wider chamfer-sm"
              >
                <AudioWaveform className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <DashboardStats />
              
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-heading tracking-wider text-foreground">
                    <span className="terminal-prompt">Quick Actions</span>
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => handleTabChange("learning")}
                      className="glass-card p-5 text-left transition-all hover:border-primary/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-primary/20">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors font-label tracking-wider">
                            Find a Mentor
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            Browse available peer reviewers
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabChange("funding")}
                      className="glass-card p-5 text-left transition-all hover:border-secondary/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-secondary/20">
                          <Wallet className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-secondary transition-colors font-label tracking-wider">
                            Request Funding
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            Apply for a micro-grant
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabChange("audio")}
                      className="glass-card p-5 text-left transition-all hover:border-primary/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-primary/20">
                          <AudioWaveform className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors font-label tracking-wider">
                            Audio Briefs
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            Listen to doc summaries
                          </p>
                        </div>
                      </div>
                    </button>
                    <div className="glass-card p-5 text-left border-dashed border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-muted/30">
                          <span className="text-lg">🎯</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground font-label tracking-wider">
                            Daily Challenge
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            Complete 1 session today
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Feed */}
                <div>
                  <TransactionFeed />
                </div>
              </div>
            </TabsContent>

            {/* Learning Tab */}
            <TabsContent value="learning">
              <LearningHub />
            </TabsContent>

            {/* Funding Tab */}
            <TabsContent value="funding">
              <FundingLedger />
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio">
              <AudioSuite />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
