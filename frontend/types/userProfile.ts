import type { ClimbingType, Gender } from "./climber";

export type { Gender };

export type GenderPreference = "woman" | "man" | "nonbinary" | "all";

export interface MatchFilter {
  ageMin: number;
  ageMax: number;
  genderPreferences: GenderPreference[];
  climbingTypes: ClimbingType[];
}

export const DEFAULT_MATCH_FILTER: MatchFilter = {
  ageMin: 18,
  ageMax: 99,
  genderPreferences: ["all"],
  climbingTypes: [],
};

export interface UserProfile {
  bio: string;
  photoUrls: string[];
  gender: Gender;
  genderOtherText: string;
  climbingTypes: ClimbingType[];
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  bio: "",
  photoUrls: [],
  gender: "woman",
  genderOtherText: "",
  climbingTypes: [],
};
