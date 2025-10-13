'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { MapPin, Users, TrendingUp } from 'lucide-react'

interface LocationData {
  id: string
  name: string
  totalVoters: number
  votedCount: number
  participationRate: number
  coordinates: { lat: number; lng: number }
  trend: 'up' | 'down' | 'stable'
}

interface ParticipationMapProps {
  locations: LocationData[]
  overallParticipation: number
}

export function ParticipationMap({ locations, overallParticipation }: ParticipationMapProps) {
  const getColorForRate = (rate: number) => {
    if (rate >= 80) return 'bg-green-500'
    if (rate >= 60) return 'bg-blue-500'
    if (rate >= 40) return 'bg-yellow-500'
    if (rate >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <span className="w-4 h-4">→</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall Participation</h3>
              <p className="text-3xl font-bold text-blue-600">{overallParticipation}%</p>
              <p className="text-sm text-gray-600">
                Across {locations.length} locations
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>
                  {locations.reduce((sum, loc) => sum + loc.votedCount, 0).toLocaleString()} voted
                </span>
              </div>
              <div className="text-sm text-gray-600">
                out of {locations.reduce((sum, loc) => sum + loc.totalVoters, 0).toLocaleString()} registered
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Participation by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-6 min-h-[300px] relative">
            {/* Simplified map representation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className={`p-4 rounded-lg text-white text-center cursor-pointer hover:scale-105 transition-transform ${getColorForRate(location.participationRate)}`}
                  style={{
                    gridArea: `span 1 / span 1`,
                    opacity: 0.7 + (location.participationRate / 100) * 0.3
                  }}
                >
                  <MapPin className="h-4 w-4 mx-auto mb-1" />
                  <div className="font-semibold text-sm">{location.name}</div>
                  <div className="text-xs opacity-90">{location.participationRate}%</div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm">
              <div className="text-sm font-medium mb-2">Participation Rate</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>0-20%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>20-40%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>40-60%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>60-80%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>80-100%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Location List */}
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-600">
                      {location.votedCount.toLocaleString()} / {location.totalVoters.toLocaleString()} voters
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">{location.participationRate}%</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {getTrendIcon(location.trend)}
                      <span>Participation</span>
                    </div>
                  </div>
                  <Badge 
                    className={getColorForRate(location.participationRate).replace('bg-', 'bg-').replace('-500', '-100').replace('bg-', '') + ' text-gray-800'}
                  >
                    {location.participationRate >= 80 ? 'High' :
                     location.participationRate >= 60 ? 'Good' :
                     location.participationRate >= 40 ? 'Average' :
                     location.participationRate >= 20 ? 'Low' : 'Very Low'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}