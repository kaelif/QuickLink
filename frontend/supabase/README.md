# QuickLink Supabase scripts

SQL scripts to store climber dummy data and user profile schema in Supabase. Run these in the **Supabase Dashboard → SQL Editor**.

All scripts are **idempotent**: safe to run multiple times. They only create tables/objects or add data if they don’t already exist, and do not insert duplicate climber rows.

## Order

1. **01_schema.sql** – Creates tables (if not exists), RLS policies, triggers, and optional `seed_id` column on `climbers` for idempotent seeding.
2. **02_seed_climbers.sql** – Inserts the main user (seed_id = `main-user`), other climbers, and `user_likes`. Uses `ON CONFLICT` so re-running does not duplicate. Half of climbers (seed-1..5) have liked the main user for testing mutual matches.

## How to run

1. Open your [Supabase](https://supabase.com) project.
2. Go to **SQL Editor**.
3. Run **01_schema.sql** (copy, paste, Run). You can run it again later; it will not create duplicates or fail on existing objects.
4. Run **02_seed_climbers.sql** (copy, paste, Run). You can run it again to refresh seed data; existing rows with the same `seed_id` are updated, not duplicated.

## Tables

| Table          | Purpose |
|----------------|---------|
| `public.climbers`      | All climbers including the main user. Main user has `seed_id = 'main-user'` (the app user on your phone). Others are discovery feed. |
| `public.user_likes`     | Right swipes: `(swiper_id, liked_id)` = swiper has swiped right on liked. A **match** exists only when both (A,B) and (B,A) exist (mutual like). |
| `public.user_profiles` | App user’s editable profile (bio, photos, gender, climbing types, age/gender preferences). Optional; can be wired to Supabase Auth later. |

## Connecting the app

To load climbers from this database instead of dummy data:

1. **Get your Project URL and anon key**
   - Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
   - Go to **Project Settings** (gear icon) → **API**.
   - **Project URL** → use as `EXPO_PUBLIC_SUPABASE_URL` (e.g. `https://YOUR_PROJECT_REF.supabase.co`).
   - **Project API keys** → copy the **anon** **public** key → use as `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
   - The anon key is not the same as your database password. Do not put the postgres password in the app.

2. **Create `.env` in the frontend folder**
   - Copy `.env.example` to `.env`: `cp .env.example .env`
   - Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
   - Restart the dev server after changing `.env`.

3. **Use the database in the app**
   - In `lib/featureFlags.ts`, set `USE_DUMMY_DATA = false`.
   - The app will then fetch climbers from `public.climbers` via the Supabase client.

## Using from the app

- **Main user**: Identify the app user by querying `climbers` where `seed_id = 'main-user'` (or store that `id` in env, e.g. `EXPO_PUBLIC_MAIN_USER_ID`). Exclude the main user from the discovery stack.
- **Climbers**: Query `public.climbers` where `seed_id != 'main-user'` (or `id != main_user_id`). Map DB columns: `first_name` → `firstName`, `photo_urls` → `photoUrls`, `climbing_types` → `climbingTypes`, `latitude`/`longitude` → `location`.
- **Swipe right**: Insert into `user_likes (swiper_id, liked_id)` with `(main_user_id, liked_climber_id)`. Then check if `(liked_climber_id, main_user_id)` exists in `user_likes`; if yes, it’s a match (mutual like).
- **Matches**: Select climbers `c` where both `(main_user_id, c.id)` and `(c.id, main_user_id)` exist in `user_likes`.
- **User profile**: To sync the edit-profile screen with Supabase, read/write `public.user_profiles` (e.g. by a user id once Auth is enabled).

## Auth (optional)

When you add Supabase Auth:

- Change `user_profiles.id` to `references auth.users(id) on delete cascade` and create a row in `user_profiles` on sign-up (e.g. via trigger or app logic).
- Tighten RLS on `user_profiles` so users can only select/update their own row (`auth.uid() = id`).
