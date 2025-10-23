"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut, Wallet } from "lucide-react"
import { useDisconnect } from "wagmi"

interface DisconnectWalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DisconnectWalletModal({ open, onOpenChange }: DisconnectWalletModalProps) {
  const { disconnect } = useDisconnect()

  const handleDisconnect = () => {
    disconnect()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Disconnect Wallet
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to disconnect your wallet?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDisconnect}
            className="flex-1 bg-destructive hover:bg-destructive/90 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}