"use client"

import { useEffect, useRef, useState } from "react"

interface InteractiveWaveformProps {
  className?: string
  barCount?: number
}

export function InteractiveWaveform({ className = "", barCount = 80 }: InteractiveWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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

    const bars: { height: number; targetHeight: number; speed: number; phase: number }[] = Array(barCount)
      .fill(0)
      .map((_, i) => ({
        height: Math.random() * 0.5 + 0.3,
        targetHeight: Math.random() * 0.5 + 0.3,
        speed: 0.02 + Math.random() * 0.03,
        phase: (i / barCount) * Math.PI * 2,
      }))

    let animationId: number
    let time = 0

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const barWidth = width / barCount

      ctx.clearRect(0, 0, width, height)

      time += 0.01

      bars.forEach((bar, i) => {
        const x = i * barWidth
        const centerX = width / 2
        const centerY = height / 2

        // Calculate distance from mouse
        const distanceFromMouse = Math.sqrt(Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - centerY, 2))
        const mouseInfluence = Math.max(0, 1 - distanceFromMouse / 300)

        // Calculate scroll influence
        const scrollInfluence = Math.sin(scrollY * 0.01 + bar.phase) * 0.2

        // Update target height based on influences
        bar.targetHeight =
          0.3 + Math.sin(time + bar.phase) * 0.3 + mouseInfluence * 0.4 + scrollInfluence + Math.random() * 0.1

        // Smooth transition to target height
        bar.height += (bar.targetHeight - bar.height) * 0.1

        const barHeight = bar.height * height * 0.8
        const y = (height - barHeight) / 2

        // Create gradient based on position and mouse proximity
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)

        if (mouseInfluence > 0.3) {
          // Near mouse - use accent colors
          gradient.addColorStop(0, "oklch(0.75 0.18 85)") // Gold
          gradient.addColorStop(0.5, "oklch(0.55 0.22 240)") // Neon blue
          gradient.addColorStop(1, "oklch(0.65 0.25 285)") // Purple
        } else {
          // Default gradient
          gradient.addColorStop(0, "oklch(0.65 0.25 285)") // Purple
          gradient.addColorStop(0.5, "oklch(0.55 0.22 240)") // Neon blue
          gradient.addColorStop(1, "oklch(0.75 0.18 85)") // Gold
        }

        ctx.fillStyle = gradient
        ctx.shadowBlur = 20
        ctx.shadowColor = mouseInfluence > 0.3 ? "oklch(0.75 0.18 85)" : "oklch(0.65 0.25 285)"
        ctx.fillRect(x + barWidth * 0.15, y, barWidth * 0.7, barHeight)
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [barCount, mousePos, scrollY])

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />
}
