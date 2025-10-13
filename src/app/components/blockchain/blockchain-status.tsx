'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Wifi, Shield, Zap, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BlockchainStatus {
  connected: boolean
  blockHeight: number
  performance: 'excellent' | 'good' | 'poor'
  lastUpdate: string
}

export function BlockchainStatus() {
  const { connection } = useConnection()
  const [status, setStatus] = useState<BlockchainStatus>({
    connected: false,
    blockHeight: 0,
    performance: 'good',
    lastUpdate: new Date().toLocaleTimeString()
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const blockHeight = await connection.getBlockHeight()
        
        setStatus({
          connected: true,
          blockHeight,
          performance: 'excellent',
          lastUpdate: new Date().toLocaleTimeString()
        })
        
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          connected: false,
          performance: 'poor',
          lastUpdate: new Date().toLocaleTimeString()
        }))
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [connection])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Blockchain Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Connection</span>
          <Badge 
            variant={status.connected ? "success" : "destructive"}
            className={status.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {status.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Block Height</span>
          <span className="text-sm font-mono">{status.blockHeight.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Performance</span>
          <Badge 
            className={
              status.performance === 'excellent' ? 'bg-green-100 text-green-800' :
              status.performance === 'good' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }
          >
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
      </CardContent>
    </Card>
  )
}