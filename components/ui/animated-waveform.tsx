"use client"

import { useEffect, useRef } from "react"

interface AnimatedWaveformProps {
  className?: string
  barCount?: number
  color?: string
}

export function AnimatedWaveform({
  className = "",
  barCount = 50,
  color = "oklch(0.65 0.25 285)",
}: AnimatedWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const bars: number[] = Array(barCount)
      .fill(0)
      .map(() => Math.random())
    const speeds: number[] = Array(barCount)
      .fill(0)
      .map(() => 0.02 + Math.random() * 0.03)

    let animationId: number

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const barWidth = width / barCount

      ctx.clearRect(0, 0, width, height)

      bars.forEach((bar, i) => {
        bars[i] += speeds[i]
        if (bars[i] > 1) bars[i] = 0

        const barHeight = Math.sin(bars[i] * Math.PI) * height * 0.8
        const x = i * barWidth
        const y = (height - barHeight) / 2

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, color)
        gradient.addColorStop(0.5, "oklch(0.55 0.22 240)")
        gradient.addColorStop(1, "oklch(0.75 0.18 85)")

        ctx.fillStyle = gradient
        ctx.fillRect(x + barWidth * 0.2, y, barWidth * 0.6, barHeight)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [barCount, color])

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />
}
