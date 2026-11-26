# Solana Devnet Voting Demo

The `/demo` page submits real wallet-signed transactions to the configured Anchor voting program on Solana Devnet. It checks the program, election PDA, and the connected wallet's vote-receipt PDA directly against the RPC endpoint.

## Election setup

The demo derives the election PDA from the stable election slug in `src/lib/voting/demo-data.ts`, encoded as UTF-8 and zero-padded to the Anchor program's 32-byte election ID. The configured authority wallet must connect and initialize the election once; the wallet signs and pays the Devnet transaction fee. Voters then connect their own wallets and sign `cast_vote` transactions. The program's receipt PDA enforces one vote per wallet per election.

This demo writes each selected candidate index to the program's public on-chain receipt account. It is a Devnet demonstration, not a secure, anonymous, or legally valid election; candidate choice is publicly visible in account data and election setup is specific to the current demo program.

## Environment

Set these Vercel variables for Preview and Production:

- `NEXT_PUBLIC_SOLANA_RPC_URL` (optional; defaults to Solana Devnet RPC)
- `NEXT_PUBLIC_VOTING_PROGRAM_ID`
- `NEXT_PUBLIC_VOTING_AUTHORITY`

The public program ID and authority address are not secrets. Never put wallet private keys or keypair files in GitHub or Vercel. Supabase service-role credentials must remain server-only.

After merging or deploying the integration branch, redeploy Vercel so the client bundle includes the public environment variables.
