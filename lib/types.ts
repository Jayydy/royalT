export type UserRole = "artist" | "fan"

export interface User {
  id: string
  address: string
  walletAddress: string
  role: UserRole
  username?: string
  name?: string
  bio?: string
  avatar?: string
  createdAt: string
}

export interface Song {
    id: string
    artistId: string
    title: string
    description: string
    coverImage: string
    audioUrl: string
    nftContractAddress?: string
    totalSupply: number
    mintedCount: number
    royaltyPercentage: number
    price: string
    createdAt: string
    ipfsUri?: string
    spotifyUrl?: string
    appleMusicUrl?: string
    youtubeMusicUrl?: string
  }

export interface NFT {
  id: string
  songId: string
  tokenId: number
  ownerId: string
  mintedAt: Date
}

export interface StreamingData {
  songId: string
  platform: "spotify" | "apple" | "youtube" | "other"
  streams: number
  revenue: string
  date: Date
}

export interface Comment {
  id: string
  songId: string
  userId: string
  content: string
  createdAt: string
}
