-- Elections metadata
create table if not exists public.elections (
  id text primary key,
  title text not null,
  description text,
  status text not null check (status in ('active', 'upcoming', 'completed')),
  start_time timestamptz,
  end_time timestamptz,
  location text,
  program_account text,
  created_at timestamptz not null default now()
);

-- Candidates belonging to an election
create table if not exists public.candidates (
  id text primary key,
  election_id text not null references public.elections(id) on delete cascade,
  name text not null,
  position text,
  department text,
  manifesto text,
  created_at timestamptz not null default now()
);

-- Wallet addresses eligible to vote
create table if not exists public.eligible_voters (
  election_id text not null references public.elections(id) on delete cascade,
  wallet_address text not null,
  added_at timestamptz not null default now(),
  primary key (election_id, wallet_address)
);

-- One database receipt per wallet/election; on-chain state is also authoritative
create table if not exists public.vote_receipts (
  id uuid primary key default gen_random_uuid(),
  election_id text not null references public.elections(id) on delete cascade,
  wallet_address text not null,
  candidate_id text not null references public.candidates(id) on delete restrict,
  transaction_signature text not null unique,
  block_time timestamptz,
  created_at timestamptz not null default now(),
  unique (election_id, wallet_address)
);

alter table public.elections enable row level security;
alter table public.candidates enable row level security;
alter table public.eligible_voters enable row level security;
alter table public.vote_receipts enable row level security;

create policy "Public can read elections" on public.elections
  for select using (true);

create policy "Public can read candidates" on public.candidates
  for select using (true);

create policy "Public can read vote receipts" on public.vote_receipts
  for select using (true);
