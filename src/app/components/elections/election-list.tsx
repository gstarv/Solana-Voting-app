'use client'

import { useState } from 'react'
import { ElectionCard } from './election-card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search } from 'lucide-react'
import { EmptyState } from '../shared/empty-state'

// ✅ ADD THIS INTERFACE
interface ElectionListProps {
  onVoteNow?: (electionId: string) => void
  onViewResults?: (electionId: string) => void
}

const mockElections = [
  {
    id: '1',
    title: 'Student Union Elections 2024',
    description: 'Annual elections for student union leadership positions',
    type: 'university',
    status: 'active',
    startDate: '2024-12-10',
    endDate: '2024-12-15',
    location: 'University-wide',
    totalVoters: 12458,
    votedCount: 4892,
    isRegistered: true,
    hasVoted: false
  },
  {
    id: '2',
    title: 'Faculty Computing Representative',
    description: 'Election for faculty representative position',
    type: 'faculty',
    status: 'active',
    startDate: '2024-12-05',
    endDate: '2024-12-12',
    location: 'Faculty of Computing',
    totalVoters: 843,
    votedCount: 512,
    isRegistered: true,
    hasVoted: true
  }
] as const

const electionTypes = ['all', 'university', 'faculty', 'department'] as const
type ElectionType = typeof electionTypes[number]

// ✅ UPDATE FUNCTION SIGNATURE TO ACCEPT PROPS
export function ElectionList({ onVoteNow, onViewResults }: ElectionListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<ElectionType>('all')
  const [sortBy, setSortBy] = useState<'startDate' | 'endDate' | 'voterCount'>('startDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredElections = mockElections
    .filter(election => {
      const matchesSearch =
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filter === 'all' || election.type === filter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let result = 0
      if (sortBy === 'startDate') {
        result = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      } else if (sortBy === 'endDate') {
        result = new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      } else if (sortBy === 'voterCount') {
        result = a.totalVoters - b.totalVoters
      }
      return sortDirection === 'asc' ? result : -result
    })

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search elections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-2">
        {electionTypes.map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            onClick={() => setFilter(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}

        {['startDate', 'endDate', 'voterCount'].map((key) => (
          <Button
            key={key}
            variant={sortBy === key ? 'default' : 'outline'}
            onClick={() => setSortBy(key as typeof sortBy)}
          >
            {key === 'startDate' && 'Start Date'}
            {key === 'endDate' && 'End Date'}
            {key === 'voterCount' && 'Voter Count'}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDirection === 'asc' ? 'Asc' : 'Desc'}
        </Button>
      </div>

      {/* Elections Grid */}
      {filteredElections.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredElections.map((election) => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No elections found"
          description="Try adjusting your search or filter criteria"
          action={{
            label: 'Clear filters',
            onClick: () => {
              setSearchTerm('')
              setFilter('all')
            }
          }}
        />
      )}
    </div>
  )
}