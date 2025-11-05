"use client"

import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { Avatar, Name, Address } from '@coinbase/onchainkit/identity'
import { Badge } from '@/components/ui/badge'

export function WalletConnect() {
  return (
    <ConnectWallet>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8" />
        <div className="flex flex-col">
          <Name className="text-sm font-medium" />
          <Address className="text-xs text-muted-foreground">
            {(address) => (
              <Badge variant="secondary" className="text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            )}
          </Address>
        </div>
      </div>
    </ConnectWallet>
  )
}