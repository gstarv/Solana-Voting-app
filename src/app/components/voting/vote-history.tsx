'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { EmptyState } from '../shared/empty-state'
import { Calendar, FileText, Eye, Download, CheckCircle2, Clock, XCircle } from 'lucide-react'

interface VoteHistoryItem {
  id: string
  electionId: string
  electionTitle: string
  electionType: string
  timestamp: Date
  status: 'confirmed' | 'pending' | 'failed'
  transactionHash?: string
  selectedOptions: Array<{
    id: string
    name: string
  }>
  canVerify: boolean
}

interface VoteHistoryProps {
  votes: VoteHistoryItem[]
  onViewDetails: (voteId: string) => void
  onVerifyVote: (voteId: string) => void
  onDownloadReceipt: (voteId: string) => void
}

export function VoteHistory({ 
  votes, 
  onViewDetails, 
  onVerifyVote, 
  onDownloadReceipt 
}: VoteHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  if (votes.length === 0) {
    return (
      <EmptyState
        title="No Vote History"
        description="You haven't cast any votes yet. Participate in ongoing elections to see your voting history here."
        icon={<FileText className="h-12 w-12 text-gray-400" />}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{votes.length}</div>
            <p className="text-sm text-gray-600">Total Votes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {votes.filter(v => v.status === 'confirmed').length}
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {votes.filter(v => v.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {votes.filter(v => v.canVerify).length}
            </div>
            <p className="text-sm text-gray-600">Verifiable</p>
          </CardContent>
        </Card>
      </div>

      {/* Votes List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Voting History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {votes.map((vote) => (
              <Card key={vote.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{vote.electionTitle}</h3>
                        <Badge variant="outline" className={getStatusColor(vote.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(vote.status)}
                            {vote.status.toUpperCase()}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(vote.timestamp)}
                        </span>
                        <span>{vote.electionType}</span>
                      </div>

                      {/* Selected Options */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Your Selection:</p>
                        <div className="flex flex-wrap gap-2">
                          {vote.selectedOptions.map(option => (
                            <Badge key={option.id} variant="secondary" className="bg-blue-100 text-blue-800">
                              {option.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Transaction Hash */}
                      {vote.transactionHash && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Transaction:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {truncateHash(vote.transactionHash)}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(vote.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    
                    {vote.canVerify && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVerifyVote(vote.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Verify Vote
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadReceipt(vote.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}