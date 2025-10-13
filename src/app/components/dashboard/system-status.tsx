'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Wifi, Shield, Zap, Clock } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface StatusItem {
  icon: LucideIcon
  label: string
  value: string
  color: string
  isConnected?: boolean
}

export function SystemStatus() {
  const statusData = {
    blockchain: {
      label: 'Blockchain',
      value: 'Connected',
      color: 'bg-green-100 text-green-700',
      isConnected: true,
    },
    security: {
      label: 'Security Level',
      value: 'High',
      color: 'bg-blue-100 text-blue-700',
    },
    performance: {
      label: 'Performance',
      value: 'Excellent',
      color: 'bg-purple-100 text-purple-700',
    },
    lastUpdated: '2 minutes ago',
  }

  const statusItems: StatusItem[] = [
    { icon: Wifi, ...statusData.blockchain },
    { icon: Shield, ...statusData.security },
    { icon: Zap, ...statusData.performance },
  ]

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
            System Status
          </CardTitle>

          {/* Header badge */}
          <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {statusItems.map(({ icon: Icon, label, value, color, isConnected }, idx) => (
          <div key={idx} className="flex justify-between items-center py-1.5">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-500" aria-hidden />
              <span className="text-sm text-gray-700">{label}</span>
            </div>

            <div className="flex items-center gap-2">
              {isConnected && (
                <span className="relative inline-flex w-3 h-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" aria-hidden />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600" aria-hidden />
                </span>
              )}
              <Badge className={`text-xs font-medium ${color}`} aria-live="polite">
                {value}
              </Badge>
            </div>
          </div>
        ))}

        <div className="border-t border-gray-100 my-3" />

        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <span>Last updated</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <span>{statusData.lastUpdated}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
