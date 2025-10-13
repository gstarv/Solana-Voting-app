'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Calendar, MapPin, Bell } from 'lucide-react'
import { memo } from 'react'

interface UpcomingElectionsProps {
  elections: Array<{
    id: string
    title: string
    location: string
    startDate: string
    positions: string
    status: 'upcoming'
  }>
}

export const UpcomingElections = memo(function UpcomingElections({
  elections,
}: UpcomingElectionsProps) {
  const handleReminder = (title: string) => {
    alert(`🔔 Reminder set for "${title}"`)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upcoming Elections</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {elections.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-6">
            No upcoming elections at the moment.
          </div>
        ) : (
          elections.map((election) => (
            <div key={election.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
                    {election.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{election.location}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                >
                  Upcoming
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{election.startDate}</span>
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  <span className="font-medium">Positions:</span>{' '}
                  {election.positions}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  onClick={() => handleReminder(election.title)}
                >
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Remind Me</span>
                  <span className="sm:hidden">Remind</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                >
                  View Info
                </Button>
              </div>
            </div>
          ))
        )}

        {/* View All Button */}
        {elections.length > 0 && (
          <Button variant="outline" className="w-full text-sm">
            View All Upcoming Elections
          </Button>
        )}
      </CardContent>
    </Card>
  )
})
