-- Tables from the plan (section 5). CV raw text is never stored.
create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  ip_hash text,                 -- salted hash, not the real IP
  job_title_guess text,
  match_score int,
  language text,
  result jsonb,                 -- AI result, without CV text
  tokens_used int
);
create index if not exists analyses_ip_hash_created_at on analyses (ip_hash, created_at); -- rate limit lookup

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses(id),
  helpful boolean,
  comment text,
  created_at timestamptz default now()
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- RLS: analyses has no policies, so only the Edge Function (service role) can touch it.
alter table analyses enable row level security;
alter table feedback enable row level security;
alter table waitlist enable row level security;

-- Anonymous visitors may only insert feedback and emails, never read them.
create policy "anon insert feedback" on feedback for insert to anon with check (true);
create policy "anon insert waitlist" on waitlist for insert to anon with check (true);
