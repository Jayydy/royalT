"use client"

import type React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { sepolia, baseSepolia, polygonMumbai } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia, baseSepolia, polygonMumbai],
    transports: {
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
      [polygonMumbai.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "RoyalT",
    appDescription: "Web3 Music Royalties Platform",
    appUrl: "https://royalt.app",
    appIcon: "https://royalt.app/icon.png",
  }),
)

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          customTheme={{
            "--ck-font-family": "var(--font-geist-sans)",
            "--ck-border-radius": "12px",
            "--ck-connectbutton-background": "oklch(0.65 0.25 285)",
            "--ck-connectbutton-hover-background": "oklch(0.55 0.22 240)",
            "--ck-primary-button-background": "oklch(0.65 0.25 285)",
            "--ck-primary-button-hover-background": "oklch(0.55 0.22 240)",
          }}
          options={{
            walletConnectName: "WalletConnect",
            hideNoWalletCTA: true,
            hideQuestionMarkCTA: true,
            initialChainId: 11155111, // Sepolia
            enforceSupportedChains: false,
            customSupportedChains: [
              {
                id: 11155111, // Sepolia
                name: "Ethereum Sepolia",
                network: "sepolia",
                nativeCurrency: {
                  name: "Sepolia Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: {
                  default: {
                    http: ["https://rpc.sepolia.org"],
                  },
                },
                blockExplorers: {
                  default: {
                    name: "Etherscan",
                    url: "https://sepolia.etherscan.io",
                  },
                },
                testnet: true,
              },
              {
                id: 84532, // Base Sepolia
                name: "Base Sepolia",
                network: "base-sepolia",
                nativeCurrency: {
                  name: "Sepolia Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: {
                  default: {
                    http: ["https://sepolia.base.org"],
                  },
                },
                blockExplorers: {
                  default: {
                    name: "BaseScan",
                    url: "https://sepolia.basescan.org",
                  },
                },
                testnet: true,
              },
              {
                id: 80001, // Polygon Mumbai
                name: "Polygon Mumbai",
                network: "polygon-mumbai",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: {
                  default: {
                    http: ["https://rpc-mumbai.maticvigil.com"],
                  },
                },
                blockExplorers: {
                  default: {
                    name: "PolygonScan",
                    url: "https://mumbai.polygonscan.com",
                  },
                },
                testnet: true,
              },
            ],
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
