import { NextResponse } from 'next/server'
import { DEMO_ELECTIONS } from '@/lib/voting/demo-data'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || !('electionId' in body) || !('candidateId' in body) || typeof body.electionId !== 'string' || typeof body.candidateId !== 'string') {
    return NextResponse.json({ error: 'electionId and candidateId are required' }, { status: 400 })
  }

  const election = DEMO_ELECTIONS.find((item) => item.id === body.electionId)
  if (!election) return NextResponse.json({ error: 'Election not found' }, { status: 404 })
  if (election.status !== 'active') return NextResponse.json({ error: 'This demo election is not open' }, { status: 409 })
  if (!election.candidates.some((candidate) => candidate.id === body.candidateId)) {
    return NextResponse.json({ error: 'Candidate does not belong to this election' }, { status: 400 })
  }

  return NextResponse.json({
    mode: 'demo',
    message: 'Simulated vote accepted. This is not a blockchain transaction.',
    receiptId: `demo-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  }, { status: 201 })
}
