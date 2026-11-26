import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

    const [{ data: profile, error: profileError }, { data: preferences, error: preferencesError }] = await Promise.all([
      supabase.from('profiles').select('display_name, timezone').eq('id', user.id).maybeSingle(),
      supabase.from('notification_preferences').select('email_enabled, in_app_enabled, election_reminders, vote_updates').eq('user_id', user.id).maybeSingle(),
    ])
    if (profileError || preferencesError) return NextResponse.json({ error: 'Could not load settings. Apply the Supabase migration first.' }, { status: 500 })

    return NextResponse.json({
      email: user.email ?? null,
      displayName: profile?.display_name ?? '',
      timezone: profile?.timezone ?? 'UTC',
      notifications: preferences ?? { email_enabled: false, in_app_enabled: true, election_reminders: true, vote_updates: true },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase is not configured.'
    return NextResponse.json({ error: message }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'A JSON settings object is required.' }, { status: 400 })
  }

  const input = body as Record<string, unknown>
  const allowed = ['displayName', 'timezone', 'notifications']
  if (Object.keys(input).some((key) => !allowed.includes(key))) return NextResponse.json({ error: 'Unknown settings field.' }, { status: 400 })
  if ('displayName' in input && (typeof input.displayName !== 'string' || input.displayName.length > 80)) return NextResponse.json({ error: 'displayName must be 80 characters or fewer.' }, { status: 400 })
  if ('timezone' in input && typeof input.timezone !== 'string') return NextResponse.json({ error: 'timezone must be a string.' }, { status: 400 })
  if ('timezone' in input && typeof input.timezone === 'string') {
    try { Intl.DateTimeFormat(undefined, { timeZone: input.timezone }) } catch { return NextResponse.json({ error: 'timezone must be a valid IANA timezone.' }, { status: 400 }) }
  }

  const flags = ['email_enabled', 'in_app_enabled', 'election_reminders', 'vote_updates'] as const
  if ('notifications' in input) {
    if (!input.notifications || typeof input.notifications !== 'object' || Array.isArray(input.notifications)) return NextResponse.json({ error: 'notifications must be an object.' }, { status: 400 })
    const notificationInput = input.notifications as Record<string, unknown>
    if (Object.keys(notificationInput).some((key) => !(flags as readonly string[]).includes(key)) || Object.values(notificationInput).some((value) => typeof value !== 'boolean')) return NextResponse.json({ error: 'Notification settings must contain only boolean preference fields.' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

    if ('displayName' in input || 'timezone' in input) {
      const profile: Record<string, string> = { id: user.id }
      if (typeof input.displayName === 'string') profile.display_name = input.displayName.trim()
      if (typeof input.timezone === 'string') profile.timezone = input.timezone
      const { error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' })
      if (error) return NextResponse.json({ error: 'Could not save profile settings.' }, { status: 500 })
    }

    if ('notifications' in input) {
      const notificationInput = input.notifications as Record<string, boolean>
      const preferences = Object.fromEntries(Object.entries(notificationInput).map(([key, value]) => [key, value]))
      const { data: current } = await supabase.from('notification_preferences').select('email_enabled, in_app_enabled, election_reminders, vote_updates').eq('user_id', user.id).maybeSingle()
      const { error } = await supabase.from('notification_preferences').upsert({
        user_id: user.id,
        email_enabled: current?.email_enabled ?? false,
        in_app_enabled: current?.in_app_enabled ?? true,
        election_reminders: current?.election_reminders ?? true,
        vote_updates: current?.vote_updates ?? true,
        ...preferences,
      }, { onConflict: 'user_id' })
      if (error) return NextResponse.json({ error: 'Could not save notification preferences.' }, { status: 500 })
    }

    return NextResponse.json({ saved: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase is not configured.'
    return NextResponse.json({ error: message }, { status: 503 })
  }
}
