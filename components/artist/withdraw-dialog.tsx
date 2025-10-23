"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, AlertCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useContracts } from "@/hooks/use-contracts"
import { parseEther } from "viem"

interface Recipient {
  id: string
  title: string
  address: string
  percentage: number
}

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableBalance: number
  songId: number
  account: string
  isConditional?: boolean
}

export function WithdrawDialog({ 
  open, 
  onOpenChange, 
  availableBalance, 
  songId,
  account,
  isConditional = false 
}: WithdrawDialogProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const { withdrawRoyalties } = useContracts()

  const handleAddRecipient = () => {
    const newRecipient: Recipient = {
      id: crypto.randomUUID(),
      title: "",
      address: "",
      percentage: 0
    }
    setRecipients([...recipients, newRecipient])
  }

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id))
  }

  const handleRecipientChange = (id: string, field: keyof Recipient, value: string | number) => {
    setRecipients(recipients.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value }
      }
      return r
    }))
  }

  const validateForm = () => {
    if (!amount) {
      setError("Please enter an amount")
      return false
    }
    
    const withdrawAmount = Number(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("Please enter a valid amount")
      return false
    }
    
    if (withdrawAmount > availableBalance) {
      setError("Insufficient balance")
      return false
    }

    if (recipients.length === 0) {
      setError("Please add at least one recipient")
      return false
    }

    // Check for empty or invalid addresses
    const invalidRecipient = recipients.find(r => !r.address || !r.address.match(/^0x[a-fA-F0-9]{40}$/))
    if (invalidRecipient) {
      setError("Please enter valid Ethereum addresses for all recipients")
      return false
    }

    // Validate that recipient percentages don't exceed 100%
    const totalPercentage = recipients.reduce((sum, r) => sum + r.percentage, 0)
    if (totalPercentage !== 100) {
      setError("Total recipient percentages must equal 100%")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const collaborators = recipients.map(r => r.address)
      const shares = recipients.map(r => r.percentage)

      await withdrawRoyalties(
        account,
        songId,
        collaborators,
        shares,
        isConditional
      )

      onOpenChange(false)
      setAmount("")
      setRecipients([])
    } catch (error: any) {
      setError(error.message || "Failed to process withdrawal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Manage Royalty Withdrawals
            </span>
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Available balance: {availableBalance.toFixed(4)} ETH</p>
            {availableBalance <= 0 && (
              <p className="text-muted-foreground">
                No royalties available for withdrawal yet. They will appear here once you start earning from your NFTs.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Withdraw</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              min="0"
              max={availableBalance}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError("")
              }}
              placeholder="Enter amount in ETH"
              className="bg-background/50"
            />
          </div>

          {/* Recipients Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Recipients</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddRecipient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Recipient
              </Button>
            </div>

            <div className="space-y-4">
              {recipients.map((recipient) => (
                <Card key={recipient.id} className="p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveRecipient(recipient.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Recipient Title</Label>
                      <Input
                        value={recipient.title}
                        onChange={(e) => handleRecipientChange(recipient.id, "title", e.target.value)}
                        placeholder="e.g., Producer, Manager"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Wallet Address</Label>
                      <Input
                        value={recipient.address}
                        onChange={(e) => handleRecipientChange(recipient.id, "address", e.target.value)}
                        placeholder="0x..."
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Percentage Split ({recipient.percentage}%)</Label>
                      <Slider
                        value={[recipient.percentage]}
                        onValueChange={(value) => handleRecipientChange(recipient.id, "percentage", value[0])}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}