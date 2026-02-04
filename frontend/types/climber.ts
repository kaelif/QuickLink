export type ClimbingType = "sport" | "bouldering" | "trad";

export interface ClimberLocation {
  latitude: number;
  longitude: number;
}

export interface ClimberProfile {
  id: string;
  firstName: string;
  age: number;
  location: ClimberLocation;
  climbingTypes: ClimbingType[];
  bio: string;
  photoUrls: string[];
}
