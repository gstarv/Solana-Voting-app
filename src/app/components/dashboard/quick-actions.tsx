import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Shield, BarChart3, User, History, HelpCircle, CheckCircle } from 'lucide-react'

const quickActions = [
  {
    id: 1,
    title: 'Verify Votes',
    icon: CheckCircle,
    description: 'Check your voting history',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    href: '/my-votes',
  },
  {
    id: 2,
    title: 'View Results',
    icon: BarChart3,
    description: 'See election outcomes',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: '/results',
  },
  {
    id: 3,
    title: 'Profile',
    icon: User,
    description: 'Manage your account',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: '/profile',
  },
  {
    id: 4,
    title: 'Security',
    icon: Shield,
    description: 'Security settings',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    href: '/profile/settings',
  },
  {
    id: 5,
    title: 'History',
    icon: History,
    description: 'Voting history',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/my-votes',
  },
  {
    id: 6,
    title: 'Help',
    icon: HelpCircle,
    description: 'Get support',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    href: '/help',
  },
]

export function QuickActions() {
  return (
    <Card className="rounded-xl border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                className="group h-auto p-3 sm:p-4 flex flex-col items-center justify-center gap-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/60 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
                asChild
              >
                <a href={action.href} className="flex flex-col items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${action.color}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900">
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 hidden sm:block">
                      {action.description}
                    </p>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
