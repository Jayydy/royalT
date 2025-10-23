"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SilkBackground } from "@/components/ui/silk-background"
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid"
import { ViewContainer } from "@/components/ui/view-toggle"
import { useUser } from "@/contexts/user-context"
import { Coins, TrendingUp, Download, Calendar } from "lucide-react"
import { RoyaltyHistoryChart } from "@/components/royalties/royalty-history-chart"
import { useAccount } from "wagmi"

interface RoyaltyPayment {
  id: string
  amount: string
  date: Date
  songTitle: string
  platform: string
  status: "pending" | "completed"
}

function RoyaltiesPageContent() {
  const { user } = useUser()
  const { address } = useAccount()
  const [payments, setPayments] = useState<RoyaltyPayment[]>([])
  const [totalEarned, setTotalEarned] = useState(0)
  const [pendingAmount, setPendingAmount] = useState(0)

  useEffect(() => {
    if (!user?.id) return

    const storedPayments = localStorage.getItem(`royalties_${user.id}`)
    if (storedPayments) {
      const parsedPayments = JSON.parse(storedPayments)
      setPayments(parsedPayments)

      const completed = parsedPayments
        .filter((p: RoyaltyPayment) => p.status === "completed")
        .reduce((acc: number, p: RoyaltyPayment) => acc + Number.parseFloat(p.amount), 0)
      const pending = parsedPayments
        .filter((p: RoyaltyPayment) => p.status === "pending")
        .reduce((acc: number, p: RoyaltyPayment) => acc + Number.parseFloat(p.amount), 0)

      setTotalEarned(completed)
      setPendingAmount(pending)
    }
  }, [user?.id])

  const handleWithdraw = async () => {
    if (pendingAmount === 0) return
    alert(`Withdrawing ${pendingAmount.toFixed(3)} ETH to ${address}`)
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <SilkBackground />
      </div>

      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Royalty Management
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Track and manage your streaming royalty payments</p>
        </div>

        <BentoGrid className="mb-8">
          <BentoItem>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-3xl font-bold">{totalEarned.toFixed(3)} ETH</p>
              <p className="text-xs text-muted-foreground mt-1">${(totalEarned * 3500).toFixed(2)} USD</p>
            </div>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <Badge className="bg-accent/20 text-accent">Available</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Withdrawal</p>
              <p className="text-3xl font-bold">{pendingAmount.toFixed(3)} ETH</p>
              <p className="text-xs text-muted-foreground mt-1">${(pendingAmount * 3500).toFixed(2)} USD</p>
            </div>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">
                {payments
                  .filter((p) => new Date(p.date).getMonth() === new Date().getMonth())
                  .reduce((acc, p) => acc + Number.parseFloat(p.amount), 0)
                  .toFixed(3)}{" "}
                ETH
              </p>
              {payments.length > 0 && <p className="text-xs text-primary mt-1">Active earnings</p>}
            </div>
          </BentoItem>
        </BentoGrid>

        {/* Withdraw Section */}
        {pendingAmount > 0 && (
          <Card className="glass-strong p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Ready to Withdraw</h3>
                <p className="text-muted-foreground">
                  You have {pendingAmount.toFixed(3)} ETH available for withdrawal
                </p>
                <p className="text-sm text-muted-foreground">
                  Funds will be sent to: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <Button onClick={handleWithdraw} size="lg" className="bg-accent hover:bg-accent/90">
                <Download className="w-5 h-5 mr-2" />
                Withdraw {pendingAmount.toFixed(3)} ETH
              </Button>
            </div>
          </Card>
        )}

        {/* Chart */}
        <Card className="glass-strong p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Earnings Over Time</h3>
            <Badge variant="outline">Last 6 Months</Badge>
          </div>
          <RoyaltyHistoryChart />
        </Card>

        {/* Payment History */}
        {payments.length > 0 && (
          <Card className="glass-strong p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Payment History</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="glass p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        payment.status === "completed" ? "bg-primary/20" : "bg-accent/20"
                      }`}
                    >
                      <Coins className={`w-5 h-5 ${payment.status === "completed" ? "text-primary" : "text-accent"}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{payment.songTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.platform} • {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{payment.amount} ETH</p>
                      <p className="text-xs text-muted-foreground">
                        ${(Number.parseFloat(payment.amount) * 3500).toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      variant={payment.status === "completed" ? "default" : "outline"}
                      className={payment.status === "completed" ? "bg-primary/20 text-primary" : ""}
                    >
                      {payment.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {payments.length === 0 && (
          <Card className="glass-strong p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Coins className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No royalty payments yet</h3>
              <p className="text-muted-foreground">
                Royalty payments will appear here once your songs start generating revenue
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function RoyaltiesPage() {
  return (
    <ViewContainer>
      <RoyaltiesPageContent />
    </ViewContainer>
  )
}
