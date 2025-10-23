"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { Navbar } from "@/components/layout/navbar"
import { ViewContainer } from "@/components/ui/view-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Music2, Users, ArrowRight, Upload } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import type { UserRole } from "@/lib/types"

export default function GetStartedPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { user, setUser } = useUser()
  const [step, setStep] = useState<"connect" | "role" | "profile">("connect")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && isConnected) {
      router.push(`/dashboard/${user.role}`)
    } else if (isConnected) {
      setStep("role")
    }
  }, [user, isConnected, router])

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep("profile")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !selectedRole) return

    setIsSubmitting(true)

    try {
      const newUser = {
        id: crypto.randomUUID(),
        address: address,
        role: selectedRole,
        name,
        username,
        bio,
        avatar: profileImage || (selectedRole === "artist" ? "/artist-avatar.png" : "/fan-avatar.jpg"),
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage for demo
      localStorage.setItem(`user_${address}`, JSON.stringify(newUser))
      setUser(newUser)

      // Redirect based on role
      if (selectedRole === "artist") {
        router.push("/dashboard/artist")
      } else {
        router.push("/dashboard/fan")
      }
    } catch (error) {
      console.error("[v0] Error creating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 1: Connect Wallet
  if (!isConnected) {
    return (
      <ViewContainer>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 pt-32">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Connect Your Wallet
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground text-balance">
                  To get started with RoyalT, you'll need to connect your Web3 wallet
                </p>
              </div>

              <Card className="glass-strong p-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Music2 className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Ready to Join?</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to create your profile and start minting or collecting music NFTs
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ConnectKitButton />
                  </div>

                </div>
              </Card>
            </div>
          </div>
        </div>
      </ViewContainer>
    )
  }

  // Step 2: Choose Role
  if (step === "role") {
    return (
      <ViewContainer>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 pt-32">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Choose Your Role
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground text-balance">
                  Are you an artist looking to mint NFTs or a fan ready to collect?
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className="glass-strong p-8 space-y-6 cursor-pointer hover:scale-105 transition-all border-primary/30 hover:border-primary group"
                  onClick={() => handleRoleSelect("artist")}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Music2 className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">I'm an Artist</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Mint your songs as NFTs, track streaming analytics, and automatically collect royalties from your
                      fans
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Card>

                <Card
                  className="glass-strong p-8 space-y-6 cursor-pointer hover:scale-105 transition-all border-secondary/30 hover:border-secondary group"
                  onClick={() => handleRoleSelect("fan")}
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">I'm a Fan</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Collect music NFTs from your favorite artists, earn royalties from streams, and engage with the
                      community
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-semibold group-hover:gap-4 transition-all">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ViewContainer>
    )
  }

  // Step 3: Complete Profile
  return (
    <ViewContainer>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Complete Your Profile
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Tell us a bit about yourself to personalize your experience
              </p>
            </div>

            <Card className="glass-strong p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Profile Picture</Label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                      {profileImage ? (
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        <div className="glass p-4 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors text-center">
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-background/50 border-border/50"
                  />
                </div>

                {selectedRole === "artist" && (
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell fans about your music and journey..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="bg-background/50 border-border/50 resize-none"
                    />
                  </div>
                )}

                <div className="glass p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <span className="text-sm font-semibold capitalize">{selectedRole}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wallet</span>
                    <span className="text-sm font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("role")}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Profile..." : "Complete Setup"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </ViewContainer>
  )
}
