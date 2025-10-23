"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Music2, ExternalLink } from "lucide-react"

interface ConnectMusicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectMusicDialog({ open, onOpenChange }: ConnectMusicDialogProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = (platform: string) => {
    setConnecting(platform)

    // Simulate OAuth popup
    const width = 600
    const height = 700
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    const authWindow = window.open(
      `https://accounts.${platform}.com/authorize?client_id=demo&redirect_uri=${window.location.origin}/auth/callback`,
      `${platform}_auth`,
      `width=${width},height=${height},left=${left},top=${top}`,
    )

    // Simulate successful connection after 2 seconds
    setTimeout(() => {
      authWindow?.close()
      setConnecting(null)
      alert(`Successfully connected to ${platform}! Music data will now be synced.`)
      onOpenChange(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Music2 className="w-6 h-6 text-primary" />
            Connect Music Profile
          </DialogTitle>
          <DialogDescription>
            Connect your streaming platform accounts to automatically sync your music data and track royalties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            onClick={() => handleConnect("spotify")}
            disabled={connecting !== null}
            className="w-full h-16 bg-[#1DB954] hover:bg-[#1ed760] text-white justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Music2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">
                {connecting === "spotify" ? "Connecting..." : "Connect Spotify"}
              </span>
            </div>
            <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button
            onClick={() => handleConnect("apple-music")}
            disabled={connecting !== null}
            className="w-full h-16 bg-gradient-to-r from-[#FA243C] to-[#FA5C7C] hover:opacity-90 text-white justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Music2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">
                {connecting === "apple-music" ? "Connecting..." : "Connect Apple Music"}
              </span>
            </div>
            <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button
            onClick={() => handleConnect("youtube-music")}
            disabled={connecting !== null}
            className="w-full h-16 bg-[#FF0000] hover:bg-[#cc0000] text-white justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Music2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">
                {connecting === "youtube-music" ? "Connecting..." : "Connect YouTube Music"}
              </span>
            </div>
            <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Your data is secure and will only be used to display analytics and calculate royalties.
        </p>
      </DialogContent>
    </Dialog>
  )
}
