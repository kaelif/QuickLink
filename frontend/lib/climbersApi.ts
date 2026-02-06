import { supabase } from "./supabase";
import type { ClimberProfile } from "../types/climber";

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
}

function mapRowToClimberProfile(row: ClimberRow): ClimberProfile {
  return {
    id: String(row.id),
    firstName: row.first_name ?? "",
    age: row.age ?? 18,
    location: {
      latitude: row.latitude ?? 0,
      longitude: row.longitude ?? 0,
    },
    climbingTypes: Array.isArray(row.climbing_types) ? row.climbing_types : [],
    bio: row.bio ?? "",
    photoUrls: Array.isArray(row.photo_urls) ? row.photo_urls : [],
  };
}

/**
 * Fetches climbers from the database (Supabase).
 * Used when USE_DUMMY_DATA is false.
 * Returns [] if Supabase is not configured or the query fails.
 */
export async function fetchClimbersFromDb(): Promise<ClimberProfile[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("climbers")
    .select("id, first_name, age, latitude, longitude, climbing_types, bio, photo_urls");
  if (error) {
    console.warn("fetchClimbersFromDb:", error.message);
    return [];
  }
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data.map((row) => mapRowToClimberProfile(row as ClimberRow));
}
