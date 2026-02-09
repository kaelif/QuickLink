/**
 * Feature flags for the app.
 *
 * - useDummyData: when true, climbers are loaded from the in-app dummy data (data/dummyClimbers.ts).
 *   when false, climbers are loaded from the database (e.g. Supabase) once connected.
 *
 * - testing: when true, enables testing-only UI (e.g. reset button). When false, removed matches are
 *   excluded from the stack permanently.
 *
 * - circulateCards: when true AND testing is true, left-swiped (passed) users go back into the stack.
 *   Use for certain test cases. When false (or when testing is false), passed users stay out of the stack.
 */
export const USE_DUMMY_DATA = true;
export const TESTING = true;
export const CIRCULATE_CARDS = true;
