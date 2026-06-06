// Events domain — access to the cmpf-tools data source.

import type { RawEvent } from "./events.types";

const CMPF_BASE = "https://cmpf-tools.de/api";
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Extract a club UUID from raw input — accepts a plain UUID or any URL that
 * contains one (cmpf-tools link, Campfire link, …). Returns null if none found.
 */
export function parseClubId(input: string): string | null {
  const match = input.trim().match(UUID_RE);
  return match ? match[0].toLowerCase() : null;
}

/** Fetch a club's events (with check-ins) from cmpf-tools. Throws on failure. */
export async function fetchClubEvents(clubId: string): Promise<RawEvent[]> {
  const res = await fetch(`${CMPF_BASE}/clubs/${clubId}/events`);
  if (!res.ok) {
    throw new Error(
      `cmpf-tools returned HTTP ${res.status} for club ${clubId}`,
    );
  }
  const data = (await res.json()) as RawEvent[];
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response shape from cmpf-tools");
  }
  return data;
}

/** Look up the club an event belongs to (cmpf-tools event endpoint → club.id). */
async function fetchClubIdFromEvent(eventId: string): Promise<string> {
  const res = await fetch(`${CMPF_BASE}/events?events=${eventId}`);
  if (!res.ok) {
    throw new Error(
      `cmpf-tools returned HTTP ${res.status} for event ${eventId}`,
    );
  }
  const data = (await res.json()) as { club?: { id?: string } }[];
  const clubId = data?.[0]?.club?.id;
  if (!clubId) throw new Error("Could not resolve club from event link");
  return clubId;
}

/**
 * Resolve a club id from arbitrary user input:
 *  - an Event/Meetup link  → look up the event and return its club.id
 *  - a club link / raw UUID → use directly
 * Returns null if no UUID can be found. May throw on network failure.
 */
export async function resolveClubId(input: string): Promise<string | null> {
  const id = parseClubId(input);
  if (!id) return null;
  if (/meetup|event/i.test(input)) return fetchClubIdFromEvent(id);
  return id;
}
