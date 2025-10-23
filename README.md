# 🎵 RoyalT — The Web3 Music Royalty Platform

## 🏆 Overview

**RoyalT** is a decentralized Web3 platform designed to **empower artists and fans** by transforming the traditional music royalty ecosystem through blockchain technology.  
It enables **artists** to mint **music NFTs**, collect automated royalties, and gain insights from their streaming data — while **fans** can collect NFTs, support artists, and share in the growth of their music.

> **Empowering Fans. Rewarding Artists.**

---

## 🎯 Platform Vision

RoyalT aims to:
- Simplify **royalty collection** through transparent on-chain smart contracts.  
- Enable **artists** to tokenize their songs as **ERC1155 NFTs**.  
- Allow **fans** to collect, trade, or claim limited song NFTs.  
- Automate **royalty distributions** based on real streaming metrics.  
- Provide **real-time analytics** for artists' streams and earnings.  

---

## ⚙️ Core Features

- 🎶 **NFT Minting & Listing:** Artists can mint ERC1155-based music NFTs.  
- 💸 **Royalty Distribution:** Automated on-chain payout via escrow smart contracts.  
- 📈 **Analytics Dashboard:** Display of total streams and earnings from integrated streaming oracles.  
- 💰 **Fiat On/Off Ramp:** Transak integration for easy conversion between fiat and crypto.  
- 🔐 **Wallet Integration:** Supports MetaMask and Coinbase Wallet through WalletConnect.  
- 🌍 **Cross-Chain Compatibility:** Works across Base Sepolia and Ethereum Sepolia testnets.  
- 🤝 **Fan Interaction:** Fans can comment and engage on NFT claim pages.  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (React), TypeScript, TailwindCSS |
| **Blockchain** | Solidity (ERC1155 + Escrow + RoyaltySplit + ConditionalEscrow) |
| **Storage** | IPFS / Pinata for NFT metadata |
| **Backend** | Node.js, Express, GraphQL (for analytics and off-chain logic) |
| **Wallets** | MetaMask, Coinbase (via WalletConnect v3) |
| **Fiat Gateway** | Transak |
| **Database (optional)** | Supabase / MongoDB |

---

## 🧠 Smart Contracts

Located in the `src/` directory and developed using **Foundry**.

### Main Contracts
- `SongNFT.sol` — ERC1155 NFT for songs and royalties.  
- `BaseEscrow.sol` — Handles platform fees and basic escrow functionality.  
- `ConditionalEscrow.sol` — Releases funds based on stream milestones and oracle reports.  
- `RoyaltySplitEscrow.sol` — Automatically splits royalties among verified stakeholders.  
- `EscrowUtils.sol` — Utility functions for token/ETH transfers.  

### Compile & Test

```bash
cd royalT
forge install
forge compile
forge test

Deployment
Frontend: Vercel

Smart Contracts: Base Sepolia / Ethereum Sepolia

Storage: IPFS (Pinata)

💡 Example Workflow
Artist connects wallet (MetaMask or Coinbase).

Mints a new song NFT (ERC1155) linked to IPFS metadata.

Sets royalty recipients and locks distribution in RoyaltySplitEscrow.

Lists the NFT with conditional escrow terms.

Fan connects wallet and claims the NFT.

Streaming data oracles submit signed reports to ConditionalEscrow.

Upon meeting conditions, funds release and auto-distribute via RoyaltySplitEscrow.

Artists view analytics and withdraw royalties via escrow.

🧩 Environment Variables
Variable	Description
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID	WalletConnect Project ID for Coinbase/MetaMask
NEXT_PUBLIC_TRANSAK_API_KEY	API key for Transak fiat gateway
NEXT_PUBLIC_PINATA_API_KEY	Pinata API key for IPFS uploads
NEXT_PUBLIC_PINATA_SECRET_API_KEY	Pinata secret key for IPFS uploads
PRIVATE_KEY	Deployer private key
BASE_SEPOLIA_RPC_URL	Base Sepolia RPC URL
ETHERSCAN_API_KEY	Etherscan API key for verification

📜 License
This project is licensed under the MIT License — feel free to use, adapt, and improve it.

💎 Credits
Developed by the RoyalT Team

Empowering Artists. Rewarding Fans.
The next era of music ownership and royalties — powered by Web3.

🖤 Support the Vision
If you believe in fair artist compensation and fan-powered music ecosystems, give this repo a ⭐ on GitHub!
