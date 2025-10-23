"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Song } from "@/lib/types"
import { useUser } from "@/contexts/user-context"
import { usePinataUpload } from "@/hooks/use-pinata-upload"
import { Upload, ExternalLink, X } from "lucide-react"

interface MintSongDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMint: (song: Song) => void
}

export function MintSongDialog({ open, onOpenChange, onMint }: MintSongDialogProps) {
   const { user } = useUser()
   const { uploadToIPFS, uploadMetadata, isUploading, error: uploadError } = usePinataUpload()
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [coverImage, setCoverImage] = useState<File | null>(null)
   const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
   const [ipfsUri, setIpfsUri] = useState<string | null>(null)
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [formData, setFormData] = useState({
     title: "",
     description: "",
     streamingUrl: "",
     totalSupply: "100",
     royaltyPercentage: "10",
     price: "0.1",
   })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setCoverImage(null)
    setCoverImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      let coverImageUri = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(formData.title + " album cover")}`

      // Upload cover image to IPFS if provided
      if (coverImage) {
        const uploadedUri = await uploadToIPFS(coverImage)
        if (uploadedUri) {
          coverImageUri = uploadedUri
        }
      }

      // Create metadata for the NFT
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: coverImageUri,
        attributes: [
          {
            trait_type: "Artist",
            value: user.name || user.id
          },
          {
            trait_type: "Total Supply",
            value: Number.parseInt(formData.totalSupply)
          },
          {
            trait_type: "Royalty Percentage",
            value: Number.parseFloat(formData.royaltyPercentage)
          },
          {
            trait_type: "Streaming URL",
            value: formData.streamingUrl
          }
        ]
      }

      // Upload metadata to IPFS
      const metadataUri = await uploadMetadata(metadata)
      if (!metadataUri) {
        throw new Error("Failed to upload metadata to IPFS")
      }

      setIpfsUri(metadataUri)

      const newSong: Song = {
        id: crypto.randomUUID(),
        artistId: user.id,
        title: formData.title,
        description: formData.description,
        coverImage: coverImageUri,
        audioUrl: formData.streamingUrl,
        totalSupply: Number.parseInt(formData.totalSupply),
        mintedCount: 0,
        royaltyPercentage: Number.parseFloat(formData.royaltyPercentage),
        price: formData.price,
        createdAt: new Date(),
        ipfsUri: metadataUri, // Add IPFS URI to the song object
      }

      onMint(newSong)
      onOpenChange(false)

      setFormData({
        title: "",
        description: "",
        streamingUrl: "",
        totalSupply: "100",
        royaltyPercentage: "10",
        price: "0.1",
      })
      setCoverImage(null)
      setCoverImagePreview(null)
      setIpfsUri(null)
    } catch (error) {
      console.error("[v0] Error minting song:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mint New Song NFT
            </span>
          </DialogTitle>
          <DialogDescription>Create an NFT collection for your song and start earning royalties</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell fans about this song..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-background/50 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image</Label>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload">
                  <div className="glass p-8 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    {coverImagePreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              handleRemoveImage()
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <p className="text-sm text-muted-foreground">Change image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload cover</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </label>
                {isUploading && (
                  <p className="text-sm text-primary">Uploading to IPFS...</p>
                )}
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamingUrl">Streaming Platform URL</Label>
              <div className="space-y-3">
                <Input
                  id="streamingUrl"
                  type="url"
                  placeholder="https://open.spotify.com/track/..."
                  value={formData.streamingUrl}
                  onChange={(e) => setFormData({ ...formData, streamingUrl: e.target.value })}
                  required
                  className="bg-background/50"
                />
                <div className="glass p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ExternalLink className="w-3 h-3" />
                    <span>Supported platforms:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Spotify</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Apple Music</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">YouTube Music</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supply">Total Supply</Label>
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
              <Label htmlFor="royalty">Royalty %</Label>
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
              <p className="text-xs text-muted-foreground">Streaming revenue share</p>
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
              <p className="text-xs text-muted-foreground">Price per NFT</p>
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
              <span className="font-semibold">{formData.royaltyPercentage}% per stream</span>
              {ipfsUri && (
                <>
                  <span className="text-muted-foreground">IPFS URI:</span>
                  <span className="font-semibold text-xs break-all">{ipfsUri}</span>
                </>
              )}
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
