"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RoyaltyHistoryChart() {
  // Mock data - in production, fetch from smart contracts
  const data = [
    { month: "Jan", earnings: 0.12 },
    { month: "Feb", earnings: 0.18 },
    { month: "Mar", earnings: 0.25 },
    { month: "Apr", earnings: 0.32 },
    { month: "May", earnings: 0.41 },
    { month: "Jun", earnings: 0.52 },
  ]

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.25 285)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="oklch(0.65 0.25 285)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.08 285 / 0.3)" />
          <XAxis dataKey="month" stroke="oklch(0.65 0.05 285)" />
          <YAxis stroke="oklch(0.65 0.05 285)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.15 0.06 285 / 0.9)",
              border: "1px solid oklch(0.25 0.08 285 / 0.5)",
              borderRadius: "8px",
              color: "oklch(0.98 0.01 285)",
            }}
            formatter={(value: number) => [`${value.toFixed(3)} ETH`, "Earnings"]}
          />
          <Area
            type="monotone"
            dataKey="earnings"
            stroke="oklch(0.65 0.25 285)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#earningsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
