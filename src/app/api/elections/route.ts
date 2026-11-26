import { NextResponse } from 'next/server'
import { getConfiguredNetwork, getDemoElections } from '@/lib/voting/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    elections: getDemoElections(),
    network: getConfiguredNetwork(),
  })
}
