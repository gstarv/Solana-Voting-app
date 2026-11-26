'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  LoaderCircle,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Vote,
  WalletCards,
} from 'lucide-react'
import type { DemoElection } from '@/lib/voting/demo-data'
import { WalletConnector } from '@/app/components/blockchain/wallet-connector'
import {
  deriveElectionAddress,
  makeCastVoteInstruction,
  makeInitializeElectionInstruction,
  VOTING_AUTHORITY,
  VOTING_PROGRAM_ID,
} from '@/lib/voting/solana-voting'

type ChainState = { programAvailable: boolean; electionInitialized: boolean; alreadyVoted: boolean }
type SubmissionResult = { candidateName: string; signature: string; initialized: boolean }

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
const shortAddress = (address: string) => `${address.slice(0, 4)}…${address.slice(-4)}`

export function VotingDemo() {
  const { connection } = useConnection()
  const { connected, publicKey, sendTransaction } = useWallet()
  const [elections, setElections] = useState<DemoElection[]>([])
  const [selectedElectionId, setSelectedElectionId] = useState('')
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [chainState, setChainState] = useState<ChainState>({ programAvailable: false, electionInitialized: false, alreadyVoted: false })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    fetch('/api/elections')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load elections.')
        return response.json() as Promise<{ elections: DemoElection[] }>
      })
      .then(({ elections: loaded }) => {
        setElections(loaded)
        setSelectedElectionId(loaded[0]?.id ?? '')
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load elections.'))
      .finally(() => setLoading(false))
  }, [])

  const election = elections.find((item) => item.id === selectedElectionId)
  const electionAddress = useMemo(() => election ? deriveElectionAddress(election.id) : null, [election])
  const isAuthority = Boolean(publicKey?.equals(VOTING_AUTHORITY))
  const selectedCandidate = election?.candidates.find((candidate) => candidate.id === selectedCandidateId)
  const explorerUrl = result ? `https://explorer.solana.com/tx/${result.signature}?cluster=devnet` : null

  const refreshChainState = useCallback(async () => {
    if (!electionAddress) return
    try {
      const [programInfo, electionInfo] = await Promise.all([
        connection.getAccountInfo(VOTING_PROGRAM_ID, 'confirmed'),
        connection.getAccountInfo(electionAddress, 'confirmed'),
      ])
      const programAvailable = Boolean(programInfo?.executable)
      const electionInitialized = Boolean(electionInfo?.owner.equals(VOTING_PROGRAM_ID))
      let alreadyVoted = false
      if (publicKey && electionInitialized) {
        const [receiptAddress] = PublicKey.findProgramAddressSync(
          [new TextEncoder().encode('receipt'), electionAddress.toBuffer(), publicKey.toBuffer()],
          VOTING_PROGRAM_ID,
        )
        const receiptInfo = await connection.getAccountInfo(receiptAddress, 'confirmed')
        alreadyVoted = Boolean(receiptInfo?.owner.equals(VOTING_PROGRAM_ID))
      }
      setChainState({ programAvailable, electionInitialized, alreadyVoted })
      if (!programAvailable) setError('Voting program not found on the configured Solana network.')
      else if (electionInfo && !electionInitialized) setError('Election address is occupied by an unexpected account.')
      else setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read election state from Solana.')
    }
  }, [connection, electionAddress, publicKey])

  useEffect(() => { void refreshChainState() }, [refreshChainState])

  async function sendAndConfirm(transaction: Transaction) {
    if (!publicKey) throw new Error('Connect a Solana wallet first.')
    const latest = await connection.getLatestBlockhash('confirmed')
    transaction.feePayer = publicKey
    transaction.recentBlockhash = latest.blockhash
    const signature = await sendTransaction(transaction, connection, { preflightCommitment: 'confirmed' })
    const confirmation = await connection.confirmTransaction({ signature, ...latest }, 'confirmed')
    if (confirmation.value.err) throw new Error('Solana transaction failed to confirm.')
    return signature
  }

  async function initializeElection() {
    if (!election || !publicKey || !isAuthority || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const { instruction } = await makeInitializeElectionInstruction(election.id, election.candidates.length, publicKey)
      const signature = await sendAndConfirm(new Transaction().add(instruction))
      setResult({ candidateName: 'Election initialized', signature, initialized: true })
      await refreshChainState()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not initialize election.')
    } finally { setSubmitting(false) }
  }

  async function submitVote() {
    if (!election || !electionAddress || !publicKey || !selectedCandidateId || submitting) return
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const candidateIndex = election.candidates.findIndex((candidate) => candidate.id === selectedCandidateId)
      if (candidateIndex < 0) throw new Error('Select a valid candidate.')
      const { instruction } = await makeCastVoteInstruction(electionAddress, publicKey, candidateIndex)
      const signature = await sendAndConfirm(new Transaction().add(instruction))
      setResult({ candidateName: election.candidates[candidateIndex].name, signature, initialized: false })
      await refreshChainState()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not submit vote to Solana.')
    } finally { setSubmitting(false) }
  }

  const statusLabel = election?.status === 'active' ? 'Voting is live' : election?.status === 'upcoming' ? 'Coming soon' : 'Voting closed'
  const endDate = election ? dateFormatter.format(new Date(election.endDate)) : ''

  return (
    <main className="min-h-screen bg-[#f7f8fc] pb-16 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"><span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white"><Vote className="h-4 w-4" /></span>Campus ballot</Link>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />Solana Devnet</div>
        </div>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white shadow-xl shadow-slate-900/10 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100"><Sparkles className="h-3.5 w-3.5" />Your voice, on chain</div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Student elections · 2026</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Make your choice<br className="hidden sm:block" /> count.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Review the candidates, connect your wallet, and cast your ballot securely on Solana Devnet.</p>
            </div>
            <div className="relative rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:min-w-64">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><Clock3 className="h-5 w-5 text-cyan-200" /></span><div><p className="text-xs font-medium text-slate-300">{election?.status === 'active' ? 'Voting closes' : 'Election status'}</p><p className="mt-1 font-semibold">{election ? election.status === 'active' ? endDate : statusLabel : 'Loading election'}</p></div></div>
              <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-slate-300"><Radio className="h-3.5 w-3.5 text-emerald-300" />{statusLabel}</div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            {elections.length > 1 && <label htmlFor="demo-election" className="sr-only">Choose an election</label>}
            {elections.length > 1 && <select id="demo-election" value={selectedElectionId} onChange={(event) => { setSelectedElectionId(event.target.value); setSelectedCandidateId(''); setResult(null); setError('') }} className="mb-5 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-sm">{elections.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>}

            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-sm font-semibold text-indigo-700">THE BALLOT</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Choose your candidate</h2><p className="mt-2 text-sm text-slate-500">One selection per wallet for this election.</p></div>
              {election && <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${election.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{statusLabel}</span>}
            </div>

            {loading ? <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500"><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Loading the ballot…</div> : !election ? <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">No elections are available right now.</div> : <>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700"><Vote className="h-5 w-5" /></span><div className="min-w-0"><h3 className="font-semibold">{election.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{election.description}</p><p className="mt-3 text-xs font-medium text-slate-400">{election.location} <span className="px-1.5">·</span> Ends {endDate}</p></div></div></div>

              <div className="grid gap-4 sm:grid-cols-2">
                {election.candidates.map((candidate, index) => {
                  const selected = candidate.id === selectedCandidateId
                  const initials = candidate.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
                  return <button key={candidate.id} type="button" onClick={() => setSelectedCandidateId(candidate.id)} disabled={chainState.alreadyVoted || election.status !== 'active'} aria-pressed={selected} className={`group relative min-h-64 rounded-3xl border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:p-6 ${selected ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/15 shadow-md shadow-indigo-950/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="flex items-start justify-between gap-3"><span className={`grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold ${index % 2 === 0 ? 'bg-slate-900 text-white' : 'bg-cyan-100 text-cyan-900'}`}>{initials}</span><span className={`grid h-6 w-6 place-items-center rounded-full border ${selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-transparent'}`}><Check className="h-3.5 w-3.5" /></span></div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-700">{candidate.position}</p><h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{candidate.name}</h3><p className="mt-1 text-sm text-slate-500">{candidate.department}</p><p className="mt-4 border-t border-slate-200/80 pt-4 text-sm leading-6 text-slate-600">{candidate.manifesto}</p>
                  </button>
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Your selection</p><p className="mt-1 font-semibold text-slate-900">{selectedCandidate?.name ?? 'Choose a candidate above'}</p></div>{selectedCandidate && <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"><CheckCircle2 className="h-3.5 w-3.5" />Ready to vote</span>}</div>
                {chainState.alreadyVoted ? <div role="status" className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Ballot recorded.</strong> This wallet already has a vote receipt for this election.</p></div> : election.status !== 'active' ? <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">This election is not currently accepting votes.</p> : chainState.programAvailable && !chainState.electionInitialized ? <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{isAuthority ? 'Initialize this election on Devnet before voting.' : 'The election needs to be initialized by the configured authority before voting.'}</div> : null}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {chainState.programAvailable && !chainState.electionInitialized && isAuthority && election.status === 'active' && <button type="button" onClick={initializeElection} disabled={submitting} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">{submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}Initialize election</button>}
                  <button type="button" onClick={submitVote} disabled={!connected || !publicKey || !selectedCandidateId || submitting || !chainState.programAvailable || !chainState.electionInitialized || election.status !== 'active' || chainState.alreadyVoted} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">{submitting ? <><LoaderCircle className="h-4 w-4 animate-spin" />Waiting for confirmation</> : <><Vote className="h-4 w-4" />Cast my vote</>}</button>
                </div>
                <p className="mt-3 text-center text-xs leading-5 text-slate-400">Your wallet will ask you to review and approve the transaction. Devnet SOL is needed for fees.</p>
              </div>
            </>}

            {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
            {result && explorerUrl && <div role="status" className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-semibold">{result.initialized ? 'Election initialized on Devnet.' : `Vote submitted for ${result.candidateName}.`}</p><a href={explorerUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline">View transaction on Solana Explorer <ExternalLink className="h-3.5 w-3.5" /></a></div></div></div>}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><WalletCards className="h-5 w-5" /></span><div><h2 className="font-semibold">Your wallet</h2><p className="text-xs text-slate-500">Connect to participate</p></div></div><div className="mt-5"><WalletConnector /></div><div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-xs"><span className="text-slate-500">Connection</span><span className={`font-semibold ${connected ? 'text-emerald-700' : 'text-slate-600'}`}>{connected && publicKey ? shortAddress(publicKey.toBase58()) : 'Not connected'}</span></div></div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold">A transparent ballot</h2><p className="mt-1 text-sm leading-6 text-slate-500">Your transaction is recorded on Solana Devnet. The demo limits each wallet to one vote per election.</p><div className="mt-5 space-y-4"><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><LockKeyhole className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Wallet-signed</p><p className="mt-0.5 text-xs leading-5 text-slate-500">You approve every transaction.</p></div></div><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-700"><ShieldCheck className="h-4 w-4" /></span><div><p className="text-sm font-semibold">On-chain receipt</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Confirm your transaction in Explorer.</p></div></div></div></div>

            <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Network details</p><div className="mt-4 space-y-3 text-sm"><div className="flex items-center justify-between gap-2"><span className="text-slate-400">Network</span><span className="font-medium">Devnet</span></div><div className="flex items-center justify-between gap-2"><span className="text-slate-400">Program</span><span className="font-mono text-xs" title={VOTING_PROGRAM_ID.toBase58()}>{shortAddress(VOTING_PROGRAM_ID.toBase58())}</span></div><div className="flex items-center justify-between gap-2"><span className="text-slate-400">Election account</span><span className="font-mono text-xs" title={electionAddress?.toBase58()}>{electionAddress ? shortAddress(electionAddress.toBase58()) : '—'}</span></div></div><a href={`https://explorer.solana.com/address/${VOTING_PROGRAM_ID.toBase58()}?cluster=devnet`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200 hover:text-white">Open program <ArrowUpRight className="h-4 w-4" /></a></div>
          </aside>
        </div>
        <footer className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />Demo voting experience on Solana Devnet. This is not an identity-verified election.</footer>
      </div>
    </main>
  )
}
