'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
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
  Cell
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'

interface ResultsData {
  position: string
  candidates: Array<{
    name: string
    votes: number
    percentage: number
    color: string
  }>
  totalVotes: number
  participationRate: number
}

interface ResultsChartProps {
  results: ResultsData[]
  chartType?: 'bar' | 'pie'
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function ResultsChart({ results, chartType = 'bar' }: ResultsChartProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No results data available
        </CardContent>
      </Card>
    )
  }

  const barData =
    results[0]?.candidates.map(candidate => ({
      name: candidate.name,
      votes: candidate.votes,
      percentage: candidate.percentage
    })) || []

  const pieData =
    results[0]?.candidates.map(candidate => ({
      name: candidate.name,
      value: candidate.votes
    })) || []

  // Calculate average participation with explicit typing
  const totalParticipation = results.reduce((acc: number, result: ResultsData) => {
    return acc + result.participationRate
  }, 0)

  const averageParticipation = Math.round(totalParticipation / results.length)

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results
                .reduce((total: number, result: ResultsData) => total + result.totalVotes, 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Votes Cast</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {averageParticipation}%
            </div>
            <p className="text-sm text-gray-600">Average Participation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {results.length}
            </div>
            <p className="text-sm text-gray-600">Positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{results[0]?.position} - Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Votes']} />
                  <Bar dataKey="votes" fill="#0088FE" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: PieLabelRenderProps) => {
                      const name = props.name
                      const percent = Number(props.percent ?? 0)
                      return `${name} (${(percent * 100).toFixed(1)}%)`
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Votes']} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        {results.map(positionResult => (
          <Card key={positionResult.position}>
            <CardHeader>
              <CardTitle className="text-lg">{positionResult.position}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {positionResult.candidates.map(candidate => (
                  <div
                    key={candidate.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: candidate.color }}
                      />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {candidate.votes.toLocaleString()} votes
                      </div>
                      <div className="text-sm text-gray-600">
                        {candidate.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t text-sm text-gray-600">
                  <span>Total Votes: {positionResult.totalVotes.toLocaleString()}</span>
                  <span>Participation: {positionResult.participationRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
