import { createPublicClient, createWalletClient, http, custom, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, CHAIN_ID } from '@/lib/contract-config';

export function useContracts() {
  // Create public client for read operations
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http()
  });

  // Create wallet client for write operations (using window.ethereum)
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum)
  });

  const mintSongNFT = async (
    uri: string,
    artist: string,
    price: bigint,
    songId: number,
    amount: number,
    songURI: string,
    royaltyReceiver: string,
    feeNumerator: number,
    royaltySplit: string
  ) => {
    try {
      const [address] = await walletClient.requestAddresses();

      // First set the URI for the song
      const { request: setUriRequest } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.SongNFT,
        abi: CONTRACT_ABIS.SongNFT,
        functionName: 'setSongURI',
        args: [songId, songURI],
        account: address,
      });

      await walletClient.writeContract(setUriRequest);

      // Then mint the NFT
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.SongNFT,
        abi: CONTRACT_ABIS.SongNFT,
        functionName: 'mintSongNFT',
        args: [artist, price, songId, amount, songURI, royaltyReceiver, feeNumerator, royaltySplit],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return receipt;
    } catch (error) {
      console.error('Error minting song NFT:', error);
      throw error;
    }
  };

  const depositRoyalties = async (
    account: string,
    songId: number,
    amount: number,
    isConditional: boolean = false
  ) => {
    try {
      const [address] = await walletClient.requestAddresses();
      
      const contractAddress = isConditional 
        ? CONTRACT_ADDRESSES.ConditionalEscrow 
        : CONTRACT_ADDRESSES.RoyaltySplitEscrow;

      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: isConditional ? CONTRACT_ABIS.ConditionalEscrow : CONTRACT_ABIS.RoyaltySplitEscrow,
        functionName: 'depositETH',
        args: [account, address, songId, parseEther(amount.toString()), CHAIN_ID],
        value: parseEther(amount.toString()),
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return receipt;
    } catch (error) {
      console.error('Error depositing royalties:', error);
      throw error;
    }
  };

  const withdrawRoyalties = async (
    account: string,
    songId: number,
    collaborators: string[],
    shares: number[],
    isConditional: boolean = false
  ) => {
    try {
      const [address] = await walletClient.requestAddresses();
      
      if (isConditional) {
        // For conditional escrow, first check and approve if needed
        const { request: approvalRequest } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESSES.ConditionalEscrow,
          abi: CONTRACT_ABIS.ConditionalEscrow,
          functionName: 'approveRelease',
          args: ['0x0000000000000000000000000000000000000000', songId], // Use zero address for ETH
          account: address,
        });
        await walletClient.writeContract(approvalRequest);
      }

      // Process withdrawal through RoyaltySplitEscrow
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.RoyaltySplitEscrow,
        abi: CONTRACT_ABIS.RoyaltySplitEscrow,
        functionName: 'withdrawETH',
        args: [account, songId, collaborators, shares],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return receipt;
    } catch (error) {
      console.error('Error withdrawing royalties:', error);
      throw error;
    }
  };

  const getEscrowBalance = async (account: string, songId: number, isConditional: boolean = false) => {
    try {
      const contractAddress = isConditional 
        ? CONTRACT_ADDRESSES.ConditionalEscrow 
        : CONTRACT_ADDRESSES.RoyaltySplitEscrow;

      const balance = await publicClient.readContract({
        address: contractAddress,
        abi: isConditional ? CONTRACT_ABIS.ConditionalEscrow : CONTRACT_ABIS.RoyaltySplitEscrow,
        functionName: 'getBalance',
        args: [account, songId],
      });

      return balance;
    } catch (error) {
      console.error('Error getting escrow balance:', error);
      throw error;
    }
  };

  return {
    mintSongNFT,
    depositRoyalties,
    withdrawRoyalties,
    getEscrowBalance,
  };
}
