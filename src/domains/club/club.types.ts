// Club domain — the shareable, stored club record.

import type { Stats } from "../stats/index.js";

export const COLOR_SCHEMES = [
  "green",
  "blue",
  "red",
  "amber",
  "purple",
] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

// What we store per club in Redis (anonymous — stats contain no usernames).
export type ClubRecord = {
  displayName: string;
  colorScheme: ColorScheme;
  stats: Stats;
  generatedAt: string; // ISO timestamp of last aggregation
};
