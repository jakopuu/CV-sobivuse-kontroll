create table analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  ip_hash text,
  job_title_guess text,
  match_score int,
  language text,
  result jsonb,
  tokens_used int
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses(id),
  helpful boolean,
  comment text,
  created_at timestamptz default now()
);

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

create index analyses_ip_created_idx on analyses (ip_hash, created_at);

alter table analyses enable row level security;
alter table feedback enable row level security;
alter table waitlist enable row level security;

create policy "anon insert feedback" on feedback
  for insert to anon with check (true);
create policy "anon insert waitlist" on waitlist
  for insert to anon with check (true);