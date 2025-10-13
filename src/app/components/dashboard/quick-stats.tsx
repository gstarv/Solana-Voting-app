import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface QuickStatsProps {
  stats: {
    totalElections: number
    votedCount: number
    activeElections: number
    upcomingElections: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    { label: 'Total Elections', value: stats.totalElections.toString(), color: 'text-blue-600' },
    { label: 'Votes Cast', value: stats.votedCount.toString(), color: 'text-green-600' },
    { label: 'Active Elections', value: stats.activeElections.toString(), color: 'text-orange-500' },
    { label: 'Upcoming', value: stats.upcomingElections.toString(), color: 'text-purple-600' },
  ]

  return (
    <Card className="rounded-xl border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
          Quick Stats
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-3 hover:bg-gray-100 transition"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
