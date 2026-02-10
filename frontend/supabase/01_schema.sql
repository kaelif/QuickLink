-- QuickLink Supabase schema (idempotent)
-- Run in Supabase Dashboard → SQL Editor. Safe to run multiple times.
-- Uses: create table if not exists, add column if not exists, drop policy/trigger if exists
-- then create, create or replace function. No duplicates or errors on re-run.

-- Climbers: profiles shown in the swipe stack (dummy/real climbers).
create table if not exists public.climbers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  age int not null check (age >= 18 and age <= 120),
  latitude double precision not null,
  longitude double precision not null,
  climbing_types text[] not null default '{}' check (
    climbing_types <@ array['sport', 'bouldering', 'trad']::text[]
  ),
  bio text not null default '',
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.climbers is 'Climber profiles for the discovery/swipe feed.';
comment on column public.climbers.climbing_types is 'Allowed: sport, bouldering, trad.';
comment on column public.climbers.photo_urls is 'Array of image URLs for the profile.';

-- Optional: unique seed_id for idempotent seed scripts (no duplicate rows on re-run).
alter table public.climbers
  add column if not exists seed_id text unique;

comment on column public.climbers.seed_id is 'Set by seed script; used for ON CONFLICT so seed can be run repeatedly without duplicates.';

-- Editable profile fields: gender and gender_other_text (used by edit-profile and for filtering). Nullable for backfill.
alter table public.climbers
  add column if not exists gender text check (gender is null or gender in ('woman', 'man', 'nonbinary', 'other'));
alter table public.climbers
  add column if not exists gender_other_text text not null default '';
comment on column public.climbers.gender is 'Editable: woman, man, nonbinary, other.';
comment on column public.climbers.gender_other_text is 'Editable: free text when gender is other.';

-- RLS: drop and recreate so script is idempotent.
alter table public.climbers enable row level security;

drop policy if exists "Climbers are viewable by everyone" on public.climbers;
create policy "Climbers are viewable by everyone"
  on public.climbers for select
  using (true);
drop policy if exists "Climbers are updatable by everyone" on public.climbers;
create policy "Climbers are updatable by everyone"
  on public.climbers for update
  using (true) with check (true);

-- User likes (swipe right): who each climber has swiped right on. A match = mutual like (A liked B and B liked A).
create table if not exists public.user_likes (
  swiper_id uuid not null references public.climbers(id) on delete cascade,
  liked_id uuid not null references public.climbers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (swiper_id, liked_id),
  check (swiper_id != liked_id)
);

comment on table public.user_likes is 'Right swipes: swiper_id has swiped right on liked_id. Match when (A,B) and (B,A) both exist.';

alter table public.user_likes enable row level security;

drop policy if exists "User likes are viewable by everyone" on public.user_likes;
create policy "User likes are viewable by everyone"
  on public.user_likes for select using (true);
drop policy if exists "User likes are insertable by everyone" on public.user_likes;
create policy "User likes are insertable by everyone"
  on public.user_likes for insert with check (true);
drop policy if exists "User likes are deletable by everyone" on public.user_likes;
create policy "User likes are deletable by everyone"
  on public.user_likes for delete using (true);

-- User profiles: app user's own editable profile (can be linked to auth.users later).
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  -- When using Supabase Auth, replace with: id uuid primary key references auth.users(id) on delete cascade,
  bio text not null default '',
  photo_urls text[] not null default '{}',
  gender text not null default 'woman' check (
    gender in ('woman', 'man', 'nonbinary', 'other')
  ),
  gender_other_text text not null default '',
  climbing_types text[] not null default '{}' check (
    climbing_types <@ array['sport', 'bouldering', 'trad']::text[]
  ),
  age_pref_min int not null default 18 check (age_pref_min >= 18 and age_pref_min <= 99),
  age_pref_max int not null default 99 check (age_pref_max >= 18 and age_pref_max <= 99),
  gender_preferences text[] not null default array['all']::text[] check (
    gender_preferences <@ array['woman', 'man', 'nonbinary', 'all']::text[]
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_profiles is 'Current user editable profile (bio, preferences).';
comment on column public.user_profiles.gender_preferences is 'Who to show: woman, man, nonbinary, all.';

alter table public.user_profiles enable row level security;

drop policy if exists "User profiles are readable by everyone" on public.user_profiles;
drop policy if exists "User profiles are insertable by everyone" on public.user_profiles;
drop policy if exists "User profiles are updatable by everyone" on public.user_profiles;

create policy "User profiles are readable by everyone"
  on public.user_profiles for select using (true);
create policy "User profiles are insertable by everyone"
  on public.user_profiles for insert with check (true);
create policy "User profiles are updatable by everyone"
  on public.user_profiles for update using (true);

-- Updated_at trigger helper (idempotent).
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists climbers_updated_at on public.climbers;
create trigger climbers_updated_at
  before update on public.climbers
  for each row execute function public.set_updated_at();

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();
