"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  songId: string
}

export function RevenueChart({ songId }: RevenueChartProps) {
  // Generate data based on songId - in production, fetch from API
  const generateData = (songId: string) => {
    const baseRevenue = (parseInt(songId.slice(-4), 16) || 1000) * 0.001; // Use songId hash for variation
    return [
      { date: "Jan", revenue: Number((baseRevenue * 0.1).toFixed(3)) },
      { date: "Feb", revenue: Number((baseRevenue * 0.15).toFixed(3)) },
      { date: "Mar", revenue: Number((baseRevenue * 0.2).toFixed(3)) },
      { date: "Apr", revenue: Number((baseRevenue * 0.25).toFixed(3)) },
      { date: "May", revenue: Number((baseRevenue * 0.35).toFixed(3)) },
      { date: "Jun", revenue: Number((baseRevenue * 0.45).toFixed(3)) },
    ];
  };

  const data = generateData(songId);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.08 285 / 0.3)" />
          <XAxis dataKey="date" stroke="oklch(0.65 0.05 285)" />
          <YAxis stroke="oklch(0.65 0.05 285)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.15 0.06 285 / 0.9)",
              border: "1px solid oklch(0.25 0.08 285 / 0.5)",
              borderRadius: "8px",
              color: "oklch(0.98 0.01 285)",
            }}
            formatter={(value: number) => [`${value.toFixed(2)} ETH`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.75 0.18 85)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
