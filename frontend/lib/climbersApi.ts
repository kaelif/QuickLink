import type { ClimberProfile } from "../types/climber";

/**
 * Fetches climbers from the database (e.g. Supabase).
 * Used when USE_DUMMY_DATA is false.
 *
 * To connect Supabase:
 * 1. Install @supabase/supabase-js and create a client.
 * 2. Query: const { data } = await supabase.from('climbers').select('*').
 * 3. Map each row to ClimberProfile: id (string), firstName <- first_name, age,
 *    location <- { latitude, longitude }, climbingTypes <- climbing_types,
 *    bio, photoUrls <- photo_urls, gender (optional if you add it to the table).
 */
export async function fetchClimbersFromDb(): Promise<ClimberProfile[]> {
  // TODO: Wire Supabase client and map rows to ClimberProfile.
  // Example mapping: { id: row.id, firstName: row.first_name, age: row.age, location: { latitude: row.latitude, longitude: row.longitude }, climbingTypes: row.climbing_types ?? [], bio: row.bio ?? '', photoUrls: row.photo_urls ?? [] }
  return [];
}
