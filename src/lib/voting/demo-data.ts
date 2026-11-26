export type DemoElection = {
  id: string
  title: string
  description: string
  status: 'active' | 'upcoming' | 'completed'
  startDate: string
  endDate: string
  location: string
  candidates: Array<{
    id: string
    name: string
    position: string
    department: string
    manifesto: string
  }>
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
]
