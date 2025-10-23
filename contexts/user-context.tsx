"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAccount } from "wagmi"
import type { User } from "@/lib/types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      if (!isConnected || !address) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const storedUser = localStorage.getItem(`user_${address}`)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Error loading user:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [address, isConnected])

  return <UserContext.Provider value={{ user, setUser, isLoading }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
