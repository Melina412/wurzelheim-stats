// Club domain — orchestration. SERVER-ONLY (writes to Redis via club.store).

import { fetchClubEvents } from "../events/index.js";
import { aggregate } from "../stats/index.js";
import { ServiceError } from "../../shared/api-errors.js";
import { getClub, setClub } from "./club.store.js";
import type { ClubRecord, ColorScheme } from "./club.types.js";

type GenerateInput = {
  clubId: string;
  displayName: string;
  colorScheme: ColorScheme;
};

// A club may be (re)generated at most once per this window. No auto-refresh —
// data is generated on demand via the UI and then stays as-is.
const COOLDOWN_DAYS = 7;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

/**
 * Fetch a club's events, aggregate them anonymously, store the record in Redis,
 * and return it. Raw events live only in memory and are discarded after.
 *
 * Enforces a per-club cooldown: if the club was generated less than
 * COOLDOWN_DAYS ago, throws ServiceError("rate_limited", retryAfterMs).
 */
export async function generateClub(input: GenerateInput): Promise<ClubRecord> {
  const existing = await getClub(input.clubId);
  if (existing) {
    const age = Date.now() - new Date(existing.generatedAt).getTime();
    if (age < COOLDOWN_MS) {
      throw new ServiceError("rate_limited", COOLDOWN_MS - age);
    }
  }

  const events = await fetchClubEvents(input.clubId);
  if (events.length === 0) {
    throw new ServiceError("no_events");
  }

  const now = new Date();
  const stats = aggregate(events, { dataAsOf: now.toISOString().slice(0, 10) });

  const record: ClubRecord = {
    // Fall back to the club name detected in the event data when no display
    // name was provided (e.g. the user entered a raw club id, not an event link).
    displayName: input.displayName.trim() || stats.club.name,
    colorScheme: input.colorScheme,
    stats,
    generatedAt: now.toISOString(),
  };

  await setClub(input.clubId, record);
  return record;
}
