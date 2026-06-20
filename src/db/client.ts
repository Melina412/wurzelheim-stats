// Infrastructure: the Redis (Upstash) client. Not domain logic — just the
// connection. Domain code (e.g. club/store) imports `db()` and runs commands.
//
// SERVER-ONLY: reads UPSTASH_REDIS_REST_URL / _TOKEN (secrets) from the env.
// Never import from client code — the token must not reach the browser, and the
// process.env reference would break the Vite build anyway (loud safety net).

import { Redis } from "@upstash/redis";

let client: Redis | null = null;

/**
 * Lazily-created, reused Upstash Redis client (HTTP/REST — stateless, ideal for
 * serverless: no connection pool, no connect/quit). Reads env on first use.
 */
export function db(): Redis {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set",
    );
  }
  client = new Redis({ url, token });
  return client;
}
