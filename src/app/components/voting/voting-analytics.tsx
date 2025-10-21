'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  PieLabelRenderProps
} from 'recharts'
import { TrendingUp, Users, Clock, Target } from 'lucide-react'

interface VotingAnalyticsProps {
  electionId: string
  timeRange?: '24h' | '7d' | '30d' | 'all'
}

const participationData = [
  { time: '00:00', votes: 45 },
  { time: '04:00', votes: 32 },
  { time: '08:00', votes: 156 },
  { time: '12:00', votes: 289 },
  { time: '16:00', votes: 342 },
  { time: '20:00', votes: 198 },
]

const demographicData = [
  { name: 'Computing', votes: 345, color: '#0088FE' },
  { name: 'Engineering', votes: 289, color: '#00C49F' },
  { name: 'Science', votes: 234, color: '#FFBB28' },
  { name: 'Arts', votes: 187, color: '#FF8042' },
  { name: 'Business', votes: 156, color: '#8884D8' },
]

const timeDistributionData = [
  { hour: 'Morning (6-12)', votes: 456, percentage: 35 },
  { hour: 'Afternoon (12-18)', votes: 589, percentage: 45 },
  { hour: 'Evening (18-24)', votes: 234, percentage: 18 },
  { hour: 'Night (0-6)', votes: 45, percentage: 2 },
]

export function VotingAnalytics({ electionId, timeRange = '7d' }: VotingAnalyticsProps) {
  const totalVotes = demographicData.reduce((sum, item) => sum + item.votes, 0)
  const participationRate = 67 // Mock data
  const averageVotingTime = '2.5 minutes'

  // ✅ Fixed Pie label function with proper typing
  const renderPieLabel = (props: PieLabelRenderProps) => {
    const { name, value } = props
    if (!name || typeof value !== 'number') return ''
    const percentage = (value / totalVotes) * 100
    return `${name} (${percentage.toFixed(1)}%)`
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{participationRate}%</div>
              <div className="text-sm text-gray-600">Participation Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{averageVotingTime}</div>
              <div className="text-sm text-gray-600">Avg Voting Time</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">+12%</div>
              <div className="text-sm text-gray-600">Vs Previous</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voting Activity Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Voting Activity (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="votes" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Votes by Faculty/Department */}
        <Card>
          <CardHeader>
            <CardTitle>Votes by Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderPieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Votes']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Voting Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Votes']}
                  />
                  <Bar dataKey="votes" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Participation Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Participation Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demographicData.map((faculty) => {
                const participationRate = Math.round((faculty.votes / 2000) * 100)
                return (
                  <div key={faculty.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{faculty.name}</span>
                      <span className="text-sm text-gray-600">{participationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${participationRate}%`,
                          backgroundColor: faculty.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{faculty.votes.toLocaleString()} votes</span>
                      <span>2,000 eligible</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">45%</div>
            <p className="text-sm text-gray-600">Mobile Votes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <p className="text-sm text-gray-600">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">23</div>
            <p className="text-sm text-gray-600">Peak Votes/Min</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
