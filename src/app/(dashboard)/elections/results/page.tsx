import { ElectionList } from '@/components/elections/election-list'

// Mock completed elections
const completedElections = [
  {
    id: '3',
    title: 'Library Committee Elections 2024',
    description: 'Election for library committee student representatives',
    type: 'university' as const,
    status: 'completed' as const,
    startDate: '2024-11-01',
    endDate: '2024-11-08',
    location: 'University-wide',
    totalVoters: 8567,
    votedCount: 5234,
    isRegistered: true,
    hasVoted: true
  },
  {
    id: '4', 
    title: 'Sports Committee Elections 2024',
    description: 'Selection of sports committee members',
    type: 'university' as const,
    status: 'completed' as const,
    startDate: '2024-10-15',
    endDate: '2024-10-22',
    location: 'University-wide', 
    totalVoters: 7890,
    votedCount: 4567,
    isRegistered: true,
    hasVoted: false
  }
]

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Election Results</h1>
        <p className="text-gray-600 mt-2">View results from completed elections</p>
      </div>
      
      <ElectionList />
    </div>
  )
}