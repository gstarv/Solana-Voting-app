import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

    const { data, error } = await supabase
      .from('notifications')
      .select('id, kind, title, message, read_at, created_at, election_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return NextResponse.json({ error: 'Could not load notifications. Apply the Supabase migration first.' }, { status: 500 })
    return NextResponse.json({ notifications: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase is not configured.'
    return NextResponse.json({ error: message }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body) || !('id' in body) || typeof body.id !== 'string' || body.id.length > 64) {
    return NextResponse.json({ error: 'A notification id is required.' }, { status: 400 })
  }
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', body.id).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: 'Could not update notification.' }, { status: 500 })
    return NextResponse.json({ saved: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase is not configured.'
    return NextResponse.json({ error: message }, { status: 503 })
  }
}
