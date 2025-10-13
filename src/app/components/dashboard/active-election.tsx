import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Users, Clock, MapPin } from 'lucide-react'

interface ActiveElectionsProps {
  elections: Array<{
    id: string
    title: string
    location: string
    timeRemaining: string
    eligibleVoters: string
    votedCount: string
    participationRate: number
    status: 'active' | 'ending-soon'
    canVote: boolean
  }>
}

export function ActiveElections({ elections }: ActiveElectionsProps) {
  return (
    <Card className="rounded-xl border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
          Active Elections
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {elections.map((election) => (
          <div
            key={election.id}
            className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 hover:bg-gray-50 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {election.title}
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600 flex-wrap">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{election.location}</span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{election.timeRemaining}</span>
                </div>
              </div>

              <Badge
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  election.status === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {election.status === 'active' ? 'Active' : 'Ending Soon'}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm mt-3">
              <div>
                <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                  <Users className="h-3.5 w-3.5" />
                  <span>Participation Rate</span>
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {election.participationRate}%
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-xs sm:text-sm">Eligible</div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {election.eligibleVoters}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mt-3">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Voted: {election.votedCount}</span>
                <span>{election.participationRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    election.status === 'ending-soon' ? 'bg-orange-500' : 'bg-green-600'
                  }`}
                  style={{ width: `${election.participationRate}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              {election.canVote ? (
                <Button className="flex-1 text-xs sm:text-sm font-medium">
                  Vote Now
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm font-medium"
                  disabled
                >
                  Already Voted
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1 text-xs sm:text-sm font-medium border-gray-200 hover:bg-gray-100"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
