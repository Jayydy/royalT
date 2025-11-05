"use client"

import { Transaction } from '@coinbase/onchainkit/transaction'
import { useState } from 'react'

interface TransactionToastProps {
  children: React.ReactNode
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function TransactionToast({ children, onSuccess, onError }: TransactionToastProps) {
  const [isPending, setIsPending] = useState(false)

  return (
    <Transaction
      calls={[]} // This will be populated by the parent component
      onStatus={(status) => {
        if (status.statusName === 'success') {
          setIsPending(false)
          onSuccess?.()
        } else if (status.statusName === 'error') {
          setIsPending(false)
          onError?.(status.statusData)
        } else if (status.statusName === 'pending') {
          setIsPending(true)
        }
      }}
    >
      {children}
    </Transaction>
  )
}