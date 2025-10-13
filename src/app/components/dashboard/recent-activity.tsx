import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { CheckCircle, Eye, UserCheck, Clock } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'vote',
    action: 'Voted in Library Committee Elections',
    timestamp: '2 days ago',
    icon: CheckCircle,
    color: 'text-green-600',
    status: 'completed'
  },
  {
    id: 2,
    type: 'view',
    action: 'Viewed Student Union Election Details',
    timestamp: '2 weeks ago', 
    icon: Eye,
    color: 'text-blue-600',
    status: 'viewed'
  },
  {
    id: 3,
    type: 'verification',
    action: 'Profile Verification Completed',
    timestamp: '2 weeks ago',
    icon: UserCheck,
    color: 'text-purple-600',
    status: 'completed'
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${activity.color} bg-opacity-10 flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 mb-1 truncate">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{activity.timestamp}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        activity.status === 'completed' 
                          ? 'bg-green-50 text-green-700 border-green-200 text-xs' 
                          : 'bg-blue-50 text-blue-700 border-blue-200 text-xs'
                      }
                    >
                      {activity.status === 'completed' ? 'Completed' : 'Viewed'}
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <Button variant="outline" className="w-full text-sm">
          View Full Activity History
        </Button>
      </CardContent>
    </Card>
  )
}