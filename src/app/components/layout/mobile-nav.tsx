'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Vote, BarChart3, History, HelpCircle, User } from 'lucide-react'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Elections', href: '/elections', icon: Vote },
  { name: 'Results', href: '/results', icon: BarChart3 },
  { name: 'My Votes', href: '/my-votes', icon: History },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-sm lg:hidden z-50">
      <div className="flex justify-around items-center">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 text-xs font-medium transition-all flex-1 rounded-md",
                isActive
                  ? "text-blue-600 bg-blue-50 shadow-inner"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-[11px]">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
