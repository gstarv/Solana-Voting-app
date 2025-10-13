'use client'

import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { User, Vote, Award, CheckCircle } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  position: string
  department: string
  image?: string
  votes: number
  isLeading: boolean
  isSelected?: boolean
  manifesto: string
}

interface CandidateCardProps {
  candidate: Candidate
  onSelect?: (candidateId: string) => void
  selected?: boolean
  showResults?: boolean
  totalVotes?: number
}

export function CandidateCard({ 
  candidate, 
  onSelect, 
  selected = false, 
  showResults = false,
  totalVotes = 1 
}: CandidateCardProps) {
  const votePercentage = totalVotes > 0
    ? Math.round((candidate.votes / totalVotes) * 100)
    : 0

  // Optional: Expand manifesto toggle
  // const [expanded, setExpanded] = useState(false)

  return (
    <Card className={`border-2 transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
      <CardContent className="p-4">
        {/* Candidate Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              {candidate.image ? (
                <img 
                  src={candidate.image} 
                  alt={candidate.name || 'Candidate photo'}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.position}</p>
              <p className="text-xs text-gray-500">{candidate.department}</p>
            </div>
          </div>
          
          {/* Status Badges */}
          <div className="flex flex-col items-end gap-1">
            {candidate.isLeading && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Award className="h-3 w-3 mr-1" />
                Leading
              </Badge>
            )}
            {selected && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </div>
        </div>

        {/* Manifesto */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {candidate.manifesto}
        </p>

        {/* Optional: Expand manifesto */}
        {/* {candidate.manifesto.length > 100 && (
          <Button variant="link" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'Read more'}
          </Button>
        )} */}

        {/* Results or Action */}
        {showResults ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Vote className="h-4 w-4" />
                {candidate.votes.toLocaleString()} votes
              </span>
              <span className="font-semibold">{votePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${votePercentage}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant={selected ? "default" : "outline"}
              className="flex-1"
              onClick={() => onSelect?.(candidate.id)}
              aria-pressed={selected}
            >
              {selected ? 'Selected' : 'Select Candidate'}
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
