'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '../ui/button'
import { LogOut, User } from 'lucide-react'

export function WalletConnector() {
  const { connected, disconnect, publicKey } = useWallet()

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium hidden sm:inline">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
          <span className="text-sm font-medium sm:hidden">
            {publicKey.toBase58().slice(0, 2)}...{publicKey.toBase58().slice(-2)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return <WalletMultiButton />
}