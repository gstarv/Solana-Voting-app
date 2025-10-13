export interface BlockchainStatus {
  connected: boolean
  network: 'mainnet' | 'devnet' | 'testnet'
  blockHeight: number
  lastUpdate: string
  performance: 'excellent' | 'good' | 'poor'
  version: string
}

export interface Transaction {
  hash: string
  status: 'confirmed' | 'pending' | 'failed'
  timestamp: string
  type: 'vote' | 'registration' | 'verification'
  signature: string
  slot: number
}

export interface WalletInfo {
  publicKey: string
  connected: boolean
  walletName?: string
  balance?: number
}