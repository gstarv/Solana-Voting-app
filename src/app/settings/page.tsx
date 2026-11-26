'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Settings = { email: string | null; displayName: string; timezone: string; notifications: { email_enabled: boolean; in_app_enabled: boolean; election_reminders: boolean; vote_updates: boolean } }
const defaults: Settings = { email: null, displayName: '', timezone: 'UTC', notifications: { email_enabled: false, in_app_enabled: true, election_reminders: true, vote_updates: true } }

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(async (response) => {
      if (response.status === 401) { window.location.assign('/auth'); return }
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setSettings(data)
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Could not load settings.')).finally(() => setLoading(false))
  }, [])

  async function save() {
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName: settings.displayName, timezone: settings.timezone, notifications: settings.notifications }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setMessage('Settings saved.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save settings.') }
    finally { setBusy(false) }
  }

  async function signOut() {
    await createClient().auth.signOut()
    window.location.assign('/auth')
  }

  if (loading) return <main className="mx-auto max-w-2xl p-8" aria-live="polite">Loading settings…</main>
  const toggle = (key: keyof Settings['notifications'], label: string) => <label className="flex items-center justify-between gap-4 py-3"><span className="text-sm">{label}</span><input type="checkbox" checked={settings.notifications[key]} onChange={(event) => setSettings({ ...settings, notifications: { ...settings.notifications, [key]: event.target.checked } })} className="h-4 w-4 accent-indigo-600" /></label>

  return <main className="mx-auto max-w-2xl px-4 py-10"><div className="flex items-center justify-between"><div><Link href="/" className="text-sm text-indigo-700 underline">Home</Link><h1 className="mt-3 text-3xl font-semibold">Account settings</h1></div><button onClick={signOut} className="rounded-lg border px-3 py-2 text-sm">Sign out</button></div>
    <section className="mt-6 rounded-2xl border bg-white p-5 sm:p-7"><p className="text-sm text-slate-600">Signed in as {settings.email ?? 'account'}</p><label className="mt-5 block text-sm font-medium">Display name<input value={settings.displayName} maxLength={80} onChange={(event) => setSettings({ ...settings, displayName: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="mt-4 block text-sm font-medium">Timezone<input value={settings.timezone} onChange={(event) => setSettings({ ...settings, timezone: event.target.value })} placeholder="America/New_York" className="mt-1 w-full rounded-lg border px-3 py-2.5" /><span className="mt-1 block text-xs text-slate-500">Use an IANA timezone, for example America/New_York.</span></label>
      <h2 className="mt-8 border-b pb-2 text-lg font-semibold">Notifications</h2>{toggle('in_app_enabled', 'In-app notifications')}{toggle('email_enabled', 'Email notifications (requires a delivery provider)')}{toggle('election_reminders', 'Election reminders')}{toggle('vote_updates', 'Vote transaction updates')}
      <button onClick={save} disabled={busy} className="mt-5 rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Saving…' : 'Save settings'}</button>{message && <p role="status" className="mt-4 text-sm">{message}</p>}
    </section></main>
}
