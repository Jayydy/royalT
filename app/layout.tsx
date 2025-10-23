import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/providers/web3-provider"
import { UserProvider } from "@/contexts/user-context"
import { ViewProvider } from "@/components/ui/view-toggle"
import { Suspense } from "react"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "RoyalT - Web3 Music Royalties Platform",
  description: "Mint song NFTs, collect streaming royalties, and engage with fans on the blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${orbitron.variable} ${montserrat.variable}`}>
        <Suspense fallback={null}>
          <Web3Provider>
            <UserProvider>
              <ViewProvider>{children}</ViewProvider>
            </UserProvider>
          </Web3Provider>
        </Suspense>
      </body>
    </html>
  )
}
