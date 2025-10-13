import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Bell, Clock, AlertTriangle, Info } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: 'Faculty Elections Ending Soon',
    description: '5 hours remaining',
    time: 'Just now',
    type: 'urgent',
  },
  {
    id: 2,
    title: 'New Election Available',
    description: 'Student Union 2024',
    time: '2 hours ago',
    type: 'info',
  },
]

export function NotificationsPanel() {
  return (
    <Card className="rounded-xl border border-gray-100 shadow-sm">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <span>Notifications</span>
        </CardTitle>
        <span className="text-sm font-normal text-gray-500">(2)</span>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition hover:bg-gray-50 ${
              notification.type === 'urgent'
                ? 'border-orange-200 bg-orange-50/40'
                : 'border-blue-200 bg-blue-50/40'
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                notification.type === 'urgent'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {notification.type === 'urgent' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {notification.description}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {notification.time}
              </p>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full text-sm mt-3 border-gray-200 hover:bg-gray-50"
        >
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}
