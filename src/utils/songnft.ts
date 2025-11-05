import { ethers } from "ethers";
// ABI compiled by Foundry (ensure out/SongNFT.sol/SongNFT.json exists)
import SongNFTJson from "../../out/SongNFT.sol/SongNFT.json";

const DEFAULT_ADDRESS = "0x9B7dE684347b295135972C9A71282694Bd860417";
const SONGNFT_ADDRESS = (process.env.NEXT_PUBLIC_SONGNFT_ADDRESS || DEFAULT_ADDRESS).trim();

const abi = (SongNFTJson as any).abi;

/**
 * Return an ethers.Contract instance for SongNFT.
 * @param signerOrProvider ethers.Signer | ethers.providers.Provider
 */
export function getSongNFTContract(signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
  if (!SONGNFT_ADDRESS) throw new Error("SongNFT address not configured");
  const providerOrSigner = signerOrProvider ?? (typeof window !== "undefined" && (window as any).ethereum ? new ethers.providers.Web3Provider((window as any).ethereum) : ethers.getDefaultProvider());
  return new ethers.Contract(SONGNFT_ADDRESS, abi, providerOrSigner);
}

/**
 * Try to extract an ethers.Signer from an OnchainKit-like object.
 * Accepts the typical OnchainKit instance, or a provider object, or falls back to window.ethereum.
 * @param onchainKit An OnchainKit instance or a provider
 */
export function getSignerFromOnchainKit(onchainKit?: any): ethers.Signer | null {
  try {
    // Common OnchainKit patterns expose wallet.provider or provider
    const provider = onchainKit?.wallet?.provider ?? onchainKit?.provider ?? (typeof window !== "undefined" ? (window as any).ethereum : null);
    if (!provider) return null;
    const web3Provider = new ethers.providers.Web3Provider(provider);
    return web3Provider.getSigner();
  } catch (err) {
    return null;
  }
}

/**
 * Create a Song for public sale (owner-only: sets metadata without minting).
 * @param params { songId, price, totalSupply, songURI, royaltyReceiver, feeNumerator, royaltySplit }
 * @param signer ethers.Signer instance to send the tx (must be contract owner)
 */
export async function createSong(
  params: {
    songId: ethers.BigNumberish;
    price: ethers.BigNumberish;
    totalSupply: ethers.BigNumberish;
    songURI: string;
    royaltyReceiver: string;
    feeNumerator: ethers.BigNumberish;
    royaltySplit: string;
  },
  signer?: ethers.Signer
) {
  if (!signer) {
    // try to auto-obtain signer from window or OnchainKit
    signer = getSignerFromOnchainKit();
    if (!signer) throw new Error("No signer available for createSong");
  }

  const contract = getSongNFTContract(signer);
  const tx = await contract.createSong(
    params.songId,
    params.price,
    params.totalSupply,
    params.songURI,
    params.royaltyReceiver,
    params.feeNumerator,
    params.royaltySplit
  );
  return tx;
}

/**
 * Buy Song NFT tokens (public payable function).
 * @param params { songId, amount } - amount must be > 0, msg.value must be price * amount
 * @param signer ethers.Signer instance to send the tx
 */
export async function buySongNFT(
  params: {
    songId: ethers.BigNumberish;
    amount: ethers.BigNumberish;
  },
  signer?: ethers.Signer
) {
  if (!signer) {
    // try to auto-obtain signer from window or OnchainKit
    signer = getSignerFromOnchainKit();
    if (!signer) throw new Error("No signer available for buySongNFT");
  }

  const contract = getSongNFTContract(signer);

  // Get song metadata to calculate required payment
  const meta = await contract._songData(params.songId);
  const totalPrice = ethers.BigNumber.from(meta.price).mul(params.amount);

  const tx = await contract.buySongNFT(params.songId, params.amount, {
    value: totalPrice,
  });
  return tx;
}

/**
 * Mint a Song NFT (thin wrapper).
 * Note: mintSongNFT is onlyOwner in your contract — the signer must be the contract owner.
 * @param params { account, price, songId, amount, songURI, royaltyReceiver, feeNumerator, royaltySplit }
 * @param signer ethers.Signer instance to send the tx
 */
export async function mintSongNFT(
  params: {
    account: string;
    price: ethers.BigNumberish;
    songId: ethers.BigNumberish;
    amount: ethers.BigNumberish;
    songURI: string;
    royaltyReceiver: string;
    feeNumerator: ethers.BigNumberish;
    royaltySplit: string;
  },
  signer?: ethers.Signer
) {
  if (!signer) {
    // try to auto-obtain signer from window or OnchainKit
    signer = getSignerFromOnchainKit();
    if (!signer) throw new Error("No signer available for mintSongNFT");
  }

  const contract = getSongNFTContract(signer);
  const tx = await contract.mintSongNFT(
    params.account,
    params.price,
    params.songId,
    params.amount,
    params.songURI,
    params.royaltyReceiver,
    params.feeNumerator,
    params.royaltySplit
  );
  return tx;
}