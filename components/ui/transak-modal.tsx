"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface TransakModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransakModal({ open, onOpenChange }: TransakModalProps) {
  const handleUseTransak = () => {
    window.open("https://global.transak.com/", "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buy or Sell Crypto</DialogTitle>
          <DialogDescription>Use Transak to convert between fiat and cryptocurrency</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2 p-6">
              <div className="text-4xl">💳</div>
              <p className="text-sm font-medium">Transak Widget</p>
              <p className="text-xs text-muted-foreground">Fiat on/off ramp for cryptocurrency</p>
              <p className="text-xs text-muted-foreground mt-4">
                Click the button below to access Transak and create an account or initialize payment
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Buy crypto with credit card, debit card, or bank transfer</p>
            <p>• Sell crypto and receive fiat in your bank account</p>
            <p>• Support for multiple cryptocurrencies and payment methods</p>
          </div>
          <Button onClick={handleUseTransak} className="w-full bg-primary hover:bg-primary/90 gap-2">
            <ExternalLink className="w-4 h-4" />
            Use Transak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
