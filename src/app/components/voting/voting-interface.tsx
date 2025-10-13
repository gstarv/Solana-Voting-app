'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { CheckCircle, User, Shield, Clock, AlertCircle } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  position: string
  department: string
  bio: string
  image?: string
}

interface VotingInterfaceProps {
  election: {
    id: string
    title: string
    position: string
    candidates: Candidate[]
  }
  onVote: (candidateId: string) => Promise<void>
}

export function VotingInterface({ election, onVote }: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async () => {
    if (!selectedCandidate) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onVote(selectedCandidate)
      // Success handled by parent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cast vote')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Election Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{election.title}</h1>
              <p className="text-gray-600 mt-1">Position: {election.position}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
              Active Voting
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {election.candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCandidate === candidate.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <div className="flex items-start gap-4">
                {/* Candidate Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-gray-400" />
                </div>

                {/* Candidate Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    {selectedCandidate === candidate.id && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {candidate.department}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm">{candidate.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end flex-col sm:flex-row">
        <Button variant="outline" disabled={isSubmitting} className="sm:order-1 order-2">
          Cancel
        </Button>
        <Button 
          onClick={handleVote}
          disabled={!selectedCandidate || isSubmitting}
          className="min-w-32 sm:order-2 order-1"
        >
          {isSubmitting ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Vote'
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Secure Voting</h4>
              <p className="text-sm text-gray-600">
                Your vote is encrypted and recorded on the blockchain. 
                It cannot be traced back to you, but you can verify it was counted.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}