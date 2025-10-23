import { useState } from 'react'
import pinataSDK from '@pinata/sdk'

const pinata = new pinataSDK({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
})

interface UploadResult {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export function usePinataUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadToIPFS = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const result: UploadResult = await response.json()
      return `ipfs://${result.IpfsHash}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const uploadMetadata = async (metadata: object): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new Error('Failed to upload metadata to IPFS')
      }

      const result: UploadResult = await response.json()
      return `ipfs://${result.IpfsHash}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Metadata upload failed')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadToIPFS,
    uploadMetadata,
    isUploading,
    error,
  }
}