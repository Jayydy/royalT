import { Navbar } from "@/components/layout/navbar"
import { InteractiveWaveform } from "@/components/ui/interactive-waveform"
import { TextTypeAnimation } from "@/components/ui/text-type-animation"
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid"
import { ViewContainer } from "@/components/ui/view-toggle"
import { PlatformStats } from "@/components/ui/platform-stats"
import { Button } from "@/components/ui/button"
import { Music2, Coins, TrendingUp, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <ViewContainer>
      <HomePageContent />
    </ViewContainer>
  )
}

function HomePageContent() {

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Interactive Waveform */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-16">
        {/* Background Waveform */}
        <div className="absolute inset-0 w-full opacity-40">
          <InteractiveWaveform />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 w-full bg-gradient-to-b from-background/30 via-background/70 to-background">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, oklch(0.65 0.25 285 / 0.3) 0%, transparent 70%), radial-gradient(circle at 80% 20%, oklch(0.55 0.22 240 / 0.2) 0%, transparent 50%)",
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-8 sm:py-16">
          <div className="max-w-screen-md lg:max-w-screen-xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass border border-primary/30 mb-3 sm:mb-4 md:mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs sm:text-sm text-muted-foreground">Powered by Blockchain Technology</span>
              </div>
            </div>

            {/* Dynamic Rotating Text Overlay */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance leading-tight sm:leading-tight md:leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Own the Music.
                </span>
                <br />
                <span className="text-foreground">Earn the Royalties.</span>
              </h1>
              <TextTypeAnimation
                texts={["Empowering Artists. Rewarding Fans.", "Empowering Fans. Rewarding Artists."]}
                interval={3000}
              />
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground text-balance w-[90%] sm:w-full max-w-2xl mx-auto leading-relaxed sm:leading-relaxed md:leading-relaxed">
              The first Web3 platform where artists mint song NFTs and automatically collect streaming royalties through
              smart contracts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 sm:pt-4 md:pt-6 px-4">
              <Link href="/get-started" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-4 sm:py-5 md:py-6 bg-primary hover:bg-primary/90 relative group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 blur-xl bg-primary/50 group-hover:bg-primary/70 transition-all" />
                </Button>
              </Link>
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-4 sm:py-5 md:py-6 border-primary/50 hover:bg-primary/10 bg-transparent"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            <PlatformStats />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-screen-md lg:max-w-screen-xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-balance leading-tight px-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Revolutionizing
              </span>{" "}
              Music Royalties
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground text-balance max-w-2xl mx-auto px-4 leading-relaxed">
              Transparent, automated, and fair compensation for artists through blockchain technology
            </p>
          </div>

          <BentoGrid>
            <BentoItem>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Mint Song NFTs</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Transform your music into unique NFTs with customizable supply and royalty splits
              </p>
            </BentoItem>

            <BentoItem>
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Automatic Royalties</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Smart contracts automatically distribute streaming revenue to NFT holders in real-time
              </p>
            </BentoItem>

            <BentoItem>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Real-Time Analytics</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Track streams, revenue, and engagement across all major platforms in one dashboard
              </p>
            </BentoItem>

            <BentoItem>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Fan Engagement</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Build deeper connections with fans who own a piece of your music and success
              </p>
            </BentoItem>

            <BentoItem>
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Secure & Transparent</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                All transactions and royalty distributions are recorded on-chain for complete transparency
              </p>
            </BentoItem>

            <BentoItem>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Instant Payments</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                No more waiting months for royalty checks - get paid instantly as streams happen
              </p>
            </BentoItem>
          </BentoGrid>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-screen-md lg:max-w-screen-xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-balance leading-tight px-2">
              How It Works
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground text-balance max-w-2xl mx-auto px-4 leading-relaxed">
              Three simple steps to start earning royalties on the blockchain
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="glass-strong p-6 md:p-8 space-y-3 md:space-y-4 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto border-2 border-primary">
                  <span className="text-xl md:text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">Connect Wallet</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Link your Web3 wallet and create your artist or fan profile
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
            </div>

            <div className="relative">
              <div className="glass-strong p-6 md:p-8 space-y-3 md:space-y-4 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto border-2 border-secondary">
                  <span className="text-xl md:text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">Mint or Claim NFTs</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Artists mint song NFTs, fans claim them from the marketplace
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-secondary to-accent" />
            </div>

            <div className="relative">
              <div className="glass-strong p-6 md:p-8 space-y-3 md:space-y-4 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto border-2 border-accent">
                  <span className="text-xl md:text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">Earn Royalties</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Automatically receive streaming revenue distributed via smart contracts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-screen-md lg:max-w-screen-xl">
          <div className="glass-strong p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto border border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-balance leading-tight px-2">
                Ready to Transform Your Music Career?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2 leading-relaxed">
                Join thousands of artists already earning fair royalties on the blockchain
              </p>
              <Link href="/get-started">
                <Button
                  size="lg"
                  className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 bg-primary hover:bg-primary/90 relative group"
                >
                  <span className="relative z-10">Start Earning Today</span>
                  <div className="absolute inset-0 blur-xl bg-primary/50 group-hover:bg-primary/70 transition-all" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-screen-md lg:max-w-screen-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Music2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-base md:text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RoyalT
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground text-center">© 2025 RoyalT. All rights reserved.</p>
            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/terms"
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/docs"
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
