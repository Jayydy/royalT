"use client"

import { useState, useEffect } from "react"
import type { NFT } from "@/lib/types"

export function useNFTs(userId?: string) {
  const [nfts, setNFTs] = useState<NFT[]>([])

  useEffect(() => {
    if (!userId) return

    // Load NFTs from localStorage and ensure we're using nfts_ prefix
    const storedNFTs = localStorage.getItem(`nfts_${userId}`)
    if (storedNFTs) {
      setNFTs(JSON.parse(storedNFTs))
    } else {
      // Initialize empty array if no NFTs exist
      localStorage.setItem(`nfts_${userId}`, JSON.stringify([]))
      setNFTs([])
    }
  }, [userId])

  const addNFT = (nft: NFT) => {
    if (!userId) return

    // Create new NFT entry
    const updatedNFTs = [...nfts, {
      ...nft,
      mintedAt: new Date()
    }]

    // Update state and storage
    setNFTs(updatedNFTs)
    localStorage.setItem(`nfts_${userId}`, JSON.stringify(updatedNFTs))

    // Also update the song's minted count in songs storage
    const storedSongs = localStorage.getItem(`songs_${userId}`)
    if (storedSongs) {
      const songs = JSON.parse(storedSongs)
      const songIndex = songs.findIndex((s: any) => s.id === nft.songId)
      if (songIndex !== -1) {
        songs[songIndex].mintedCount = (songs[songIndex].mintedCount || 0) + 1
        localStorage.setItem(`songs_${userId}`, JSON.stringify(songs))
      }
    }
  }

  return { nfts, addNFT }
}
