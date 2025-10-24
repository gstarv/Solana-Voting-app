'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Wifi, Shield, Clock, Wallet, User, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WalletStatus {
  connected: boolean
  publicKey: string | null
  isConnected: boolean
}

interface BlockchainStatus {
  connected: boolean
  blockHeight: number
  performance: 'excellent' | 'good' | 'poor'
  lastUpdate: string
  error: string | null // NEW: Added error state
}

export function BlockchainStatus() {
  const { connection } = useConnection()
  const { connected, publicKey } = useWallet()
  
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    connected: false,
    publicKey: null,
    isConnected: false
  })
  
  const [status, setStatus] = useState<BlockchainStatus>({
    connected: false,
    blockHeight: 0,
    performance: 'good',
    lastUpdate: new Date().toLocaleTimeString(),
    error: null // NEW: Initialize error state
  })

  // UPDATED: Blockchain status checking with error handling
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const blockHeight = await connection.getBlockHeight()
        
        setStatus({
          connected: true,
          blockHeight,
          performance: 'excellent',
          lastUpdate: new Date().toLocaleTimeString(),
          error: null // NEW: Clear error on success
        })
        
      } catch (error) {
        // NEW: Properly use the error variable
        const errorMessage = error instanceof Error ? error.message : 'Failed to connect to blockchain'
        
        setStatus(prev => ({
          ...prev,
          connected: false,
          performance: 'poor',
          lastUpdate: new Date().toLocaleTimeString(),
          error: errorMessage // NEW: Store the actual error message
        }))
        
        console.error('Blockchain connection error:', error)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [connection])

  // Wallet status monitoring
  useEffect(() => {
    const updateWalletStatus = () => {
      if (connected && publicKey) {
        setWalletStatus({
          connected: true,
          publicKey: publicKey.toBase58(),
          isConnected: true
        })
      } else {
        setWalletStatus({
          connected: false,
          publicKey: null,
          isConnected: false
        })
      }
    }

    updateWalletStatus()
  }, [connected, publicKey])

  // Helper function to format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // NEW: Function to get performance color based on status
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Status Section */}
        <div className="space-y-3 pb-3 border-b">
          <h4 className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Wallet className="h-4 w-4" />
            Wallet Connection
          </h4>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status</span>
            <Badge 
              variant={walletStatus.connected ? "success" : "secondary"}
              className={walletStatus.connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {walletStatus.connected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>

          {walletStatus.connected && walletStatus.publicKey && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <User className="h-3 w-3" />
                Wallet Address
              </span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {formatAddress(walletStatus.publicKey)}
              </span>
            </div>
          )}
        </div>

        {/* Blockchain Status Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Shield className="h-4 w-4" />
            Voting Network
          </h4>

          {/* NEW: Error display */}
          {status.error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Network</span>
            <Badge 
              variant={status.connected ? "success" : "destructive"}
              className={status.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {status.connected ? 'Online' : 'Offline'}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Block Height</span>
            <span className="text-sm font-mono">
              {status.connected ? status.blockHeight.toLocaleString() : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Performance</span>
            <Badge className={getPerformanceColor(status.performance)}>
              {status.performance.charAt(0).toUpperCase() + status.performance.slice(1)}
            </Badge>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
            <span>Last updated</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {status.lastUpdate}
            </span>
          </div>

          {/* NEW: Retry button when there's an error */}
          {status.error && (
            <button 
              onClick={() => window.location.reload()}
              className="w-full mt-2 py-1 px-3 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              Retry Connection
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}