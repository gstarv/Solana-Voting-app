'use client'

import { useState } from 'react'
import { ElectionList } from '@/components/elections/election-list'
import { VotingInterface } from '@/components/elections/voter-interface'
import { ResultsChart } from '@/components/elections/result-chart'
import { RealTimeUpdates } from '@/components/elections/real-time-updates'
import { ParticipationMap } from '@/components/elections/participation-map'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Vote, BarChart3, Map, Activity, Clock, Users } from 'lucide-react'

export function Elections() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedElection, setSelectedElection] = useState<string | null>(null)

  // Mock data for demonstration
  const mockElectionData = {
    id: '1',
    title: 'Student Union Elections 2024',
    positions: [
      {
        id: 'president',
        title: 'Student Union President',
        description: 'Lead the student union and represent student interests',
        candidates: [
          {
            id: '1',
            name: 'John Smith',
            position: 'President',
            department: 'Computer Science',
            votes: 450,
            isLeading: true,
            manifesto: 'Focused on improving student facilities and mental health support'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            position: 'President',
            department: 'Business Administration',
            votes: 380,
            isLeading: false,
            manifesto: 'Advocating for better career services and industry partnerships'
          }
        ]
      },
      {
        id: 'vice-president',
        title: 'Vice President',
        description: 'Support the president and manage daily operations',
        candidates: [
          {
            id: '3',
            name: 'Mike Chen',
            position: 'Vice President',
            department: 'Engineering',
            votes: 420,
            isLeading: true,
            manifesto: 'Committed to enhancing student club funding and activities'
          },
          {
            id: '4',
            name: 'Emily Davis',
            position: 'Vice President',
            department: 'Political Science',
            votes: 410,
            isLeading: false,
            manifesto: 'Focused on campus sustainability and environmental initiatives'
          }
        ]
      }
    ],
    timeRemaining: '2 days left'
  }

  const mockResultsData = [
    {
      position: 'Student Union President',
      candidates: [
        { name: 'John Smith', votes: 450, percentage: 54, color: '#0088FE' },
        { name: 'Sarah Johnson', votes: 380, percentage: 46, color: '#00C49F' }
      ],
      totalVotes: 830,
      participationRate: 68
    }
  ]

  const mockLocationData = [
    {
      id: '1',
      name: 'Main Campus',
      totalVoters: 5000,
      votedCount: 3400,
      participationRate: 68,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      trend: 'up' as const
    },
    {
      id: '2',
      name: 'Engineering',
      totalVoters: 1200,
      votedCount: 960,
      participationRate: 80,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      trend: 'up' as const
    },
    {
      id: '3',
      name: 'Business',
      totalVoters: 800,
      votedCount: 520,
      participationRate: 65,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      trend: 'stable' as const
    },
    {
      id: '4',
      name: 'Arts',
      totalVoters: 600,
      votedCount: 360,
      participationRate: 60,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      trend: 'down' as const
    }
  ]

  const handleVoteSubmit = (votes: Record<string, string>) => {
    console.log('Votes submitted:', votes)
    // Here you would typically send votes to your blockchain/backend
    alert('Vote submitted successfully!')
    setSelectedElection(null)
    setActiveTab('results') // Navigate to results after voting
  }

  const handleVoteNow = (electionId: string) => {
    setSelectedElection(electionId)
    setActiveTab('vote')
  }

  const handleViewResults = (electionId: string) => {
    setSelectedElection(electionId)
    setActiveTab('results')
  }

  // Quick stats for the header
  const quickStats = [
    { label: 'Active Elections', value: '3', icon: Vote, color: 'text-blue-600' },
    { label: 'Total Voters', value: '12,458', icon: Users, color: 'text-green-600' },
    { label: 'Participation', value: '72%', icon: Activity, color: 'text-purple-600' },
    { label: 'Time Left', value: '2 days', icon: Clock, color: 'text-orange-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Elections</h1>
              <p className="text-gray-600">Manage and participate in ongoing elections</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            All Elections
          </TabsTrigger>
          <TabsTrigger value="vote" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Vote Now
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* All Elections Tab */}
        <TabsContent value="all" className="space-y-6">
          <ElectionList 
            onVoteNow={handleVoteNow}
            onViewResults={handleViewResults}
          />
        </TabsContent>

        {/* Vote Now Tab */}
        <TabsContent value="vote">
          {selectedElection ? (
            <Card>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
              </CardHeader>
              <CardContent>
                <VotingInterface 
                  election={mockElectionData}
                  onVoteSubmit={handleVoteSubmit}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Election Selected
                </h3>
                <p className="text-gray-600 mb-4">
                  Select an election from the &quot;All Elections&quot; tab to start voting
                </p>
                <button 
                  onClick={() => setActiveTab('all')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Elections
                </button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Election Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsChart 
                results={mockResultsData} 
                chartType="bar"
              />
              <RealTimeUpdates 
                electionId={selectedElection || '1'}
                updateInterval={3000}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participation Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ParticipationMap 
                locations={mockLocationData}
                overallParticipation={72}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}