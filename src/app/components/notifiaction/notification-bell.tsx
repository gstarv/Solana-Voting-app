'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { NotificationItem } from './notification-item'

// sample notifications (you already have something similar)
const initialNotifications = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'Faculty Elections Ending Soon',
    message: 'Voting ends in 3 hours for Faculty Computing Representative',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'New Election Available',
    message: 'Student Union Elections 2024 is now open for voting',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'success' as const,
    title: 'Vote Successfully Cast',
    message: 'Your vote for Student Union President has been recorded',
    time: '1 day ago',
    read: true,
  },
]

export function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header — replaced DropdownMenuLabel with a plain div */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-semibold text-sm">Notifications ({unreadCount})</div>

          {unreadCount > 0 ? (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          ) : null}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild className="p-0 focus:bg-transparent">
                <div className="w-full">
                  <NotificationItem
                    notification={{
                      id: notification.id,
                      type: notification.type,
                      title: notification.title,
                      message: notification.message,
                      time: notification.time,
                      read: notification.read,
                    }}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-sm text-center text-gray-500">No new notifications</div>
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="p-2">
          <a href="/notifications" className="block text-center text-sm text-gray-600 hover:text-gray-800">
            View all notifications
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
