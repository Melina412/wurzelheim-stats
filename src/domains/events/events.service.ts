// Events domain — access to the cmpf-tools data source.

import { ServiceError } from "../../shared/api-errors.js";
import type { RawEvent } from "./events.types.js";

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
  // 404 = cmpf-tools has no events indexed for this club (valid id, no data) —
  // a "no_events" case, not an outage.
  if (res.status === 404) {
    throw new ServiceError("no_events");
  }
  if (!res.ok) {
    throw new ServiceError("upstream_error");
  }
  const data = (await res.json()) as RawEvent[];
  if (!Array.isArray(data)) {
    throw new ServiceError("upstream_error");
  }
  return data;
}

/**
 * Look up the club an event belongs to via the lightweight cmpf-tools event
 * endpoint (a few KB — unlike the full events list). Returns id + name.
 */
async function fetchClubFromEvent(
  eventId: string,
): Promise<{ id: string; name: string }> {
  const res = await fetch(`${CMPF_BASE}/events?events=${eventId}`);
  if (!res.ok) {
    throw new ServiceError("upstream_error");
  }
  const data = (await res.json()) as {
    club?: { id?: string; name?: string };
  }[];
  const club = data?.[0]?.club;
  // Valid response but no club → the event link/id is wrong (user input fault).
  if (!club?.id) throw new ServiceError("invalid_input");
  return { id: club.id, name: club.name ?? "" };
}

// Campfire's "Share" button produces a cmpf.re shortlink (no UUID in it). It
// HTTP-redirects to the real meetup URL, so we follow it to read the final URL.
const SHORTLINK_RE = /^https?:\/\/(www\.)?cmpf\.re\//i;

/** Follow a shortlink's redirects and return the final URL (body discarded). */
async function resolveShortlink(url: string): Promise<string> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    res.body?.cancel?.().catch(() => {});
    return res.url || url;
  } catch {
    throw new ServiceError("upstream_error");
  }
}

/**
 * Resolve arbitrary user input to a club id (+ name when cheaply available):
 *  - a cmpf.re shortlink    → follow the redirect to the real meetup URL first
 *  - an Event/Meetup link   → look up the event → club.id + club.name
 *  - a club link / raw UUID → use the id directly; name is unknown (null) since
 *    the only club endpoint is the multi-MB events list (too costly for preview)
 * Returns null if no UUID can be found. May throw on network failure.
 */
export async function resolveClub(
  input: string,
): Promise<{ clubId: string; clubName: string | null } | null> {
  let source = input.trim();
  let id = parseClubId(source);

  // No UUID yet but it's a cmpf.re shortlink → follow it to the real URL.
  if (!id && SHORTLINK_RE.test(source)) {
    source = await resolveShortlink(source);
    id = parseClubId(source);
  }
  if (!id) return null;

  if (/meetup|event/i.test(source)) {
    const club = await fetchClubFromEvent(id);
    return { clubId: club.id, clubName: club.name || null };
  }
  return { clubId: id, clubName: null };
}

/** Resolve user input to just the club id (used by /generate). */
export async function resolveClubId(input: string): Promise<string | null> {
  const resolved = await resolveClub(input);
  return resolved?.clubId ?? null;
}
