"use client"

import { useState, useEffect } from "react"

interface PlatformStats {
  totalUsers: number
  songsMinted: number
  royaltiesDistributed: number
}

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    songsMinted: 0,
    royaltiesDistributed: 0,
  })

  useEffect(() => {
    const calculateStats = () => {
      // Use setTimeout to defer state update and avoid setState during render
      setTimeout(() => {
        // Count total users
        const users: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith("user_")) {
            users.push(key)
          }
        }

        // Count total NFTs minted across all users
        let totalNFTs = 0
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith("nfts_")) {
            const nfts = JSON.parse(localStorage.getItem(key) || "[]")
            totalNFTs += nfts.length
          }
        }

        // Calculate total royalties (start at 0 since no payments have been made yet)
        const totalRoyalties = 0 // This will be updated when payment functionality is implemented

        setStats({
          totalUsers: users.length || 0,
          songsMinted: totalNFTs,
          royaltiesDistributed: totalRoyalties,
        })
      }, 0)
    }

    calculateStats()

    // Recalculate when localStorage changes
    window.addEventListener("storage", calculateStats)
    return () => window.removeEventListener("storage", calculateStats)
  }, [])

  return stats
}
