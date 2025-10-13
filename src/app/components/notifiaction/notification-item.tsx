import { Bell, CheckCircle } from 'lucide-react'

interface NotificationItemProps {
  notification: {
    id: string
    type: 'info' | 'warning' | 'success' | 'error'
    title: string
    message: string
    time: string
    read: boolean
  }
  onMarkAsRead?: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-100 text-orange-600'
      case 'success': return 'bg-green-100 text-green-600'
      case 'error': return 'bg-red-100 text-red-600'
      default: return 'bg-blue-100 text-blue-600'
    }
  }

  return (
    <div
      className={`p-3 border rounded-lg ${
        notification.read ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${getIconColor(notification.type)}`}>
          <Bell className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
            </div>
            {!notification.read && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="ml-2 p-1 hover:bg-gray-100 rounded"
              >
                <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-600" />
              </button>
            )}
            {notification.read && (
              <CheckCircle className="h-4 w-4 text-green-600 ml-2 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}