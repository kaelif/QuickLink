/**
 * Feature flags for the app.
 *
 * - useDummyData: when true, climbers are loaded from the in-app dummy data (data/dummyClimbers.ts).
 *   when false, climbers are loaded from the database (e.g. Supabase) once connected.
 *
 * - testing: when true, users who were removed as matches can appear again in the swipe stack (for testing).
 *   when false, removed matches are excluded from the stack permanently.
 */
export const USE_DUMMY_DATA = true;
export const TESTING = true;
