'use client'

import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Wallet, Zap, Clock, Wifi, Shield, User } from 'lucide-react'

interface SystemMetrics {
  online: boolean
  latency: number
  performance: 'excellent' | 'good' | 'fair' | 'poor'
  lastHealthCheck: number
}

export function SystemStatus() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()

  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [network, setNetwork] = useState<string>('Checking...')
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const [isLoading, setIsLoading] = useState(true)

  // 🔄 REAL-TIME SYSTEM METRICS
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    online: navigator.onLine,
    latency: 0,
    performance: 'good',
    lastHealthCheck: Date.now()
  })

  // ⚡ REAL-TIME BLOCKCHAIN STATUS MONITORING (15-second intervals)
  useEffect(() => {
    const fetchBlockchainStatus = async () => {
      try {
        setIsLoading(true)
        
        // 🔄 Real-time block height from Solana
        const height = await connection.getBlockHeight()
        const endpoint = connection.rpcEndpoint
        
        setBlockHeight(height)
        setNetwork(
          endpoint.includes('devnet') ? 'Devnet' : 
          endpoint.includes('testnet') ? 'Testnet' : 'Mainnet'
        )
        setConnectionStatus('connected')
        
        // 🕒 Real-time timestamp
        setLastUpdated(new Date().toLocaleTimeString())
        
      } catch (error) {
        console.error('Error fetching blockchain status:', error)
        setConnectionStatus('error')
        setNetwork('Connection Error')
      } finally {
        setIsLoading(false)
      }
    }

    // ⚡ Immediate check + 15-second intervals
    fetchBlockchainStatus()
    const blockchainInterval = setInterval(fetchBlockchainStatus, 15000)
    
    return () => clearInterval(blockchainInterval)
  }, [connection])

  // 🔄 INSTANT UPDATES ON WALLET CONNECTION CHANGES
  useEffect(() => {
    // 🎯 Live wallet connection state updates
    setLastUpdated(new Date().toLocaleTimeString())
  }, [connected, publicKey])

  // 📊 LIVE PERFORMANCE METRICS BASED ON ACTUAL RESPONSE TIMES
  useEffect(() => {
    const measureSystemMetrics = async () => {
      // Use window.performance to avoid naming conflicts
      const startTime = window.performance.now()
      
      try {
        // ⚡ Response time measurement
        await fetch('https://api.devnet.solana.com', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getHealth'
          })
        })
      } catch {
        // Fallback measurement
        await Promise.resolve()
      }
      
      const latency = Math.round(window.performance.now() - startTime)

      // 🎯 Dynamic performance rating
      let performanceLevel: SystemMetrics['performance'] = 'excellent'
      if (latency > 200) performanceLevel = 'good'
      if (latency > 500) performanceLevel = 'fair'
      if (latency > 1000) performanceLevel = 'poor'

      setSystemMetrics({
        online: navigator.onLine,
        latency,
        performance: performanceLevel, // Use different variable name
        lastHealthCheck: Date.now()
      })
    }

    measureSystemMetrics()
    const systemInterval = setInterval(measureSystemMetrics, 10000)
    return () => clearInterval(systemInterval)
  }, [])

  // 🎯 DYNAMIC COLOR CODING
  const getPerformanceColor = (performance: SystemMetrics['performance']) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'fair': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'poor': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-100 text-green-700 border-green-200'
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
            System Status
          </CardTitle>

          {/* 🎯 LIVE BADGE WITH PULSE ANIMATION */}
          <Badge
            variant="secondary"
            className={`text-xs font-medium animate-pulse ${getConnectionColor()} border`}
          >
            {isLoading ? 'Syncing...' : connectionStatus === 'connected' ? '🟢 Live' : '🔴 Offline'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* 🔄 BLOCKCHAIN CONNECTION SECTION */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Wifi className="h-4 w-4 text-blue-600" /> 
            Blockchain Network
          </h4>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status</span>
            <div className="flex items-center gap-2">
              {/* 🎯 CONNECTION INDICATORS WITH PING ANIMATION */}
              {connectionStatus === 'connected' && (
                <span className="relative inline-flex w-3 h-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600" />
                </span>
              )}
              <Badge className={`text-xs border ${getConnectionColor()}`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Network</span>
            <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200">
              {network}
            </Badge>
          </div>

          {/* 📊 ACTUAL DATA: CURRENT BLOCK HEIGHT */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Block Height</span>
            <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200 font-mono">
              {blockHeight.toLocaleString()}
            </Badge>
          </div>
        </div>

        <div className="border-t border-gray-100 my-2" />

        {/* 🎯 WALLET STATUS SECTION */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-600" /> 
            Wallet Status
          </h4>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Connection</span>
            <Badge className={`text-xs border ${
              connected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              {connected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>

          {/* 📊 ACTUAL DATA: CONNECTED ADDRESS WITH TOOLTIP */}
          {publicKey && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <User className="h-3 w-3" />
                Wallet Address
              </span>
              <Badge 
                className="text-xs bg-gray-100 text-gray-700 border-gray-200 max-w-24 truncate font-mono"
                title={publicKey.toBase58()} // 🎯 HOVER TOOLTIP
              >
                {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
              </Badge>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-2" />

        {/* 📊 PERFORMANCE METRICS SECTION */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" /> 
            Performance
          </h4>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Network Status</span>
            <Badge className={`text-xs border ${
              systemMetrics.online ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
            }`}>
              {systemMetrics.online ? 'Online' : 'Offline'}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Latency</span>
            <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
              {systemMetrics.latency} ms
            </Badge>
          </div>

          {/* 🎯 DYNAMIC PERFORMANCE RATING */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Performance</span>
            <Badge className={`text-xs border ${getPerformanceColor(systemMetrics.performance)}`}>
              {systemMetrics.performance.charAt(0).toUpperCase() + systemMetrics.performance.slice(1)}
            </Badge>
          </div>

          {/* 📊 SECURITY (STATIC) */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Security Level
            </span>
            <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
              High
            </Badge>
          </div>
        </div>

        <div className="border-t border-gray-100 my-3" />

        {/* 🕒 REAL-TIME TIMESTAMPS */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Last updated</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{lastUpdated}</span>
          </span>
        </div>

        {/* 🔄 AUTO-REFRESH INDICATOR */}
        <div className="text-xs text-gray-400 text-center">
          Auto-refreshing every 15 seconds
        </div>
      </CardContent>
    </Card>
  )
}