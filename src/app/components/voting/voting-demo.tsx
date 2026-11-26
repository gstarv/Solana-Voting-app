'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, LoaderCircle, Vote } from 'lucide-react'
import type { DemoElection } from '@/lib/voting/demo-data'

type DemoReceipt = {
  electionId: string
  candidateId: string
  candidateName: string
  receiptId: string
  createdAt: string
}

const STORAGE_KEY = 'votechain-demo-receipts'

function readReceipts(): DemoReceipt[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as DemoReceipt[]) : []
  } catch {
    return []
  }
}

export function VotingDemo() {
  const [elections, setElections] = useState<DemoElection[]>([])
  const [selectedElectionId, setSelectedElectionId] = useState('')
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [receipts, setReceipts] = useState<DemoReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setReceipts(readReceipts())
    fetch('/api/elections')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load demo elections.')
        return response.json()
      })
      .then((data: { elections: DemoElection[] }) => {
        setElections(data.elections)
        setSelectedElectionId(data.elections[0]?.id ?? '')
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load demo elections.'))
      .finally(() => setLoading(false))
  }, [])

  const election = elections.find((item) => item.id === selectedElectionId)
  const voted = receipts.some((receipt) => receipt.electionId === selectedElectionId)
  const voteCounts = useMemo(() => {
    return receipts
      .filter((receipt) => receipt.electionId === selectedElectionId)
      .reduce<Record<string, number>>((counts, receipt) => {
        counts[receipt.candidateId] = (counts[receipt.candidateId] ?? 0) + 1
        return counts
      }, {})
  }, [receipts, selectedElectionId])

  async function submitVote() {
    if (!election || !selectedCandidateId || voted || submitting) return
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electionId: election.id, candidateId: selectedCandidateId }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Demo vote could not be submitted.')

      const candidate = election.candidates.find((item) => item.id === selectedCandidateId)
      const receipt: DemoReceipt = {
        electionId: election.id,
        candidateId: selectedCandidateId,
        candidateName: candidate?.name ?? 'Selected candidate',
        receiptId: result.receiptId,
        createdAt: result.createdAt,
      }
      const updatedReceipts = [...readReceipts(), receipt]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReceipts))
      setReceipts(updatedReceipts)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Demo vote could not be submitted.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Demo mode:</strong> submissions are simulated by the Next.js API and saved only in this browser. No real vote is sent to Solana, and clearing browser storage resets this demo.
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-700"><Vote className="h-6 w-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Try the voting demo</h1>
            <p className="mt-1 text-gray-600">Choose a candidate and submit a simulated vote through the demo backend.</p>
          </div>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 py-8 text-gray-600"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading demo election…</p>
        ) : error && elections.length === 0 ? (
          <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
        ) : election ? (
          <>
            <label htmlFor="demo-election" className="mb-2 block text-sm font-medium text-gray-700">Election</label>
            <select
              id="demo-election"
              value={selectedElectionId}
              onChange={(event) => { setSelectedElectionId(event.target.value); setSelectedCandidateId(''); setError('') }}
              className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
            >
              {elections.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <div className="mb-5 rounded-lg bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">{election.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{election.description}</p>
              <p className="mt-2 text-xs text-gray-500">{election.location} · {election.status} · Ends {new Date(election.endDate).toLocaleDateString()}</p>
            </div>

            <h2 className="mb-3 text-lg font-semibold text-gray-900">Select one candidate</h2>
            <div className="space-y-3">
              {election.candidates.map((candidate) => {
                const selected = candidate.id === selectedCandidateId
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    disabled={voted || election.status !== 'active'}
                    aria-pressed={selected}
                    className={`w-full rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed ${selected ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300'} ${voted ? 'opacity-75' : ''}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        <span className="block font-semibold text-gray-900">{candidate.name}</span>
                        <span className="block text-sm text-gray-600">{candidate.position} · {candidate.department}</span>
                        <span className="mt-2 block text-sm text-gray-700">{candidate.manifesto}</span>
                      </span>
                      {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />}
                    </span>
                    <span className="mt-3 block text-xs text-gray-500">This browser’s demo votes: {voteCounts[candidate.id] ?? 0}</span>
                  </button>
                )
              })}
            </div>

            {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            {voted ? (
              <div role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
                <p className="font-semibold">Demo vote recorded for this browser.</p>
                {receipts.filter((receipt) => receipt.electionId === election.id).map((receipt) => (
                  <p key={receipt.receiptId} className="mt-1 break-all text-sm">Choice: {receipt.candidateName} · Demo receipt: {receipt.receiptId}</p>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={submitVote}
                disabled={!selectedCandidateId || submitting || election.status !== 'active'}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {submitting ? 'Submitting demo vote…' : election.status === 'active' ? 'Submit demo vote' : 'Election is not open'}
              </button>
            )}
          </>
        ) : (
          <p className="py-8 text-gray-600">No demo elections are available.</p>
        )}
      </section>
    </main>
  )
}
