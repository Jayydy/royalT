"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViewContainer } from "@/components/ui/view-toggle"
import { useUser } from "@/contexts/user-context"
import { Music2, Coins, TrendingUp, ExternalLink, ArrowUpRight, MessageCircle, BarChart3 } from "lucide-react"
import { useNFTs } from "@/hooks/use-nfts"
import { NFTCard } from "@/components/fan/nft-card"
import Link from "next/link"

function FanDashboardContent() {
  const { user } = useUser()
  const { nfts } = useNFTs(user?.id)

  const totalNFTs = nfts.length
  const totalInvested = nfts.reduce((acc, nft) => acc + Number.parseFloat(nft.price || "0"), 0)
  const estimatedRoyalties = totalNFTs * 0.05 // Mock calculation

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Fan Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground">Welcome back, {user?.username || "Fan"}</p>
          </div>
          <Link href="/marketplace">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <ExternalLink className="w-5 h-5 mr-2" />
              Explore Marketplace
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="glass-strong">
            <TabsTrigger value="marketplace">Marketplace / NFT Listings</TabsTrigger>
            <TabsTrigger value="comments">Comments & Interactions</TabsTrigger>
            <TabsTrigger value="metrics">Stream Metrics</TabsTrigger>
          </TabsList>

          {/* Marketplace / NFT Listings Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NFTs Owned</p>
              <p className="text-3xl font-bold">{totalNFTs}</p>
            </div>
          </Card>

          <Card className="glass p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-secondary" />
              </div>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-3xl font-bold">{totalInvested.toFixed(2)} ETH</p>
            </div>
          </Card>

          <Card className="glass p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Royalties Earned</p>
              <p className="text-3xl font-bold">{estimatedRoyalties.toFixed(3)} ETH</p>
            </div>
          </Card>

          <Link href="/royalties">
            <Card className="glass p-6 space-y-4 hover:scale-105 transition-transform cursor-pointer border-primary/30 hover:border-primary group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Manage</p>
                <p className="text-xl font-bold">Royalties</p>
                <p className="text-xs text-primary mt-1">View details →</p>
              </div>
            </Card>
          </Link>
            </div>

            {/* NFT Collection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Collection</h2>
              </div>

              {nfts.length === 0 ? (
                <Card className="glass-strong p-12 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Music2 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">No NFTs yet</h3>
                    <p className="text-muted-foreground">Start collecting music NFTs from your favorite artists</p>
                  </div>
                  <Link href="/marketplace">
                    <Button className="bg-primary hover:bg-primary/90">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Browse Marketplace
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Comments & Interactions Tab */}
          <TabsContent value="comments" className="space-y-6">
            <Card className="glass-strong p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Comments & Interactions</h3>
                  <p className="text-muted-foreground">View and interact with comments on your NFT collections</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Stream Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <Card className="glass-strong p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Stream Metrics</h3>
                  <p className="text-muted-foreground">Track streaming performance of your NFT collections</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function FanDashboardPage() {
  return (
    <ProtectedRoute requiredRole="fan">
      <ViewContainer>
        <FanDashboardContent />
      </ViewContainer>
    </ProtectedRoute>
  )
}
