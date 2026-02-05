import type { ClimbingType } from "../types/climber";

/**
 * Ordered grade scales for filtering.
 * Lower index = easier, higher index = harder.
 */

export const BOULDERING_GRADES = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
  "V13",
  "V14",
  "V15",
  "V16",
  "V17",
] as const;

export const SPORT_GRADES = [
  "5.5",
  "5.6",
  "5.7",
  "5.8",
  "5.9",
  "5.10a",
  "5.10b",
  "5.10c",
  "5.10d",
  "5.11a",
  "5.11b",
  "5.11c",
  "5.11d",
  "5.12a",
  "5.12b",
  "5.12c",
  "5.12d",
  "5.13a",
  "5.13b",
  "5.13c",
  "5.13d",
  "5.14a",
  "5.14b",
  "5.14c",
  "5.14d",
  "5.15a",
  "5.15b",
  "5.15c",
  "5.15d",
] as const;

export const TRAD_GRADES = SPORT_GRADES;

export type BoulderingGrade = (typeof BOULDERING_GRADES)[number];
export type SportGrade = (typeof SPORT_GRADES)[number];
export type TradGrade = (typeof TRAD_GRADES)[number];

export function getGradesForType(type: ClimbingType): readonly string[] {
  switch (type) {
    case "bouldering":
      return BOULDERING_GRADES;
    case "sport":
      return SPORT_GRADES;
    case "trad":
      return TRAD_GRADES;
  }
}

export function gradeIndex(grade: string, type: ClimbingType): number {
  const grades = getGradesForType(type);
  const i = grades.indexOf(grade);
  return i >= 0 ? i : -1;
}

export function isGradeInRange(
  climberGrade: string | undefined,
  min: string,
  max: string,
  type: ClimbingType
): boolean {
  if (climberGrade == null || climberGrade === "") return true;
  const grades = getGradesForType(type);
  const climberIdx = grades.indexOf(climberGrade);
  const minIdx = grades.indexOf(min);
  const maxIdx = grades.indexOf(max);
  if (climberIdx < 0) return true;
  if (minIdx < 0 || maxIdx < 0) return true;
  return climberIdx >= minIdx && climberIdx <= maxIdx;
}
