export interface Election {
  id: string
  title: string
  description: string
  type: 'university' | 'faculty' | 'department'
  status: 'active' | 'upcoming' | 'completed'
  startDate: string
  endDate: string
  location: string
  totalVoters: number
  votedCount: number
  isRegistered: boolean
  hasVoted: boolean
  candidates: Candidate[]
  rules: string[]
  positions: ElectionPosition[]
}

export interface Candidate {
  id: string
  name: string
  position: string
  department: string
  bio: string
  image?: string
  votes: number
}

export interface ElectionPosition {
  title: string
  candidates: number
  description?: string
}

export interface Vote {
  electionId: string
  candidateId: string
  timestamp: string
  transactionHash: string
  verified: boolean
  blockHeight: number
}