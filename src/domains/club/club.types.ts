// Club domain — the shareable, stored club record.

import type { Stats } from "../stats";

export type ColorScheme = "green" | "blue" | "red" | "amber" | "purple";

// What we store per club in Redis (anonymous — stats contain no usernames).
export type ClubRecord = {
  displayName: string;
  colorScheme: ColorScheme;
  stats: Stats;
  generatedAt: string; // ISO timestamp of last aggregation
};
