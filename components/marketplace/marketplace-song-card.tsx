"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Song } from "@/lib/types"
import { Music2, Coins, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSongNFT } from "@/hooks/use-song-nft"
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/lib/contract-config'
import { useState } from "react"

interface MarketplaceSongCardProps {
  song: Song
}

export function MarketplaceSongCard({ song }: MarketplaceSongCardProps) {
  const available = song.totalSupply - song.mintedCount
  const isAvailable = available > 0

  // Get song metadata from contract
  const { data: songData } = useReadContract({
    address: CONTRACT_ADDRESSES.SongNFT as `0x${string}`,
    abi: CONTRACT_ABIS.SongNFT,
    functionName: '_songData',
    args: [BigInt(song.id)],
  }) as { data: readonly [string, bigint, bigint, `0x${string}`, bigint, `0x${string}`] | undefined }

  const { buySongNFT, isBuying, isBuySuccess } = useSongNFT()

  const handleBuyNFT = async () => {
    if (!isAvailable || !songData) return

    try {
      // Buy 1 NFT token for now - could be made configurable later
      const amount = 1
      const price = songData?.[1] // price is at index 1 in the struct
      if (!price) return
      const totalValue = price * BigInt(amount)

      await buySongNFT({
        songId: BigInt(song.id),
        amount: BigInt(amount),
        value: totalValue,
      })
    } catch (error) {
      console.error("Failed to buy NFT:", error)
      alert("Failed to purchase NFT. Please try again.")
    }
  }

  return (
    <Card className="glass overflow-hidden hover:scale-105 transition-transform group">
      <div className="relative aspect-square">
        <Image src={song.coverImage || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 right-4">
          <Badge className={isAvailable ? "bg-primary/90 backdrop-blur-sm" : "bg-muted/90 backdrop-blur-sm"}>
            {available} Available
          </Badge>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{song.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{song.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="glass p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="w-3 h-3 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-semibold">{song.price} ETH</p>
          </div>
          <div className="glass p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Music2 className="w-3 h-3 text-secondary" />
            </div>
            <p className="text-xs text-muted-foreground">Supply</p>
            <p className="text-sm font-semibold">{song.totalSupply}</p>
          </div>
          <div className="glass p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Royalty</p>
            <p className="text-sm font-semibold">{song.royaltyPercentage}%</p>
          </div>
        </div>

        {isAvailable ? (
          <TransactionToast
            onSuccess={() => {
              alert("NFT purchased successfully!")
              window.location.reload()
            }}
            onError={(error) => {
              console.error("Purchase failed:", error)
              alert("Purchase failed. Please try again.")
            }}
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleBuyNFT}
              disabled={isBuying || !songData}
            >
              {isBuying ? "Purchasing..." : "Buy NFT"}
            </Button>
          </TransactionToast>
        ) : (
          <Link href={`/song/${song.id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90" disabled={!isAvailable}>
              View Details
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
