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

/** Remove a club's record + view counter (for re-seeding / tests). */
export async function clearClub(id: string): Promise<void> {
  await db().del(clubKey(id), viewsKey(id));
}
