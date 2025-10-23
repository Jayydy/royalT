"use client"

import { usePlatformStats } from "@/hooks/use-platform-stats"

export function PlatformStats() {
  const stats = usePlatformStats()

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 pt-6 sm:pt-8 md:pt-12 max-w-2xl mx-auto px-2">
      <div className="space-y-1 md:space-y-2">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
          {stats.royaltiesDistributed > 0 ? `$${(stats.royaltiesDistributed * 3500).toFixed(0)}` : "$0"}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground text-pretty leading-snug">
          Royalties Distributed
        </div>
      </div>
      <div className="space-y-1 md:space-y-2">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
          {stats.songsMinted}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground text-pretty leading-snug">Songs Minted</div>
      </div>
      <div className="space-y-1 md:space-y-2">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent">
          {stats.totalUsers}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground text-pretty leading-snug">Active Users</div>
      </div>
    </div>
  )
}