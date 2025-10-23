"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StreamingChartProps {
  songId: string
}

export function StreamingChart({ songId }: StreamingChartProps) {
  // Generate data based on songId - in production, fetch from API
  const generateData = (songId: string) => {
    const baseStreams = parseInt(songId.slice(-4), 16) || 1000; // Use songId hash for variation
    return [
      { date: "Jan", streams: Math.floor(baseStreams * 0.1) },
      { date: "Feb", streams: Math.floor(baseStreams * 0.15) },
      { date: "Mar", streams: Math.floor(baseStreams * 0.2) },
      { date: "Apr", streams: Math.floor(baseStreams * 0.25) },
      { date: "May", streams: Math.floor(baseStreams * 0.35) },
      { date: "Jun", streams: Math.floor(baseStreams * 0.45) },
    ];
  };

  const data = generateData(songId);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          />
          <Line type="monotone" dataKey="streams" stroke="oklch(0.65 0.25 285)" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
