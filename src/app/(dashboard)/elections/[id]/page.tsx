import { notFound } from 'next/navigation'
import { ElectionCard } from '@/components/elections/election-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Vote, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual API call
const mockElections = {
  '1': {
    id: '1',
    title: 'Student Union Elections 2024',
    description: 'Annual elections for student union leadership positions including President, Vice President, and Secretary.',
    type: 'university' as const,
    status: 'active' as const,
    startDate: '2024-12-10',
    endDate: '2024-12-15',
    location: 'University-wide',
    totalVoters: 12458,
    votedCount: 4892,
    isRegistered: true,
    hasVoted: false,
    positions: [
      {
        id: '1',
        title: 'Student Union President',
        description: 'Chief representative of the student body',
        candidates: [
          { id: '1', name: 'John Doe', department: 'Computer Science' },
          { id: '2', name: 'Jane Smith', department: 'Engineering' }
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Faculty Computing Representative',
    description: 'Election for faculty representative position',
    type: 'faculty' as const,
    status: 'active' as const,
    startDate: '2024-12-05',
    endDate: '2024-12-12',
    location: 'Faculty of Computing',
    totalVoters: 843,
    votedCount: 512,
    isRegistered: true,
    hasVoted: true
  }
}

interface ElectionPageProps {
  params: {
    id: string
  }
}

export default function ElectionPage({ params }: ElectionPageProps) {
  const election = mockElections[params.id as keyof typeof mockElections]

  if (!election) {
    notFound()
  }

  const participationRate = Math.round((election.votedCount / election.totalVoters) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/elections">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Elections
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{election.title}</h1>
          <p className="text-gray-600 mt-1">{election.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ElectionCard election={election} />
          
          {/* Additional Election Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{election.totalVoters.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Voters</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <Vote className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{election.votedCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Votes Cast</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{participationRate}%</div>
                  <div className="text-sm text-gray-600">Participation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {election.status === 'active' && election.isRegistered && !election.hasVoted && (
            <Link href={`/elections/${election.id}/vote`}>
              <Button size="lg" className="w-full">
                <Vote className="h-5 w-5 mr-2" />
                Vote Now
              </Button>
            </Link>
          )}
          
          {election.status === 'completed' && (
            <Link href={`/elections/results/${election.id}`}>
              <Button variant="outline" size="lg" className="w-full">
                View Results
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}