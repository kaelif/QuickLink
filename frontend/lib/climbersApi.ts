import { supabase } from "./supabase";
import type { ClimberProfile } from "../types/climber";
import type { UserProfile } from "../types/userProfile";

/** Shape of a climbers row from Supabase (snake_case). */
interface ClimberRow {
  id: string;
  first_name: string;
  age: number;
  latitude: number;
  longitude: number;
  climbing_types: string[];
  bio: string;
  photo_urls: string[];
  gender?: string | null;
}

const GENDERS: ClimberProfile["gender"][] = ["woman", "man", "nonbinary", "other"];

function mapRowToClimberProfile(row: ClimberRow): ClimberProfile {
  const gender = row.gender && GENDERS.includes(row.gender as ClimberProfile["gender"])
    ? (row.gender as ClimberProfile["gender"])
    : undefined;
  return {
    id: String(row.id),
    firstName: row.first_name ?? "",
    age: row.age ?? 18,
    location: {
      latitude: row.latitude ?? 0,
      longitude: row.longitude ?? 0,
    },
    climbingTypes: Array.isArray(row.climbing_types)
      ? row.climbing_types.filter(Boolean) as ClimberProfile["climbingTypes"]
      : [],
    bio: row.bio ?? "",
    photoUrls: Array.isArray(row.photo_urls) ? row.photo_urls : [],
    ...(gender != null && { gender }),
  };
}

/**
 * Fetches climbers from the database (Supabase).
 * Used when USE_DUMMY_DATA is false.
 * Excludes the current user (seed_id = 'main-user') so they never appear in the stack.
 */
export async function fetchClimbersFromDb(): Promise<ClimberProfile[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("climbers")
    .select("id, first_name, age, latitude, longitude, climbing_types, bio, photo_urls, gender")
    .neq("seed_id", "main-user");
  if (error) {
    console.warn("fetchClimbersFromDb:", error.message);
    return [];
  }
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data.map((row) => mapRowToClimberProfile(row as ClimberRow));
}

const MAIN_USER_SEED_ID = "main-user";

/**
 * Updates the main user's row in climbers (seed_id = 'main-user') with edit-profile data.
 * Used when USE_DUMMY_DATA is false. No-op if Supabase is not configured.
 */
export async function updateMainUserProfile(profile: UserProfile): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase not configured" };
  }
  const { error } = await supabase
    .from("climbers")
    .update({
      bio: profile.bio ?? "",
      photo_urls: profile.photoUrls ?? [],
      climbing_types: profile.climbingTypes ?? [],
      gender: profile.gender ?? null,
      gender_other_text: profile.genderOtherText ?? "",
    })
    .eq("seed_id", MAIN_USER_SEED_ID);
  if (error) {
    console.warn("updateMainUserProfile:", error.message);
    return { error: error.message };
  }
  return { error: null };
}
