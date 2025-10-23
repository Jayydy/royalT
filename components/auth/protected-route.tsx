"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useUser } from "@/contexts/user-context"
import type { UserRole } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading) {
      if (!isConnected) {
        router.push("/get-started")
        return
      }

      if (!user) {
        router.push("/get-started")
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push(`/dashboard/${user.role}`)
      }
    }
  }, [isConnected, user, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isConnected || !user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
