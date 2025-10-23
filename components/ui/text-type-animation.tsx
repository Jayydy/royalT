"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TextTypeAnimationProps {
  texts: string[]
  className?: string
  interval?: number
}

export function TextTypeAnimation({ texts, className = "", interval = 4000 }: TextTypeAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-2xl md:text-3xl font-semibold text-primary/80"
        >
          {texts[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
