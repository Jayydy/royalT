"use client"

import Link from "next/link"
import { ConnectKitButton } from "connectkit"
import { Music2, Menu, X, Wallet, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useState } from "react"
import { TransakModal } from "@/components/ui/transak-modal"
import { DisconnectWalletModal } from "@/components/ui/disconnect-wallet-modal"
import { useAccount } from "wagmi"
import { WalletConnect } from "@/components/wallet/wallet-connect"

export function Navbar() {
  const { user } = useUser()
  const { address, isConnected } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [transakOpen, setTransakOpen] = useState(false)
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <img
                src="/RoyalT_logo-removebg-preview.jpeg"
                alt="RoyalT Logo"
                className="h-10 w-auto md:h-12 transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/50 transition-all rounded-full" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-end">
            <Link href="/marketplace">
              <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                Marketplace
              </Button>
            </Link>
            {user && (
              <>
                <Link href={`/dashboard/${user.role}`}>
                  <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                    Dashboard
                  </Button>
                </Link>
                {user.role === "artist" && (
                  <Link href="/royalties">
                    <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                      Royalties
                    </Button>
                  </Link>
                )}
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTransakOpen(true)}
              className="gap-2 border-primary/30 hover:border-primary/50"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden lg:inline">Buy/Sell Crypto</span>
              <span className="lg:hidden">Fiat</span>
            </Button>
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <WalletConnect />
                <button
                  onClick={() => setDisconnectModalOpen(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="[&_button]:px-3 [&_button]:py-2 sm:[&_button]:px-4 sm:[&_button]:py-2 md:[&_button]:px-5 md:[&_button]:py-3">
                <WalletConnect />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-border/50">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-foreground">
                  Marketplace
                </Button>
              </Link>
              {user && (
                <>
                  <Link href={`/dashboard/${user.role}`} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-foreground">
                      Dashboard
                    </Button>
                  </Link>
                  {user.role === "artist" && (
                    <Link href="/royalties" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-foreground">
                        Royalties
                      </Button>
                    </Link>
                  )}
                </>
              )}
              <div className="pt-2 border-t border-border/50 space-y-3">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-primary/30 hover:border-primary/50 bg-transparent"
                  onClick={() => {
                    setTransakOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Wallet className="h-4 w-4" />
                  Buy/Sell Crypto
                </Button>
                <ConnectKitButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      <TransakModal open={transakOpen} onOpenChange={setTransakOpen} />
      <DisconnectWalletModal open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen} />
    </>
  )
}
