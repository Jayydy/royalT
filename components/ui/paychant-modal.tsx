"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PaychantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaychantModal({ open, onOpenChange }: PaychantModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buy or Sell Crypto</DialogTitle>
          <DialogDescription>Use Paychant to convert between fiat and Base USDC on testnet</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2 p-6">
              <div className="text-4xl">💳</div>
              <p className="text-sm font-medium">Paychant Widget</p>
              <p className="text-xs text-muted-foreground">Fiat on/off ramp for Base USDC</p>
              <p className="text-xs text-muted-foreground mt-4">
                Integration placeholder - connect your Paychant account to enable fiat conversions
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Buy crypto with credit card, debit card, or bank transfer</p>
            <p>• Sell crypto and receive fiat in your bank account</p>
            <p>• All transactions target Base USDC on testnet</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
