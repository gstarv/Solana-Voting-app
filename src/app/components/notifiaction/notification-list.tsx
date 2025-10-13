import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Bell, CheckCircle } from 'lucide-react'

const notifications = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'Faculty Elections Ending Soon',
    message: 'Voting ends in 3 hours for Faculty Computing Representative',
    time: '10 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'New Election Available',
    message: 'Student Union Elections 2024 is now open for voting',
    time: '2 hours ago',
    read: false
  },
  {
    id: '3',
    type: 'success' as const,
    title: 'Vote Successfully Cast',
    message: 'Your vote for Student Union President has been recorded',
    time: '1 day ago',
    read: true
  }
]

export function NotificationList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Notifications</span>
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                notification.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                'bg-green-100 text-green-600'
              }`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                  {notification.read && (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}