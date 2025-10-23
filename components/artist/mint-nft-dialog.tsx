"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Song, NFT } from "@/lib/types"
import { useUser } from "@/contexts/user-context"
import { Upload, Music } from "lucide-react"
import { uploadToIPFS } from "@/lib/ipfs"
import { useContracts } from "@/hooks/use-contracts"

interface MintNFTDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMint: (song: Song, nft: NFT) => void
}

export function MintNFTDialog({ open, onOpenChange, onMint }: MintNFTDialogProps) {
  const { user } = useUser()
  const { mintSongNFT } = useContracts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    spotifyUrl: "",
    appleMusicUrl: "",
    youtubeMusicUrl: "",
    totalSupply: "100",
    royaltyPercentage: "10",
    price: "0.1",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      // First upload metadata to IPFS
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: coverImage || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(formData.title + " album cover")}`,
        external_url: formData.spotifyUrl || formData.appleMusicUrl || formData.youtubeMusicUrl,
        attributes: [
          {
            trait_type: "Total Supply",
            value: formData.totalSupply
          },
          {
            trait_type: "Royalty Percentage",
            value: formData.royaltyPercentage
          },
          {
            trait_type: "Spotify URL",
            value: formData.spotifyUrl || "N/A"
          },
          {
            trait_type: "Apple Music URL",
            value: formData.appleMusicUrl || "N/A"
          },
          {
            trait_type: "YouTube Music URL",
            value: formData.youtubeMusicUrl || "N/A"
          }
        ]
      };

      // Upload to IPFS via Pinata
      const ipfsHash = await uploadToIPFS(metadata);
      const uri = `ipfs://${ipfsHash}`;

      // Create and mint the NFT using the smart contract
      const receipt = await mintSongNFT(
        uri, 
        user.walletAddress,  // artist address
        [],  // collaborators (empty for now)
        []   // shares (empty for now)
      );

      // Get token ID from event
      const songId = receipt.logs[0].topics[3] as `0x${string}`; // Assuming this is where the token ID is

      // Create the song object
      const newSong: Song = {
        id: songId ? songId.toString() : crypto.randomUUID(),
        artistId: user.id,
        title: formData.title,
        description: formData.description,
        coverImage: coverImage || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(formData.title + " album cover")}`,
        audioUrl: formData.spotifyUrl || formData.appleMusicUrl || formData.youtubeMusicUrl,
        totalSupply: Number.parseInt(formData.totalSupply),
        mintedCount: 1, // First token minted
        royaltyPercentage: Number.parseFloat(formData.royaltyPercentage),
        price: formData.price,
        createdAt: new Date().toISOString(),
        spotifyUrl: formData.spotifyUrl,
        appleMusicUrl: formData.appleMusicUrl,
        youtubeMusicUrl: formData.youtubeMusicUrl,
      }

      // Create the NFT object
      const nft: NFT = {
        id: crypto.randomUUID(),
        songId: songId ? songId.toString() : crypto.randomUUID(),
        tokenId: Number(songId), // Token ID from blockchain
        ownerId: user.id,
        mintedAt: new Date()
      }

      // Save both the song and the NFT
      await onMint(newSong, nft)

      // Show success message
      alert("NFT minted successfully!")

      // Reset form and close dialog
      setCoverImage(null)
      setFormData({
        title: "",
        description: "",
        spotifyUrl: "",
        appleMusicUrl: "",
        youtubeMusicUrl: "",
        totalSupply: "100",
        royaltyPercentage: "10",
        price: "0.1",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error minting NFT:", error)
      alert("Error minting NFT: " + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mint New NFT
            </span>
          </DialogTitle>
          <DialogDescription>Create an NFT collection for your song and start earning royalties</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label className="text-base">NFT Cover Image</Label>
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-lg bg-muted border-2 border-border overflow-hidden flex items-center justify-center flex-shrink-0">
                {coverImage ? (
                  <img src={coverImage || "/placeholder.svg"} alt="NFT Cover" className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <input type="file" id="cover-image" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Label htmlFor="cover-image" className="cursor-pointer">
                  <div className="glass p-8 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload NFT cover image</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </Label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title</Label>
              <Input
                id="title"
                placeholder="Enter song title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell fans about this NFT..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-background/50 resize-none"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base">Streaming Platform URLs</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="spotify" className="text-sm text-muted-foreground">
                  Spotify
                </Label>
                <Input
                  id="spotify"
                  type="url"
                  placeholder="https://open.spotify.com/track/..."
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apple" className="text-sm text-muted-foreground">
                  Apple Music
                </Label>
                <Input
                  id="apple"
                  type="url"
                  placeholder="https://music.apple.com/..."
                  value={formData.appleMusicUrl}
                  onChange={(e) => setFormData({ ...formData, appleMusicUrl: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-sm text-muted-foreground">
                  YouTube Music
                </Label>
                <Input
                  id="youtube"
                  type="url"
                  placeholder="https://music.youtube.com/..."
                  value={formData.youtubeMusicUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeMusicUrl: e.target.value })}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supply">Quantity to Mint</Label>
              <Input
                id="supply"
                type="number"
                min="1"
                placeholder="100"
                value={formData.totalSupply}
                onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
                required
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">Number of NFTs to mint</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="royalty">Royalty Percentage</Label>
              <Input
                id="royalty"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="10"
                value={formData.royaltyPercentage}
                onChange={(e) => setFormData({ ...formData, royaltyPercentage: e.target.value })}
                required
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">Your cut from each NFT</p>
            </div>
          </div>

          <div className="glass p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Total NFTs:</span>
              <span className="font-semibold">{formData.totalSupply}</span>
              <span className="text-muted-foreground">Potential Revenue:</span>
              <span className="font-semibold">
                {(Number.parseFloat(formData.price) * Number.parseInt(formData.totalSupply || "0")).toFixed(2)} ETH
              </span>
              <span className="text-muted-foreground">Royalty Share:</span>
              <span className="font-semibold">{formData.royaltyPercentage}% per NFT</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Minting..." : "Mint NFT Collection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
