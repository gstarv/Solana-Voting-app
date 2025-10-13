import { notFound } from 'next/navigation'
import { ResultsChart } from '@/components/elections/result-chart'
import { RealTimeUpdates } from '@/components/elections/real-time-updates'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

// Mock results data
const mockResults = {
  '1': [{
    position: 'Student Union President',
    candidates: [
      { name: 'John Doe', votes: 345, percentage: 45, color: '#0088FE' },
      { name: 'Jane Smith', votes: 289, percentage: 38, color: '#00C49F' },
      { name: 'Mike Johnson', votes: 156, percentage: 17, color: '#FFBB28' },
    ],
    totalVotes: 790,
    participationRate: 67
  }],
  '2': [{
    position: 'Faculty Computing Representative',
    candidates: [
      { name: 'Alice Brown', votes: 245, percentage: 58, color: '#0088FE' },
      { name: 'Bob Wilson', votes: 178, percentage: 42, color: '#00C49F' },
    ],
    totalVotes: 423,
    participationRate: 72
  }]
}

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default function ElectionResultsPage({ params }: ResultsPageProps) {
  const results = mockResults[params.id as keyof typeof mockResults]

  if (!results) {
    notFound()
  }

  const electionTitle = params.id === '1' 
    ? 'Student Union Elections 2024' 
    : 'Faculty Computing Representative'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/elections/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Election
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{electionTitle} - Results</h1>
            <p className="text-gray-600 mt-1">Live election results and statistics</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          <ResultsChart results={results} chartType="bar" />
        </div>

        {/* Live Updates */}
        <div className="space-y-6">
          <RealTimeUpdates electionId={params.id} updateInterval={10000} />
        </div>
      </div>
    </div>
  )
}