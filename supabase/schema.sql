create table if not exists public.fantong_archives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null check (char_length(nickname) between 1 and 24),
  subject text not null check (char_length(subject) between 1 and 40),
  type_id text not null,
  type_name text not null,
  type_code text not null,
  risk text not null,
  share_line text not null,
  metrics jsonb not null,
  answers jsonb not null,
  source text not null default 'fbi-fantong-behavior-identification',
  created_at timestamptz not null default now()
);

alter table public.fantong_archives enable row level security;

drop policy if exists "Users can insert their own fantong archives" on public.fantong_archives;
create policy "Users can insert their own fantong archives"
  on public.fantong_archives
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own fantong archives" on public.fantong_archives;
create policy "Users can read their own fantong archives"
  on public.fantong_archives
  for select
  to authenticated
  using (auth.uid() = user_id);

create index if not exists fantong_archives_user_created_idx
  on public.fantong_archives (user_id, created_at desc);

create index if not exists fantong_archives_type_idx
  on public.fantong_archives (type_id);
