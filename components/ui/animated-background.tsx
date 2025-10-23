"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const backgrounds = [
  // Abstract musical waves
  "linear-gradient(135deg, oklch(0.3 0.15 285) 0%, oklch(0.2 0.1 240) 50%, oklch(0.15 0.05 285) 100%)",
  // Deep purple to blue
  "linear-gradient(45deg, oklch(0.25 0.2 285) 0%, oklch(0.2 0.15 240) 100%)",
  // Neon blue waves
  "linear-gradient(225deg, oklch(0.2 0.15 240) 0%, oklch(0.25 0.1 285) 50%, oklch(0.2 0.05 240) 100%)",
  // Gold accent
  "linear-gradient(315deg, oklch(0.3 0.15 285) 0%, oklch(0.25 0.1 85) 50%, oklch(0.2 0.15 240) 100%)",
  // Purple dominance
  "linear-gradient(180deg, oklch(0.25 0.2 285) 0%, oklch(0.15 0.1 285) 100%)",
]

export function AnimatedBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
    }, 12000) // Change every 12 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: backgrounds[currentIndex],
          }}
        />
      </AnimatePresence>

      {/* Animated overlay patterns */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.4 0.2 285 / 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, oklch(0.4 0.2 240 / 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, oklch(0.5 0.15 85 / 0.2) 0%, transparent 50%)`,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
