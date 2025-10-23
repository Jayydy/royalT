"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ViewContainer } from "@/components/ui/view-toggle"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Music2 } from "lucide-react"
import type { Song } from "@/lib/types"
import { MarketplaceSongCard } from "@/components/marketplace/marketplace-song-card"

export default function MarketplacePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "available" | "trending">("all")

  useEffect(() => {
    const allSongs: Song[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("songs_")) {
        const songs = JSON.parse(localStorage.getItem(key) || "[]")
        allSongs.push(...songs)
      }
    }
    setSongs(allSongs)
  }, [])

  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" || (filter === "available" && song.mintedCount < song.totalSupply) || filter === "trending"
    return matchesSearch && matchesFilter
  })

  return (
    <ViewContainer>
      <div className="min-h-screen relative">
        <AnimatedBackground />

        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 pt-24 pb-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  NFT Marketplace
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">Discover and collect music NFTs from talented artists</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="glass p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Songs</p>
                  <p className="text-xl font-bold">{songs.length}</p>
                </div>
              </Card>
              <Card className="glass p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-xl font-bold">
                    {songs.reduce((acc, s) => acc + Number.parseFloat(s.price) * s.mintedCount, 0).toFixed(2)} ETH
                  </p>
                </div>
              </Card>
              <Card className="glass p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available NFTs</p>
                  <p className="text-xl font-bold">
                    {songs.reduce((acc, s) => acc + (s.totalSupply - s.mintedCount), 0)}
                  </p>
                </div>
              </Card>
              <Card className="glass p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Floor Price</p>
                  <p className="text-xl font-bold">
                    {songs.length > 0 ? Math.min(...songs.map((s) => Number.parseFloat(s.price))).toFixed(2) : "0.00"}{" "}
                    ETH
                  </p>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search songs, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-primary" : ""}
                >
                  All
                </Button>
                <Button
                  variant={filter === "available" ? "default" : "outline"}
                  onClick={() => setFilter("available")}
                  className={filter === "available" ? "bg-primary" : ""}
                >
                  Available
                </Button>
                <Button
                  variant={filter === "trending" ? "default" : "outline"}
                  onClick={() => setFilter("trending")}
                  className={filter === "trending" ? "bg-primary" : ""}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>
            </div>

            {/* Songs Grid */}
            {filteredSongs.length === 0 ? (
              <Card className="glass-strong p-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Music2 className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No songs found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search" : "Be the first artist to mint a song!"}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSongs.map((song) => (
                  <MarketplaceSongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewContainer>
  )
}
