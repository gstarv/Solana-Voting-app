import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body.electionId !== 'string' || typeof body.candidateId !== 'string') {
    return NextResponse.json({ error: 'electionId and candidateId are required' }, { status: 400 })
  }

  if (!process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID) {
    return NextResponse.json(
      { error: 'Voting is not configured yet. Add NEXT_PUBLIC_VOTING_PROGRAM_ID to enable the on-chain program.' },
      { status: 503 },
    )
  }

  return NextResponse.json({
    error: 'On-chain vote submission is not enabled until the program is deployed and configured.',
  }, { status: 503 })
}
