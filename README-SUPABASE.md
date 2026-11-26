# Solana Voting App

## Supabase foundation (email/password)

1. Install dependencies with the repository's configured package manager.
2. In Supabase, run `supabase/migrations/20261126000100_auth_settings_foundation.sql` (or use the Supabase CLI migration workflow).
3. Set these Vercel and local environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/publishable key. This key is safe to expose when RLS is correctly enabled.
   - `SUPABASE_URL` and `SUPABASE_ANON_KEY` are accepted server-side aliases.
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix. This first milestone uses the authenticated anon client plus RLS and does not need the service-role key.
4. In Supabase Auth, enable Email provider and configure the site URL and redirect allowlist to include `https://YOUR_DOMAIN/auth/callback` and your local development URL.
5. Deploy the branch and test sign-up, email confirmation, sign-in, settings save, and sign-out.

The `/auth` page provides email/password sign-up and sign-in; `/settings` saves a profile display name, IANA timezone, and notification preferences. `GET/PATCH /api/settings` and `GET/PATCH /api/notifications` require a valid Supabase session. Election content remains static. RLS prevents users from reading other users' profile, notification, wallet-link, and eligibility records.

Wallet links are schema-only in this milestone. They are intentionally not insertable from the browser: the next wallet-linking implementation must verify a fresh wallet signature server-side before creating a link. Eligibility records likewise require a trusted admin workflow; wallet-only checks do not prove a unique human identity. Email preference storage does not send email until a delivery provider and background job are configured. This is not yet a production election or anonymous voting system.
