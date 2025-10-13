import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { MapPin, Calendar, Users, Clock, Vote } from 'lucide-react'

interface ElectionCardProps {
  election: {
    id: string
    title: string
    description: string
    type: 'university' | 'faculty' | 'department'
    status: 'active' | 'upcoming' | 'completed'
    startDate: string
    endDate: string
    location: string
    totalVoters: number
    votedCount: number
    isRegistered: boolean
    hasVoted: boolean
  }
}

export function ElectionCard({ election }: ElectionCardProps) {
  const participationRate = Math.round((election.votedCount / election.totalVoters) * 100)
  const isActive = election.status === 'active'
  const isUpcoming = election.status === 'upcoming'
  const isCompleted = election.status === 'completed'

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{election.title}</CardTitle>
          <Badge 
            variant={
              isActive ? 'secondary' : 
              isUpcoming ? 'outline' : 
              'default'
            }
            className={
              isActive ? 'bg-green-100 text-green-800' :
              isUpcoming ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }
          >
            {election.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{election.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Election Details */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{election.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>{election.startDate} - {election.endDate}</span>
          </div>
        </div>

        {/* Participation Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{election.votedCount.toLocaleString()} / {election.totalVoters.toLocaleString()} voted</span>
          </div>
          <span className="font-semibold">{participationRate}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${participationRate}%` }}
          />
        </div>

        {/* User Status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm">
            {election.isRegistered ? (
              election.hasVoted ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  You have voted
                </span>
              ) : (
                <span className="text-orange-600">Registered - Not voted yet</span>
              )
            ) : (
              <span className="text-gray-600">Not registered</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {isActive && election.isRegistered && !election.hasVoted && (
              <Button size="sm">
                Vote Now
              </Button>
            )}
            {isCompleted && (
              <Button variant="outline" size="sm">
                View Results
              </Button>
            )}
            {isUpcoming && (
              <Button variant="outline" size="sm">
                Set Reminder
              </Button>
            )}
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}