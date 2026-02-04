# QuickLink Supabase scripts

SQL scripts to store climber dummy data and user profile schema in Supabase. Run these in the **Supabase Dashboard → SQL Editor**.

## Order

1. **01_schema.sql** – Creates tables and RLS policies.
2. **02_seed_climbers.sql** – Inserts the dummy climbers (same data as `data/dummyClimbers.ts`).

## How to run

1. Open your [Supabase](https://supabase.com) project.
2. Go to **SQL Editor**.
3. Copy the contents of `01_schema.sql`, paste into the editor, and run (Run button or Cmd/Ctrl+Enter).
4. Copy the contents of `02_seed_climbers.sql`, paste, and run.

To re-seed climbers (e.g. after changing seed data), run once:

```sql
delete from public.climbers;
```

Then run `02_seed_climbers.sql` again.

## Tables

| Table          | Purpose |
|----------------|---------|
| `public.climbers`      | Discovery feed: climber profiles (first name, age, location, climbing types, bio, photo URLs). Used for the swipe stack. |
| `public.user_profiles` | App user’s editable profile (bio, photos, gender, climbing types, age/gender preferences). Optional; can be wired to Supabase Auth later. |

## Using from the app

- **Climbers**: Query `public.climbers` (e.g. with Supabase client `from('climbers').select('*')`). Map DB columns to your app: `first_name` → `firstName`, `photo_urls` → `photoUrls`, `climbing_types` → `climbingTypes`, and `latitude`/`longitude` into a `location` object.
- **User profile**: To sync the edit-profile screen with Supabase, read/write `public.user_profiles` (e.g. by a user id once Auth is enabled).

## Auth (optional)

When you add Supabase Auth:

- Change `user_profiles.id` to `references auth.users(id) on delete cascade` and create a row in `user_profiles` on sign-up (e.g. via trigger or app logic).
- Tighten RLS on `user_profiles` so users can only select/update their own row (`auth.uid() = id`).
