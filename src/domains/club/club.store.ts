// Club store — the only place that talks to Redis. Read/write the per-club
// record and the anonymous view counter.
//
// SERVER-ONLY: reads REDIS_URL from the environment and uses node-redis (Node
// built-ins). Only ever imported by api/ handlers — never from client code in
// src/components or src/pages. (An accidental client import breaks the Vite
// build loudly, which is the safety net we want.)

import { createClient, type RedisClientType } from "redis";
import type { ClubRecord } from "./club.types";

// node-redis 6 has self-inconsistent generics: createClient() infers a
// RESP3-specific type, while RedisClientType is the broad default. We pin the
// type to whatever .connect() actually resolves to, so everything lines up.
type RedisClient = Awaited<ReturnType<RedisClientType["connect"]>>;

function makeClient(): RedisClientType {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  const client = createClient({ url });
  client.on("error", (err) => console.error("[redis] client error:", err));
  return client as unknown as RedisClientType;
}

// Reused across warm serverless invocations (avoids reconnecting every call).
let clientPromise: Promise<RedisClient> | null = null;

export function getRedis(): Promise<RedisClient> {
  if (clientPromise) return clientPromise;
  const p = makeClient().connect();
  clientPromise = p;
  // Best-effort reset on failure so the next call retries with a fresh connection.
  p.catch(() => {
    clientPromise = null;
  });
  return p;
}

const clubKey = (id: string) => `club:${id}`;
const viewsKey = (id: string) => `views:${id}`;

/** Read a club's stored record, or null if it was never generated. */
export async function getClub(id: string): Promise<ClubRecord | null> {
  const r = await getRedis();
  const raw = await r.get(clubKey(id));
  return raw ? (JSON.parse(raw) as ClubRecord) : null;
}

/** Store/overwrite a club's record (anonymous stats + display config). */
export async function setClub(id: string, record: ClubRecord): Promise<void> {
  const r = await getRedis();
  await r.set(clubKey(id), JSON.stringify(record));
}

/** Anonymous page-view counter (no PII): +1 and return the new total. */
export async function incrViews(id: string): Promise<number> {
  const r = await getRedis();
  return r.incr(viewsKey(id));
}

/** Current view count for a club (0 if none). */
export async function getViews(id: string): Promise<number> {
  const r = await getRedis();
  const v = await r.get(viewsKey(id));
  return v ? Number(v) : 0;
}
