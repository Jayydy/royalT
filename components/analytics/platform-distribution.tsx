"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface PlatformDistributionProps {
  songId: string
}

export function PlatformDistribution({ songId }: PlatformDistributionProps) {
  // Generate data based on songId - in production, fetch from API
  const generateData = (songId: string) => {
    const baseStreams = parseInt(songId.slice(-4), 16) || 1000; // Use songId hash for variation
    return [
      { platform: "Spotify", streams: Math.floor(baseStreams * 2.8), color: "oklch(0.65 0.25 285)" },
      { platform: "Apple Music", streams: Math.floor(baseStreams * 1.5), color: "oklch(0.55 0.22 240)" },
      { platform: "YouTube", streams: Math.floor(baseStreams * 1.2), color: "oklch(0.75 0.18 85)" },
      { platform: "SoundCloud", streams: Math.floor(baseStreams * 0.8), color: "oklch(0.6 0.2 200)" },
      { platform: "Tidal", streams: Math.floor(baseStreams * 0.5), color: "oklch(0.7 0.15 320)" },
    ];
  };

  const data = generateData(songId);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.08 285 / 0.3)" />
          <XAxis dataKey="platform" stroke="oklch(0.65 0.05 285)" />
          <YAxis stroke="oklch(0.65 0.05 285)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.15 0.06 285 / 0.9)",
              border: "1px solid oklch(0.25 0.08 285 / 0.5)",
              borderRadius: "8px",
              color: "oklch(0.98 0.01 285)",
            }}
            formatter={(value: number) => [`${value.toLocaleString()} streams`, "Streams"]}
          />
          <Bar dataKey="streams" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
