'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { CandidateCard } from './candidate-card'
import { Vote, Shield, Clock, AlertCircle } from 'lucide-react'

interface Position {
  id: string
  title: string
  description: string
  candidates: Array<{
    id: string
    name: string
    position: string
    department: string
    votes: number
    isLeading: boolean
    manifesto: string
  }>
}

interface VotingInterfaceProps {
  election: {
    id: string
    title: string
    positions: Position[]
    timeRemaining: string
  }
  onVoteSubmit: (votes: Record<string, string>) => void
}

export function VotingInterface({ election, onVoteSubmit }: VotingInterfaceProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({})
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)

  const currentPosition = election.positions[currentPositionIndex]
  const isLastPosition = currentPositionIndex === election.positions.length - 1
  const allPositionsVoted = election.positions.every(position => selectedCandidates[position.id])

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [currentPosition.id]: candidateId
    }))
  }

  const handleNext = () => {
    if (!isLastPosition) {
      setCurrentPositionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    if (allPositionsVoted) {
      onVoteSubmit(selectedCandidates)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Election Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription>Cast your vote securely</CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {election.timeRemaining}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Position {currentPositionIndex + 1} of {election.positions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentPositionIndex + 1) / election.positions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPositionIndex + 1) / election.positions.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Position */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentPosition.title}</CardTitle>
          <CardDescription>{currentPosition.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPosition.candidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={selectedCandidates[currentPosition.id] === candidate.id}
                onSelect={handleCandidateSelect}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Your vote is secure and anonymous</p>
            <p className="text-blue-600">
              Once submitted, your vote cannot be changed. All votes are encrypted and stored on the blockchain.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPositionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center gap-4">
          {!allPositionsVoted && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="h-4 w-4" />
              Complete all positions to submit
            </div>
          )}
          
          {isLastPosition ? (
            <Button 
              onClick={handleSubmit}
              disabled={!allPositionsVoted}
              className="flex items-center gap-2"
            >
              <Vote className="h-4 w-4" />
              Submit Vote
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!selectedCandidates[currentPosition.id]}
            >
              Next Position
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}