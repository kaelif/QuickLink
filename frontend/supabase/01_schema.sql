-- QuickLink Supabase schema
-- Run this in Supabase Dashboard → SQL Editor before 02_seed_climbers.sql
-- Creates tables for climbers (discovery feed) and user_profiles (edit-profile data).

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

-- Optional: enable RLS and allow public read for unauthenticated discovery.
alter table public.climbers enable row level security;

create policy "Climbers are viewable by everyone"
  on public.climbers for select
  using (true);

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

-- Policy: allow all for now (no auth). When you add auth, restrict to auth.uid() = id.
create policy "User profiles are readable by everyone"
  on public.user_profiles for select using (true);
create policy "User profiles are insertable by everyone"
  on public.user_profiles for insert with check (true);
create policy "User profiles are updatable by everyone"
  on public.user_profiles for update using (true);

-- Updated_at trigger helper (optional).
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger climbers_updated_at
  before update on public.climbers
  for each row execute function public.set_updated_at();

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();
