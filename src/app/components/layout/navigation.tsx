'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Vote, BarChart3, History, HelpCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Elections', href: '/elections', icon: Vote },
  { name: 'Results', href: '/results', icon: BarChart3 },
  { name: 'My Votes', href: '/my-votes', icon: History },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex space-x-8">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 border-b-2 py-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}