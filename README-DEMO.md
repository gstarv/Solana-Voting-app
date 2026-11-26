# VoteChain demo on Vercel

The project can be imported into Vercel and deployed without Supabase credentials, a Solana program ID, an RPC provider account, or wallet setup. The interactive demo is available at `/demo` and calls the Next.js `/api/elections` and `/api/votes` routes.

## What the demo does

- Loads a sample election from the demo API.
- Validates the election and candidate in the vote API.
- Returns a simulated demo receipt.
- Saves the receipt in the current browser's local storage so the same browser shows its demo vote after refresh.

Demo votes are not stored in a shared database, do not persist across browsers/devices, and are not submitted to Solana. This is for interface and API-flow testing only—not a secure, anonymous, or legally valid election.

## Deploy

1. Import this repository into Vercel and choose the `copilot/solana-voting-demo-integration` branch (or deploy the branch through a PR).
2. Use the repository root as the project root and the default Next.js build settings.
3. No environment variables are required for demo mode.
4. Open the Vercel deployment URL and visit `/demo` on your phone.

The Supabase schema and Anchor program are scaffolds for later integration; they are not used by this demo flow.
