import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/lib/contract-config'
import { useState } from 'react'

export function useSongNFT() {
  const [isCreating, setIsCreating] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  // Write contract hooks
  const { writeContract: writeCreateSong, data: createSongHash } = useWriteContract()
  const { writeContract: writeBuySongNFT, data: buySongHash } = useWriteContract()

  // Transaction receipt hooks
  const { isLoading: isCreateConfirming, isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({
    hash: createSongHash,
  })

  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash: buySongHash,
  })

  // Create song function (for artists/owners)
  const createSong = async (params: {
    songId: bigint
    price: bigint
    totalSupply: bigint
    songURI: string
    royaltyReceiver: `0x${string}`
    feeNumerator: bigint
    royaltySplit: `0x${string}`
  }) => {
    setIsCreating(true)
    try {
      await writeCreateSong({
        address: CONTRACT_ADDRESSES.SongNFT as `0x${string}`,
        abi: CONTRACT_ABIS.SongNFT,
        functionName: 'createSong',
        args: [
          params.songId,
          params.price,
          params.totalSupply,
          params.songURI,
          params.royaltyReceiver,
          params.feeNumerator,
          params.royaltySplit,
        ],
      })
    } catch (error) {
      console.error('Failed to create song:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  // Buy song NFT function (for fans)
  const buySongNFT = async (params: {
    songId: bigint
    amount: bigint
    value: bigint
  }) => {
    setIsBuying(true)
    try {
      await writeBuySongNFT({
        address: CONTRACT_ADDRESSES.SongNFT as `0x${string}`,
        abi: CONTRACT_ABIS.SongNFT,
        functionName: 'buySongNFT',
        args: [params.songId, params.amount],
        value: params.value,
      })
    } catch (error) {
      console.error('Failed to buy song NFT:', error)
      throw error
    } finally {
      setIsBuying(false)
    }
  }

  return {
    // Create song
    createSong,
    isCreating: isCreating || isCreateConfirming,
    isCreateSuccess,

    // Buy song NFT
    buySongNFT,
    isBuying: isBuying || isBuyConfirming,
    isBuySuccess,
  }
}