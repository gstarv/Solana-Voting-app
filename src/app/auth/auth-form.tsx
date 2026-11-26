'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const supabase = createClient()
      const result = mode === 'sign-up'
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
        : await supabase.auth.signInWithPassword({ email, password })
      if (result.error) throw result.error
      if (mode === 'sign-up' && !result.data.session) {
        setMessage('Check your email to confirm your account, then return here to sign in.')
      } else {
        router.push('/settings')
        router.refresh()
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-indigo-700">CAMPUS BALLOT</p>
        <h1 className="mt-2 text-2xl font-semibold">{mode === 'sign-in' ? 'Sign in' : 'Create your account'}</h1>
        <p className="mt-2 text-sm text-slate-600">Use your email and password to manage your account and preferences.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5" /></div>
          <div><label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label><input id="password" type="password" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5" /></div>
          <button disabled={busy} className="w-full rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
        </form>
        {message && <p role="status" className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}
        <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setMessage('') }} className="mt-4 text-sm font-medium text-indigo-700 underline">{mode === 'sign-in' ? 'New here? Create an account' : 'Already registered? Sign in'}</button>
        <p className="mt-6 text-sm"><Link href="/" className="text-slate-600 underline">Back to home</Link></p>
      </section>
    </main>
  )
}
