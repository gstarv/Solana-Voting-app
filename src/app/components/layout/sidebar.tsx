'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Vote,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  History,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Elections', href: '/elections', icon: Vote }, // ✅ CHANGED: /dashboard/elections → /elections
  { name: 'Results', href: '/results', icon: BarChart3 }, // ✅ CHANGED: /dashboard/results → /results
  { name: 'My Votes', href: '/my-votes', icon: History }, // ✅ CHANGED: /dashboard/my-votes → /my-votes
  { name: 'Profile', href: '/profile', icon: User }, // ✅ CHANGED: /dashboard/profile → /profile
  { name: 'Help', href: '/help', icon: HelpCircle }, // ✅ CHANGED: /dashboard/help → /help
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 mr-3',
                  isActive ? 'text-blue-600' : 'text-gray-400'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Quick Stats Section */}
      <div className="p-4 border-t border-gray-200 bg-white/60 backdrop-blur-sm">
        <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">
          QUICK STATS
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Active Elections</span>
            <span className="font-semibold text-blue-600">2</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Your Votes</span>
            <span className="font-semibold text-green-600">5</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Verified</span>
            <span className="font-semibold text-emerald-600">Yes</span>
          </div>
        </div>
      </div>
    </aside>
  )
}