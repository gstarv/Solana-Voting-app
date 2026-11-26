import { DEMO_ELECTIONS, type DemoElection } from './demo-data'

export function getConfiguredNetwork() {
  return {
    network: 'devnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    programId: process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID || null,
  }
}

export function getDemoElections(): DemoElection[] {
  return DEMO_ELECTIONS
}
