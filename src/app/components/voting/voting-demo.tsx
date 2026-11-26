'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { ExternalLink, LoaderCircle, Vote } from 'lucide-react'
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

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
        <strong>Solana Devnet:</strong> transactions are signed by your connected wallet. Each wallet may vote once per election and needs Devnet SOL for transaction fees.
      </div>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3"><div className="rounded-lg bg-blue-100 p-3 text-blue-700"><Vote className="h-6 w-6" /></div><div><h1 className="text-2xl font-bold text-gray-900">Vote on Solana</h1><p className="mt-1 text-gray-600">Select a candidate and approve the transaction in your wallet.</p></div></div>
          <WalletConnector />
        </div>
        {loading ? <p className="py-8 text-gray-600">Loading election…</p> : !election ? <p className="py-8 text-gray-600">No elections are available.</p> : <>
          <label htmlFor="demo-election" className="mb-2 block text-sm font-medium text-gray-700">Election</label>
          <select id="demo-election" value={selectedElectionId} onChange={(event) => { setSelectedElectionId(event.target.value); setSelectedCandidateId(''); setResult(null); setError('') }} className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900">
            {elections.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <div className="mb-5 rounded-lg bg-gray-50 p-4"><h2 className="font-semibold text-gray-900">{election.title}</h2><p className="mt-1 text-sm text-gray-600">{election.description}</p><p className="mt-2 break-all text-xs text-gray-500">Election account: {electionAddress?.toBase58()}</p></div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Select one candidate</h2>
          <div className="space-y-3">{election.candidates.map((candidate) => <button key={candidate.id} type="button" onClick={() => setSelectedCandidateId(candidate.id)} disabled={chainState.alreadyVoted || election.status !== 'active'} aria-pressed={candidate.id === selectedCandidateId} className={`w-full rounded-xl border p-4 text-left ${candidate.id === selectedCandidateId ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} disabled:cursor-not-allowed`}><span className="block font-semibold text-gray-900">{candidate.name}</span><span className="block text-sm text-gray-600">{candidate.position} · {candidate.department}</span><span className="mt-2 block text-sm text-gray-700">{candidate.manifesto}</span></button>)}</div>
          <div className="mt-5 rounded-lg border border-gray-200 p-4 text-sm"><p><strong>Program:</strong> <span className="break-all font-mono">{VOTING_PROGRAM_ID.toBase58()}</span></p><p className="mt-1"><strong>Authority:</strong> <span className="break-all font-mono">{VOTING_AUTHORITY.toBase58()}</span></p><p className="mt-1"><strong>Election:</strong> {chainState.electionInitialized ? 'Initialized on Devnet' : 'Not initialized'}</p>{connected && <p className="mt-1"><strong>Your wallet:</strong> {chainState.alreadyVoted ? 'Vote receipt found' : 'No vote receipt found'}</p>}</div>
          {chainState.programAvailable && !chainState.electionInitialized && isAuthority && election.status === 'active' && <button type="button" onClick={initializeElection} disabled={submitting} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:bg-gray-300">{submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}Initialize election (authority wallet)</button>}
          {chainState.programAvailable && !chainState.electionInitialized && !isAuthority && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">The configured authority wallet must initialize the election before voting.</p>}
          {chainState.alreadyVoted ? <p role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">Your vote receipt is recorded on Devnet. This wallet cannot vote again in this election.</p> : <button type="button" onClick={submitVote} disabled={!connected || !publicKey || !selectedCandidateId || submitting || !chainState.programAvailable || !chainState.electionInitialized || election.status !== 'active'} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:bg-gray-300">{submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}Submit vote on Devnet</button>}
        </>}
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {result && <div role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900"><p className="font-semibold">{result.initialized ? 'Election initialized on Devnet.' : `Vote submitted for ${result.candidateName}.`}</p><a href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 break-all text-sm underline">View confirmed transaction <ExternalLink className="h-4 w-4 shrink-0" /></a></div>}
      </section>
    </main>
  )
}
