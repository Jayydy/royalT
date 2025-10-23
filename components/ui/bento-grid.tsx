"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoItemProps {
  children: ReactNode
  className?: string
  span?: "1" | "2" | "full"
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr ${className}`}>{children}</div>
  )
}

export function BentoItem({ children, className = "", span = "1" }: BentoItemProps) {
  const spanClass = {
    "1": "col-span-1",
    "2": "md:col-span-2",
    full: "col-span-full",
  }[span]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`glass-strong p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all ${spanClass} ${className}`}
    >
      {children}
    </motion.div>
  )
}
