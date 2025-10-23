"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SilkBackground } from "@/components/ui/silk-background"
import { ViewContainer } from "@/components/ui/view-toggle"
import { useUser } from "@/contexts/user-context"
import { Music2, Plus, TrendingUp, Coins, Users, Settings } from "lucide-react"
import { lazy, Suspense } from "react"
const MintNFTDialog = lazy(() => import("@/components/artist/mint-nft-dialog").then(mod => ({ default: mod.MintNFTDialog })))
const WithdrawDialog = lazy(() => import("@/components/artist/withdraw-dialog").then(mod => ({ default: mod.WithdrawDialog })))
import { SongCard } from "@/components/artist/song-card"
import { useSongs } from "@/hooks/use-songs"
import { useNFTs } from "@/hooks/use-nfts"

interface Recipient {
  address: string;
  percentage: number;
}

function ArtistDashboardContent() {
  const { user } = useUser()
  const { songs, addSong } = useSongs(user?.id)
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [availableBalance, setAvailableBalance] = useState(0)
  
  const totalSongs = songs.length
  const totalMinted = songs.reduce((acc, song) => acc + song.mintedCount, 0)
  const totalRevenue = songs.reduce((acc, song) => acc + Number.parseFloat(song.price) * song.mintedCount, 0)
  const royaltiesEarned = totalMinted * 0.05 // Mock calculation

  // Update stats when songs change
  useEffect(() => {
    // Update available balance when royalties are earned
    // In a real implementation, this would be based on actual blockchain data
    setAvailableBalance(royaltiesEarned)
  }, [royaltiesEarned])

  const updateStats = () => {
    // Trigger re-render with updated stats
    const newRoyalties = totalMinted * 0.05
    setAvailableBalance(newRoyalties)
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <SilkBackground />
      </div>

      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Artist Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground">Welcome back, {user?.username || "Artist"}</p>
          </div>
          <Button onClick={() => setIsMintDialogOpen(true)} size="lg" className="bg-primary hover:bg-primary/90">
            <Plus className="w-5 h-5 mr-2" />
            Mint NFT
          </Button>
        </div>

        <Tabs defaultValue="mint" className="space-y-6">
          <TabsList className="glass-strong">
            <TabsTrigger value="mint">Mint / List NFT</TabsTrigger>
            <TabsTrigger value="payments">Payments / Royalties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
          </TabsList>

          {/* Mint / List NFT Tab */}
          <TabsContent value="mint" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="glass p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-primary" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total NFTs</p>
                  <p className="text-3xl font-bold">{totalSongs}</p>
                </div>
              </Card>

              <Card className="glass p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NFTs Minted</p>
                  <p className="text-3xl font-bold">{totalMinted}</p>
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
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} ETH</p>
                </div>
              </Card>

              <Card className="glass p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Royalties Earned</p>
                  <p className="text-3xl font-bold">{royaltiesEarned.toFixed(3)} ETH</p>
                </div>
              </Card>
            </div>

            {/* Songs Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Collection</h2>
              </div>

              {songs.length === 0 ? (
                <Card className="glass-strong p-12 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Music2 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">No NFTs yet</h3>
                    <p className="text-muted-foreground">Start by minting your first song as an NFT</p>
                  </div>
                  <Button onClick={() => setIsMintDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-5 h-5 mr-2" />
                    Mint Your First NFT
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {songs.map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-strong p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <Coins className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Total Royalties Earned</h3>
                  <p className="text-3xl font-bold">{royaltiesEarned.toFixed(3)} ETH</p>
                  <p className="text-muted-foreground mt-2">From streaming revenue</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Payments / Royalties Tab */}
          <TabsContent value="payments" className="space-y-6">
            {/* Royalties Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-strong p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <Coins className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Total Royalties Earned</h3>
                    <p className="text-5xl font-bold text-accent">{royaltiesEarned.toFixed(4)} ETH</p>
                    <p className="text-muted-foreground mt-2">From {totalMinted} NFTs minted</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-strong p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Coins className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Available to Withdraw</h3>
                    <p className="text-5xl font-bold text-primary">{availableBalance.toFixed(4)} ETH</p>
                    <p className="text-muted-foreground mt-2">Current balance</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Withdraw Button Section */}
            <div className="flex justify-center">
              <Button 
                onClick={() => setIsWithdrawDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
                disabled={availableBalance <= 0}
              >
                <Coins className="w-5 h-5 mr-2" />
                Manage Withdrawals
              </Button>
            </div>

            {/* Song Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Royalty-Earning Songs</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <Card className="glass-strong p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Manage Your NFTs</h3>
                  <p className="text-muted-foreground">Update pricing, royalties, and availability</p>
                </div>
              </div>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
          <MintNFTDialog
            open={isMintDialogOpen}
            onOpenChange={setIsMintDialogOpen}
            onMint={(song, nft) => {
              addSong(song);
              const { addNFT } = useNFTs(user?.id);
              addNFT(nft);
              updateStats();
            }}
          />
        </Suspense>

        <WithdrawDialog 
          open={isWithdrawDialogOpen} 
          onOpenChange={setIsWithdrawDialogOpen}
          availableBalance={availableBalance}
          onWithdraw={async (amount: number, recipients: Recipient[]) => {
            try {
              // Here you would integrate with your blockchain wallet
              // For now, we'll just simulate a withdrawal
              console.log('Withdrawing', amount, 'ETH')
              console.log('Recipients:', recipients)
              
              // Success message
              alert('Withdrawal successful!')
              
              // Update the UI
              setAvailableBalance(prev => prev - amount)
            } catch (error) {
              console.error('Withdrawal failed:', error)
              throw error
            }
          }}
        />
      </div>
    </div>
  )
}

export default function ArtistDashboardPage() {
  return (
    <ProtectedRoute requiredRole="artist">
      <ViewContainer>
        <ArtistDashboardContent />
      </ViewContainer>
    </ProtectedRoute>
  )
}