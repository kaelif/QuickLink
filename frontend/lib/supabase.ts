import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Prefer values from app.config.js extra (loaded via dotenv); fallback to process.env
const extra = Constants.expoConfig?.extra ?? {};
const supabaseUrl = extra.EXPO_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = extra.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Supabase client for the app.
 * Requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.
 *
 * Where to find these:
 * 1. Open https://supabase.com/dashboard and select your project.
 * 2. Go to Project Settings (gear) → API.
 * 3. Project URL → use as EXPO_PUBLIC_SUPABASE_URL.
 * 4. Project API keys → "anon" "public" → use as EXPO_PUBLIC_SUPABASE_ANON_KEY.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
