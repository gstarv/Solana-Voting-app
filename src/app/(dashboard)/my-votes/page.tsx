'use client'

import { VoteHistory } from '@/components/voting/vote-history'
import { VoteVerification } from '@/components/voting/vote-verification'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, CheckCircle2 } from 'lucide-react'

// Mock vote history
const mockVotes = [
  {
    id: '1',
    electionId: '1',
    electionTitle: 'Student Union Elections 2024',
    electionType: 'University-wide',
    timestamp: new Date('2024-12-10T14:30:00'),
    status: 'confirmed' as const,
    transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    selectedOptions: [{ id: '1', name: 'John Doe' }],
    canVerify: true
  },
  {
    id: '2',
    electionId: '3', 
    electionTitle: 'Library Committee Elections 2024',
    electionType: 'University-wide',
    timestamp: new Date('2024-11-05T09:15:00'),
    status: 'confirmed' as const,
    transactionHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1',
    selectedOptions: [{ id: '2', name: 'Sarah Wilson' }],
    canVerify: true
  }
]

export default function MyVotesPage() {
  const handleViewDetails = (voteId: string) => {
    console.log('View details for vote:', voteId)
    // Navigate to vote details page
  }

  const handleVerifyVote = async (txHash: string) => {
    // Mock verification - replace with actual blockchain verification
    console.log('Verifying transaction:', txHash)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      isValid: true,
      voteDetails: {
        electionTitle: 'Student Union Elections 2024',
        timestamp: new Date('2024-12-10T14:30:00'),
        selectedOptions: ['John Doe'],
        blockNumber: 1234567,
        voterId: 'anon_7f3e9a2b'
      }
    }
  }

  const handleDownloadReceipt = (voteId: string) => {
    console.log('Download receipt for vote:', voteId)
    // Implement receipt download
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Votes</h1>
        <p className="text-gray-600 mt-2">View your voting history and verify your votes</p>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Vote History
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Verify Vote
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <VoteHistory 
            votes={mockVotes}
            onViewDetails={handleViewDetails}
            onVerifyVote={(voteId) => {
              const vote = mockVotes.find(v => v.id === voteId)
              if (vote?.transactionHash) {
                handleVerifyVote(vote.transactionHash)
              }
            }}
            onDownloadReceipt={handleDownloadReceipt}
          />
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <VoteVerification onVerifyTransaction={handleVerifyVote} />
        </TabsContent>
      </Tabs>
    </div>
  )
}