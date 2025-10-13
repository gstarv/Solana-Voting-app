'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Activity, Users, Vote, Clock, TrendingUp } from 'lucide-react'

interface Update {
  id: string
  type: 'vote' | 'registration' | 'result' | 'system'
  title: string
  description: string
  timestamp: Date
  location?: string
  count?: number
}

interface RealTimeUpdatesProps {
  electionId: string
  updateInterval?: number
}

export function RealTimeUpdates({ electionId, updateInterval = 5000 }: RealTimeUpdatesProps) {
  const [updates, setUpdates] = useState<Update[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [activeVoters, setActiveVoters] = useState(0)

  // Mock real-time updates
  useEffect(() => {
    const mockUpdates: Update[] = [
      {
        id: '1',
        type: 'vote',
        title: 'New Vote Cast',
        description: 'A voter from Computing Faculty has cast their vote',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        location: 'Computing Faculty',
        count: 1
      },
      {
        id: '2',
        type: 'registration',
        title: 'New Voter Registered',
        description: 'Student registration completed for Engineering Department',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        location: 'Engineering Department'
      },
      {
        id: '3',
        type: 'result',
        title: 'Position Update',
        description: 'Leading candidate changed in Student Union President race',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        location: 'University-wide'
      }
    ]

    setUpdates(mockUpdates)
    setTotalVotes(1247)
    setActiveVoters(89)

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newUpdate: Update = {
        id: Date.now().toString(),
        type: 'vote',
        title: 'New Vote Cast',
        description: `Vote recorded from ${['Computing', 'Engineering', 'Science', 'Arts'][Math.floor(Math.random() * 4)]} Faculty`,
        timestamp: new Date(),
        location: 'Various Locations',
        count: 1
      }

      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]) // Keep last 10 updates
      setTotalVotes(prev => prev + 1)
      setActiveVoters(prev => Math.max(50, Math.min(150, prev + Math.floor(Math.random() * 3) - 1)))
    }, updateInterval)

    return () => clearInterval(interval)
  }, [electionId, updateInterval])

  const getUpdateIcon = (type: Update['type']) => {
    switch (type) {
      case 'vote':
        return <Vote className="h-4 w-4" />
      case 'registration':
        return <Users className="h-4 w-4" />
      case 'result':
        return <TrendingUp className="h-4 w-4" />
      case 'system':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getUpdateColor = (type: Update['type']) => {
    switch (type) {
      case 'vote':
        return 'bg-green-100 text-green-800'
      case 'registration':
        return 'bg-blue-100 text-blue-800'
      case 'result':
        return 'bg-purple-100 text-purple-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeVoters}</div>
              <div className="text-sm text-gray-600">Active Now</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm text-gray-600">Participation</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Updates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Live Updates
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {updates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${getUpdateColor(update.type)}`}>
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{update.title}</span>
                    <Badge variant="outline" className={getUpdateColor(update.type)}>
                      {update.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{update.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(update.timestamp)}
                    </span>
                    {update.location && (
                      <span>{update.location}</span>
                    )}
                    {update.count && (
                      <span>{update.count} vote(s)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}