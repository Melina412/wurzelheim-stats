// Club store — club-specific persistence (the club record + anonymous view
// counter). Uses the shared Redis client from src/db; contains no connection
// logic itself.
//
// SERVER-ONLY: depends on the Redis client (secret env vars). Never imported by
// client code in src/components or src/pages.

import { db } from "../../db/client.js";
import type { ClubRecord } from "./club.types.js";

const clubKey = (id: string) => `club:${id}`;
const viewsKey = (id: string) => `views:${id}`;
const genKey = (id: string) => `gen:${id}`;

/** Read a club's stored record, or null if it was never generated. */
export async function getClub(id: string): Promise<ClubRecord | null> {
  // @upstash/redis auto-deserialises JSON → returns the object directly.
  return (await db().get<ClubRecord>(clubKey(id))) ?? null;
}

/** Store/overwrite a club's record (anonymous stats + display config). */
export async function setClub(id: string, record: ClubRecord): Promise<void> {
  await db().set(clubKey(id), record);
}

/** Anonymous page-view counter (no PII): +1 and return the new total. */
export async function incrViews(id: string): Promise<number> {
  return db().incr(viewsKey(id));
}

/** Current view count for a club (0 if none). */
export async function getViews(id: string): Promise<number> {
  return (await db().get<number>(viewsKey(id))) ?? 0;
}

/** Count a (successful) generation for a club: +1 and return the new total. */
export async function incrGenerations(id: string): Promise<number> {
  return db().incr(genKey(id));
}

/** How often a club has been generated (0 if never). Survives cooldown resets. */
export async function getGenerations(id: string): Promise<number> {
  return (await db().get<number>(genKey(id))) ?? 0;
}

/**
 * All club ids we have any data for — scans record / views / generation keys
 * and merges them (a reset club keeps views+gen but no record). For admin/stats.
 */
export async function listClubIds(): Promise<string[]> {
  const ids = new Set<string>();
  for (const prefix of ["club:", "views:", "gen:"]) {
    let cursor = 0;
    do {
      const [next, keys] = await db().scan(cursor, {
        match: `${prefix}*`,
        count: 200,
      });
      for (const key of keys) ids.add(key.slice(prefix.length));
      cursor = Number(next);
    } while (cursor !== 0);
  }
  return [...ids];
}

/** Remove a club's record + view counter (for re-seeding / tests). */
export async function clearClub(id: string): Promise<void> {
  await db().del(clubKey(id), viewsKey(id));
}

/**
 * Remove only the club record — resets the generate cooldown while KEEPING the
 * view counter. After re-generating, the same counter keeps counting.
 */
export async function clearClubRecord(id: string): Promise<void> {
  await db().del(clubKey(id));
}
