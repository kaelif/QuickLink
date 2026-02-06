# QuickLink Supabase scripts

SQL scripts to store climber dummy data and user profile schema in Supabase. Run these in the **Supabase Dashboard → SQL Editor**.

All scripts are **idempotent**: safe to run multiple times. They only create tables/objects or add data if they don’t already exist, and do not insert duplicate climber rows.

## Order

1. **01_schema.sql** – Creates tables (if not exists), RLS policies, triggers, and optional `seed_id` column on `climbers` for idempotent seeding.
2. **02_seed_climbers.sql** – Inserts or updates the dummy climbers (same data as `data/dummyClimbers.ts`). Uses `ON CONFLICT (seed_id) DO UPDATE` so re-running updates existing rows instead of duplicating.

## How to run

1. Open your [Supabase](https://supabase.com) project.
2. Go to **SQL Editor**.
3. Run **01_schema.sql** (copy, paste, Run). You can run it again later; it will not create duplicates or fail on existing objects.
4. Run **02_seed_climbers.sql** (copy, paste, Run). You can run it again to refresh seed data; existing rows with the same `seed_id` are updated, not duplicated.

## Tables

| Table          | Purpose |
|----------------|---------|
| `public.climbers`      | Discovery feed: climber profiles (first name, age, location, climbing types, bio, photo URLs). Used for the swipe stack. |
| `public.user_profiles` | App user’s editable profile (bio, photos, gender, climbing types, age/gender preferences). Optional; can be wired to Supabase Auth later. |

## Using from the app

- **Climbers**: Query `public.climbers` (e.g. with Supabase client `from('climbers').select('*')`). Map DB columns to your app: `first_name` → `firstName`, `photo_urls` → `photoUrls`, `climbing_types` → `climbingTypes`, and `latitude`/`longitude` into a `location` object. The optional `seed_id` column is used only by the seed script for idempotent upserts; you can omit it from app queries or use `id` (uuid) as the primary key.
- **User profile**: To sync the edit-profile screen with Supabase, read/write `public.user_profiles` (e.g. by a user id once Auth is enabled).

## Auth (optional)

When you add Supabase Auth:

- Change `user_profiles.id` to `references auth.users(id) on delete cascade` and create a row in `user_profiles` on sign-up (e.g. via trigger or app logic).
- Tighten RLS on `user_profiles` so users can only select/update their own row (`auth.uid() = id`).
