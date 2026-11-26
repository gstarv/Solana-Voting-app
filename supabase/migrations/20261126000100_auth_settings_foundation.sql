-- Run this migration in Supabase SQL Editor or with the Supabase CLI.
-- Election content remains static in src/lib/voting/demo-data.ts for this first milestone.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_address text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, wallet_address),
  unique (wallet_address)
);

create table if not exists public.election_eligibility (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  election_id text not null,
  eligible boolean not null default false,
  verification_method text not null default 'admin_allowlist',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, election_id)
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_enabled boolean not null default false,
  in_app_enabled boolean not null default true,
  election_reminders boolean not null default true,
  vote_updates boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('info', 'warning', 'success', 'error')),
  title text not null check (char_length(title) between 1 and 160),
  message text not null check (char_length(message) <= 2000),
  election_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index if not exists eligibility_election_user_idx on public.election_eligibility (election_id, user_id);
create index if not exists audit_events_created_idx on public.audit_events (created_at desc);

alter table public.profiles enable row level security;
alter table public.wallet_links enable row level security;
alter table public.election_eligibility enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;

-- Users may only read/update their own profile and preferences.
create policy "profile_select_own" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "profile_insert_own" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "profile_update_own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "preferences_select_own" on public.notification_preferences for select to authenticated using (user_id = (select auth.uid()));
create policy "preferences_insert_own" on public.notification_preferences for insert to authenticated with check (user_id = (select auth.uid()));
create policy "preferences_update_own" on public.notification_preferences for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "notifications_select_own" on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy "notifications_update_own" on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- A verified wallet link must only be created by a trusted server flow that
-- verifies a fresh wallet signature. Do not grant browser inserts or updates.
create policy "wallet_links_select_own" on public.wallet_links for select to authenticated using (user_id = (select auth.uid()));
create policy "wallet_links_delete_own" on public.wallet_links for delete to authenticated using (user_id = (select auth.uid()));

create policy "eligibility_select_own" on public.election_eligibility for select to authenticated using (user_id = (select auth.uid()));
create policy "eligibility_admin_manage" on public.election_eligibility for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Audit events are intentionally server-write-only. Admin role is assigned in
-- Supabase app_metadata (never user_metadata, which users can edit themselves).
create policy "audit_events_admin_select" on public.audit_events for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Create a minimal profile and preference row for each new Auth user.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  insert into public.notification_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.notification_preferences to authenticated;
grant select, update on public.notifications to authenticated;
grant select, delete on public.wallet_links to authenticated;
grant select on public.election_eligibility to authenticated;
grant select on public.audit_events to authenticated;
