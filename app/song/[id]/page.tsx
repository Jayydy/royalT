"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Song } from "@/lib/types"
import { Music2, TrendingUp, Users, Coins, Play, Trash2 } from "lucide-react"
import Image from "next/image"
import { lazy, Suspense } from "react"
const StreamingChart = lazy(() => import("@/components/analytics/streaming-chart").then(mod => ({ default: mod.StreamingChart })))
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { PlatformDistribution } from "@/components/analytics/platform-distribution"
import { CommentSection } from "@/components/song/comment-section"
import { useUser } from "@/contexts/user-context"
import { useNFTs } from "@/hooks/use-nfts"
import { useSongs } from "@/hooks/use-songs"

export default function SongPage() {
   const params = useParams()
   const router = useRouter()
   const { user } = useUser()
   const { addNFT } = useNFTs(user?.id)
   const { updateSong } = useSongs(user?.id)
   const [song, setSong] = useState<Song | null>(null)
   const [isClaiming, setIsClaiming] = useState(false)
   const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Load song from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("songs_")) {
        const songs: Song[] = JSON.parse(localStorage.getItem(key) || "[]")
        const foundSong = songs.find((s) => s.id === params.id)
        if (foundSong) {
          setSong(foundSong)
          break
        }
      }
    }
  }, [params.id])

  const handleClaimNFT = async () => {
    if (!song || !user) return

    setIsClaiming(true)
    try {
      // Check wallet balance and gas fees
      // This would normally check the connected wallet's balance
      const requiredAmount = Number.parseFloat(song.price)
      const estimatedGasFee = 0.001 // Mock gas fee in ETH

      // Simulate balance check (in real app, this would query the wallet)
      const mockWalletBalance = 1.5 // Mock balance
      if (mockWalletBalance < (requiredAmount + estimatedGasFee)) {
        alert(`Insufficient funds. Required: ${(requiredAmount + estimatedGasFee).toFixed(4)} ETH, Available: ${mockWalletBalance} ETH`)
        return
      }

      // Show transaction confirmation modal
      const confirmed = window.confirm(
        `Confirm Transaction:\n\n` +
        `NFT: ${song.title}\n` +
        `Price: ${song.price} ETH\n` +
        `Gas Fee: ~${estimatedGasFee} ETH\n` +
        `Total: ${(requiredAmount + estimatedGasFee).toFixed(4)} ETH\n\n` +
        `Do you want to proceed?`
      )

      if (!confirmed) {
        setIsClaiming(false)
        return
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create NFT
      const newNFT = {
        id: crypto.randomUUID(),
        songId: song.id,
        tokenId: song.mintedCount + 1,
        ownerId: user.id,
        mintedAt: new Date(),
        title: song.title,
        coverImage: song.coverImage,
        price: song.price,
        royaltyPercentage: song.royaltyPercentage,
      }

      addNFT(newNFT)

      // Update song minted count
      const updatedSong = { ...song, mintedCount: song.mintedCount + 1 }
      setSong(updatedSong)

      // Update in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("songs_")) {
          const songs: Song[] = JSON.parse(localStorage.getItem(key) || "[]")
          const updatedSongs = songs.map((s) => (s.id === song.id ? updatedSong : s))
          localStorage.setItem(key, JSON.stringify(updatedSongs))
        }
      }

      alert("NFT claimed successfully! Transaction confirmed.")
    } catch (error) {
      console.error("[v0] Error claiming NFT:", error)
      alert("Transaction failed. Please try again.")
    } finally {
      setIsClaiming(false)
    }
  }

  const handleDeleteNFT = async () => {
    if (!song || !user || user.role !== "artist" || song.artistId !== user.id) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${song.title}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      // Remove from localStorage
      const storedSongs = localStorage.getItem(`songs_${user.id}`)
      if (storedSongs) {
        const songs: Song[] = JSON.parse(storedSongs)
        const updatedSongs = songs.filter((s) => s.id !== song.id)
        localStorage.setItem(`songs_${user.id}`, JSON.stringify(updatedSongs))
      }

      alert("NFT deleted successfully!")
      router.push("/dashboard/artist")
    } catch (error) {
      console.error("[v0] Error deleting NFT:", error)
      alert("Failed to delete NFT. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!song) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">Song not found</p>
        </div>
      </div>
    )
  }

  const available = song.totalSupply - song.mintedCount
  const mintProgress = (song.mintedCount / song.totalSupply) * 100

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square rounded-2xl overflow-hidden glass">
            <Image
              src={song.coverImage?.startsWith('data:') ? song.coverImage : (song.coverImage || "/placeholder.svg")}
              alt={song.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge className="mb-4 bg-primary/90 backdrop-blur-sm">
                {available} / {song.totalSupply} Available
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-strong p-6 space-y-4">
              <h2 className="text-2xl font-bold">About This Song</h2>
              <p className="text-muted-foreground leading-relaxed">{song.description}</p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-primary">{song.price} ETH</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Royalty Share</p>
                  <p className="text-2xl font-bold text-secondary">{song.royaltyPercentage}%</p>
                </div>
              </div>

              {/* Streaming URLs */}
              {(song.spotifyUrl || song.appleMusicUrl || song.youtubeMusicUrl) && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="text-lg font-semibold">Listen On</h3>
                  <div className="flex flex-wrap gap-3">
                    {song.spotifyUrl && (
                      <a
                        href={song.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        Spotify
                      </a>
                    )}
                    {song.appleMusicUrl && (
                      <a
                        href={song.appleMusicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        Apple Music
                      </a>
                    )}
                    {song.youtubeMusicUrl && (
                      <a
                        href={song.youtubeMusicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        YouTube Music
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mint Progress</span>
                  <span className="font-semibold">{mintProgress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${mintProgress}%` }}
                  />
                </div>
              </div>

              {user?.role === "fan" && available > 0 && (
                <Button
                  onClick={handleClaimNFT}
                  disabled={isClaiming}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                >
                  {isClaiming ? "Claiming..." : `Claim NFT for ${song.price} ETH`}
                </Button>
              )}

              {available === 0 && (
                <Button disabled className="w-full text-lg py-6">
                  Sold Out
                </Button>
              )}

              {user?.role === "artist" && song.artistId === user.id && (
                <Button
                  onClick={handleDeleteNFT}
                  disabled={isDeleting}
                  variant="destructive"
                  className="w-full text-lg py-6 mt-4"
                >
                  {isDeleting ? "Deleting..." : "Delete NFT"}
                  <Trash2 className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="glass p-4 text-center">
                <Music2 className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p className="text-xl font-bold">{song.totalSupply}</p>
              </Card>
              <Card className="glass p-4 text-center">
                <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Owners</p>
                <p className="text-xl font-bold">{song.mintedCount}</p>
              </Card>
              <Card className="glass p-4 text-center">
                <Coins className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="text-xl font-bold">{(Number.parseFloat(song.price) * song.mintedCount).toFixed(2)}</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="glass-strong">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-strong p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Streaming Performance</h3>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading analytics...</div>}>
                  <StreamingChart songId={song.id} />
                </Suspense>
              </Card>

              <Card className="glass-strong p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Revenue Over Time</h3>
                  <Coins className="w-5 h-5 text-accent" />
                </div>
                <RevenueChart songId={song.id} />
              </Card>
            </div>

            <Card className="glass-strong p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Platform Distribution</h3>
                <Play className="w-5 h-5 text-secondary" />
              </div>
              <PlatformDistribution songId={song.id} />
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <CommentSection songId={song.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
