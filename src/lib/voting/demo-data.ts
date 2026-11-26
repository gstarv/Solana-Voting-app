export type ElectionStatus = 'active' | 'upcoming' | 'completed'

export type DemoCandidate = {
  id: string
  name: string
  position: string
  department: string
  manifesto: string
  /** Optional public portrait URL. Use an approved, stable image source. */
  photoUrl?: string
  /** Demo-only result value; never treat as an on-chain count. */
  demoVoteCount?: number
}

export type DemoElection = {
  id: string
  title: string
  description: string
  status: ElectionStatus
  startDate: string
  endDate: string
  location: string
  eligibility: string
  /** Example turnout only; the current program does not expose aggregate turnout. */
  demoTurnoutPercent?: number
  candidates: DemoCandidate[]
}

export const DEMO_ELECTIONS: DemoElection[] = [
  {
    id: 'student-union-2026',
    title: 'Student Union Elections 2026',
    description: 'Annual election for student union leadership positions.',
    status: 'active',
    startDate: '2026-11-20T08:00:00Z',
    endDate: '2026-12-10T20:00:00Z',
    location: 'University-wide',
    eligibility: 'Currently enrolled students',
    candidates: [
      {
        id: 'candidate-john-smith',
        name: 'John Smith',
        position: 'President',
        department: 'Computer Science',
        manifesto: 'Improve student facilities and mental health support.',
      },
      {
        id: 'candidate-sarah-johnson',
        name: 'Sarah Johnson',
        position: 'President',
        department: 'Business Administration',
        manifesto: 'Expand career services and industry partnerships.',
      },
    ],
  },
  {
    id: 'engineering-council-2027',
    title: 'Engineering Council 2027',
    description: 'Choose representatives for the engineering student council.',
    status: 'upcoming',
    startDate: '2027-01-15T09:00:00Z',
    endDate: '2027-01-22T20:00:00Z',
    location: 'School of Engineering',
    eligibility: 'Enrolled School of Engineering students',
    candidates: [
      {
        id: 'candidate-maya-chen',
        name: 'Maya Chen',
        position: 'Council Chair',
        department: 'Mechanical Engineering',
        manifesto: 'Create more peer mentoring and hands-on project opportunities.',
      },
      {
        id: 'candidate-noah-patel',
        name: 'Noah Patel',
        position: 'Council Chair',
        department: 'Electrical Engineering',
        manifesto: 'Make student feedback part of every department planning cycle.',
      },
      {
        id: 'candidate-ava-robinson',
        name: 'Ava Robinson',
        position: 'Council Chair',
        department: 'Civil Engineering',
        manifesto: 'Expand access to labs, equipment, and industry placements.',
      },
    ],
  },
  {
    id: 'campus-sustainability-2026',
    title: 'Campus Sustainability Representative 2026',
    description: 'A completed demo election for the campus sustainability representative.',
    status: 'completed',
    startDate: '2026-09-10T08:00:00Z',
    endDate: '2026-09-17T20:00:00Z',
    location: 'University-wide',
    eligibility: 'Currently enrolled students',
    demoTurnoutPercent: 64,
    candidates: [
      {
        id: 'candidate-olivia-green',
        name: 'Olivia Green',
        position: 'Sustainability Representative',
        department: 'Environmental Science',
        manifesto: 'Improve campus recycling and publish annual sustainability goals.',
        demoVoteCount: 128,
      },
      {
        id: 'candidate-ethan-brooks',
        name: 'Ethan Brooks',
        position: 'Sustainability Representative',
        department: 'Urban Planning',
        manifesto: 'Make campus transport greener, safer, and more affordable.',
        demoVoteCount: 97,
      },
    ],
  },
]
