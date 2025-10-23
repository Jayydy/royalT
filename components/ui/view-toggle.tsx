"use client"

import { Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, createContext, useContext, type ReactNode } from "react"

type ViewMode = "desktop" | "mobile"

interface ViewContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop")

  return <ViewContext.Provider value={{ viewMode, setViewMode }}>{children}</ViewContext.Provider>
}

export function useView() {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error("useView must be used within ViewProvider")
  }
  return context
}

export function ViewToggle() {
  const { viewMode, setViewMode } = useView()

  return (
    <div className="flex gap-2 glass-strong p-2 rounded-lg border border-primary/30">
      <Button
        variant={viewMode === "desktop" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("desktop")}
        className={viewMode === "desktop" ? "bg-primary" : ""}
      >
        <Monitor className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === "mobile" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("mobile")}
        className={viewMode === "mobile" ? "bg-primary" : ""}
      >
        <Smartphone className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function ViewContainer({ children }: { children: ReactNode }) {
  const { viewMode } = useView()

  return (
    <div className={`mx-auto transition-all duration-300 ${viewMode === "mobile" ? "max-w-[375px]" : "w-full"}`}>
      {children}
    </div>
  )
}
