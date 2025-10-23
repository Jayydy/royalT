"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { NFT } from "@/lib/types"
import { Music2, Coins, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NFTCardProps {
  nft: NFT & { title?: string; coverImage?: string; price?: string; royaltyPercentage?: number }
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <Card className="glass overflow-hidden hover:scale-105 transition-transform group">
      <div className="relative aspect-square">
        <Image src={nft.coverImage || "/placeholder.svg"} alt={nft.title || "NFT"} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-accent/90 backdrop-blur-sm">#{nft.tokenId}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{nft.title || "Untitled"}</h3>
          <p className="text-sm text-muted-foreground">Token ID: {nft.tokenId}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="glass p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="w-3 h-3 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-sm font-semibold">{nft.price || "0.00"} ETH</p>
          </div>
          <div className="glass p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Music2 className="w-3 h-3 text-secondary" />
            </div>
            <p className="text-xs text-muted-foreground">Royalty</p>
            <p className="text-sm font-semibold">{nft.royaltyPercentage || 0}%</p>
          </div>
          <div className="glass p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Owned</p>
            <p className="text-sm font-semibold">
              {Math.floor((Date.now() - new Date(nft.mintedAt).getTime()) / (1000 * 60 * 60 * 24))}d
            </p>
          </div>
        </div>

        <Link href={`/song/${nft.songId}`}>
          <Button className="w-full bg-transparent" variant="outline">
            View Song
          </Button>
        </Link>
      </div>
    </Card>
  )
}
