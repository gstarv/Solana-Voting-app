export interface User {
  id: string
  studentId: string
  name: string
  email: string
  department: string
  faculty: string
  level: string
  institution: string
  walletAddress?: string
  emailVerified: boolean
  studentVerified: boolean
  avatar?: string
  createdAt: string
  lastLogin: string
}

export interface UserStats {
  totalElections: number
  votedCount: number
  activeElections: number
  upcomingElections: number
  participationRate: number
  votingStreak: number
  firstVote: string
}