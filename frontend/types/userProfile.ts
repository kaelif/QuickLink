import type { ClimbingType } from "./climber";

export type Gender = "woman" | "man" | "nonbinary" | "other";

export type GenderPreference = "woman" | "man" | "nonbinary" | "all";

export interface UserProfile {
  bio: string;
  photoUrls: string[];
  gender: Gender;
  genderOtherText: string;
  climbingTypes: ClimbingType[];
  agePrefMin: number;
  agePrefMax: number;
  genderPreferences: GenderPreference[];
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  bio: "",
  photoUrls: [],
  gender: "woman",
  genderOtherText: "",
  climbingTypes: [],
  agePrefMin: 18,
  agePrefMax: 99,
  genderPreferences: ["all"],
};
