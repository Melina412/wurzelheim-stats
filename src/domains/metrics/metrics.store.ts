// Metrics store — simple app-level page-hit counters (no PII). SERVER-ONLY
// (uses the Redis client). Kept separate from the club domain: these aren't
// club-scoped, they're plain page analytics.

import { db } from "../../db/client.js";

// Pages we allow counting — an allowlist so /api/hit can't create arbitrary keys.
export const TRACKED_PAGES = ["landing", "generate"] as const;
export type TrackedPage = (typeof TRACKED_PAGES)[number];

const hitKey = (page: string) => `hits:${page}`;

/** +1 the hit counter for a page and return the new total. */
export async function incrHit(page: TrackedPage): Promise<number> {
  return db().incr(hitKey(page));
}

/** Current hit count for a page (0 if none). */
export async function getHit(page: string): Promise<number> {
  return (await db().get<number>(hitKey(page))) ?? 0;
}
