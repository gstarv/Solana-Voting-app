'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Notification = {
  id: string
  kind: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  read_at: string | null
  created_at: string
  election_id: string | null
}

const kindStyles: Record<Notification['kind'], string> = {
  info: 'border-sky-200 bg-sky-50',
  warning: 'border-amber-200 bg-amber-50',
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-rose-200 bg-rose-50',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/notifications')
      .then(async (response) => {
        const body = await response.json()
        if (response.status === 401) {
          window.location.assign('/auth')
          return
        }
        if (!response.ok) throw new Error(body.error ?? 'Could not load notifications.')
        setNotifications(body.notifications ?? [])
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load notifications.'))
      .finally(() => setLoading(false))
  }, [])

  async function markAsRead(id: string) {
    setError('')
    const response = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const body = await response.json()
    if (!response.ok) {
      setError(body.error ?? 'Could not update notification.')
      return
    }
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item))
  }

  const unreadCount = notifications.filter((item) => !item.read_at).length

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/settings" className="text-sm font-medium text-indigo-700 underline">Back to account settings</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-700">ACCOUNT</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Notifications</h1>
        </div>
        <span className="text-sm text-slate-600" aria-live="polite">{unreadCount} unread</span>
      </div>
      {error && <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {loading ? <p className="mt-8 text-slate-600" aria-live="polite">Loading notifications…</p> : notifications.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-semibold">You’re all caught up</h2>
          <p className="mt-2 text-sm text-slate-600">Notifications for your account will appear here.</p>
        </section>
      ) : (
        <ul className="mt-6 space-y-3">
          {notifications.map((notification) => (
            <li key={notification.id} className={`rounded-xl border p-4 ${kindStyles[notification.kind] ?? kindStyles.info}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!notification.read_at && <span className="h-2 w-2 rounded-full bg-indigo-600" aria-label="Unread" />}
                    <h2 className="font-semibold">{notification.title}</h2>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{notification.message}</p>
                  <time className="mt-2 block text-xs text-slate-500" dateTime={notification.created_at}>
                    {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.created_at))}
                  </time>
                </div>
                {!notification.read_at && <button type="button" onClick={() => void markAsRead(notification.id)} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Mark as read</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
