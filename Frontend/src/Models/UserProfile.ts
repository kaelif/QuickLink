import { SkillLevel, ClimbingType } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  skillLevel: SkillLevel;
  preferredTypes: ClimbingType[];
  location: string;
  profileImageName: string;
  availability: string;
  favoriteCrag?: string | null;
}

