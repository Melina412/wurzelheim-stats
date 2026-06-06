// Club domain — orchestration. SERVER-ONLY (writes to Redis via club.store).

import { fetchClubEvents } from "../events";
import { aggregate } from "../stats";
import { getClub, setClub } from "./club.store";
import type { ClubRecord, ColorScheme } from "./club.types";

type GenerateInput = {
  clubId: string;
  displayName: string;
  colorScheme: ColorScheme;
};

/**
 * Fetch a club's events, aggregate them anonymously, store the record in Redis,
 * and return it. Raw events live only in memory and are discarded after.
 */
export async function generateClub(input: GenerateInput): Promise<ClubRecord> {
  const events = await fetchClubEvents(input.clubId);
  if (events.length === 0) {
    throw new Error("No events found for this club");
  }

  const now = new Date();
  const stats = aggregate(events, { dataAsOf: now.toISOString().slice(0, 10) });

  const record: ClubRecord = {
    displayName: input.displayName,
    colorScheme: input.colorScheme,
    stats,
    generatedAt: now.toISOString(),
  };

  await setClub(input.clubId, record);
  return record;
}

/** Re-fetch & re-aggregate an existing club, preserving its displayName/color. */
export async function refreshClub(clubId: string): Promise<ClubRecord | null> {
  const existing = await getClub(clubId);
  if (!existing) return null;
  return generateClub({
    clubId,
    displayName: existing.displayName,
    colorScheme: existing.colorScheme,
  });
}
