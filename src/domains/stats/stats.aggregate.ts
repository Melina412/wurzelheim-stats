// Pure aggregation: raw Campfire events -> lean, anonymous stats.
// No filesystem / network — usable by the build script AND the serverless function.

import type { RawEvent } from "../events/index.js";
import type {
  EventEntry,
  EventTypeKey,
  LoyaltyTierKey,
  Stats,
} from "./stats.types.js";

// --- Event type categorisation (priority order: most specific first) ---
// `type` is a stable i18n key — the UI translates it (de.json/en.json → eventTypes.*).
const TYPE_RULES: { type: EventTypeKey; re: RegExp }[] = [
  { type: "communityDay", re: /community.?day|communityday|\bcd\b/i },
  {
    type: "maxDynamax",
    re: /gigamax|gigadynamax|dynamax|dyna[- ]|max[- ]kampf|max[- ]montag/i,
  },
  { type: "raids", re: /raid/i },
  { type: "trade", re: /tausch/i },
  { type: "spotlight", re: /rampenlicht|spotlight/i },
  { type: "research", re: /forschung|schlüpftag|hatch/i },
  { type: "goFestTour", re: /go.?fest|gofest|go.?tour/i },
  { type: "wildArea", re: /naturzone/i },
];

function classify(name: string): EventTypeKey {
  for (const rule of TYPE_RULES) if (rule.re.test(name)) return rule.type;
  return "other";
}

type Enriched = EventEntry & { memberIds: string[] };

export function aggregate(
  events: RawEvent[],
  opts: { dataAsOf: string },
): Stats {
  // --- Per-event derived numbers ---
  const enriched: Enriched[] = events.map((e) => {
    const members = e.members ?? [];
    const checkIns = members.filter(
      (m) => m.rsvp_status === "CHECKED_IN",
    ).length;
    return {
      id: e.id,
      name: e.name,
      date: e.time,
      address: e.address || "",
      rsvps: members.length,
      checkIns,
      accepted: members.filter((m) => m.rsvp_status === "ACCEPTED").length,
      declined: members.filter((m) => m.rsvp_status === "DECLINED").length,
      type: classify(e.name),
      memberIds: members.map((m) => m.id),
    };
  });

  // sort chronologically
  enriched.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // --- Totals ---
  const allRsvps = enriched.reduce((s, e) => s + e.rsvps, 0);
  const totalCheckIns = enriched.reduce((s, e) => s + e.checkIns, 0);
  const totalAccepted = enriched.reduce((s, e) => s + e.accepted, 0);
  const totalDeclined = enriched.reduce((s, e) => s + e.declined, 0);

  const uniqueParticipants = new Set<string>();
  for (const e of enriched)
    for (const id of e.memberIds) uniqueParticipants.add(id);

  // --- Monthly series with cumulative unique participants ---
  const seenIds = new Set<string>();
  const monthlyMap = new Map<
    string,
    {
      month: string;
      events: number;
      checkIns: number;
      rsvps: number;
      newParticipants: number;
    }
  >();
  for (const e of enriched) {
    const month = e.date.slice(0, 7);
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, {
        month,
        events: 0,
        checkIns: 0,
        rsvps: 0,
        newParticipants: 0,
      });
    }
    const b = monthlyMap.get(month)!;
    b.events += 1;
    b.checkIns += e.checkIns;
    b.rsvps += e.rsvps;
    for (const id of e.memberIds) {
      if (!seenIds.has(id)) {
        seenIds.add(id);
        b.newParticipants += 1;
      }
    }
  }
  let cumulative = 0;
  const monthly = [...monthlyMap.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((b) => {
      cumulative += b.newParticipants;
      return { ...b, cumulativeParticipants: cumulative };
    });

  // EventEntry without the internal memberIds field (same key order as before).
  const toEntry = (e: Enriched): EventEntry => ({
    id: e.id,
    name: e.name,
    date: e.date,
    address: e.address,
    rsvps: e.rsvps,
    checkIns: e.checkIns,
    accepted: e.accepted,
    declined: e.declined,
    type: e.type,
  });

  // --- Top events by check-ins ---
  const topEvents: EventEntry[] = [...enriched]
    .sort((a, b) => b.checkIns - a.checkIns)
    .slice(0, 12)
    .map(toEntry);

  // --- Event types ---
  const typeMap = new Map<
    EventTypeKey,
    { type: EventTypeKey; count: number; checkIns: number }
  >();
  for (const e of enriched) {
    if (!typeMap.has(e.type))
      typeMap.set(e.type, { type: e.type, count: 0, checkIns: 0 });
    const t = typeMap.get(e.type)!;
    t.count += 1;
    t.checkIns += e.checkIns;
  }
  const eventTypes = [...typeMap.values()]
    .map((t) => ({ ...t, avgCheckIns: Math.round(t.checkIns / t.count) }))
    .sort((a, b) => b.count - a.count);

  // --- Loyalty tiers (ANONYMOUS — no names/ids in the output) ---
  const ACTIVE_THRESHOLD = 5; // < this = casual / tourist, not an "active member"
  const visitsById = new Map<string, number>();
  for (const e of events) {
    for (const m of e.members ?? []) {
      if (m.rsvp_status !== "CHECKED_IN") continue;
      visitsById.set(m.id, (visitsById.get(m.id) ?? 0) + 1);
    }
  }
  const visitCounts = [...visitsById.values()].sort((a, b) => b - a);
  const everCheckedIn = visitCounts.length;
  const atLeast = (t: number) => visitCounts.filter((c) => c >= t).length;

  const TIERS = (
    [
      { key: "intro", range: "1", lo: 1, hi: 1, casual: true },
      { key: "casual", range: "2–4", lo: 2, hi: 4, casual: true },
      { key: "regular", range: "5–14", lo: 5, hi: 14 },
      { key: "core", range: "15–49", lo: 15, hi: 49 },
      { key: "hardcore", range: "50–99", lo: 50, hi: 99 },
      { key: "legend", range: "100+", lo: 100, hi: Infinity },
    ] as {
      key: LoyaltyTierKey;
      range: string;
      lo: number;
      hi: number;
      casual?: boolean;
    }[]
  ).map((t) => ({
    key: t.key,
    range: t.range,
    casual: !!t.casual,
    people: visitCounts.filter((c) => c >= t.lo && c <= t.hi).length,
  }));

  const activeCounts = visitCounts.filter((c) => c >= ACTIVE_THRESHOLD);
  const loyalty = {
    everCheckedIn,
    activeThreshold: ACTIVE_THRESHOLD,
    activeMembers: activeCounts.length,
    medianActive: activeCounts[Math.floor(activeCounts.length / 2)] ?? 0,
    avgActive: +(
      activeCounts.reduce((s, n) => s + n, 0) / (activeCounts.length || 1)
    ).toFixed(1),
    tiers: TIERS,
    elite: {
      atLeast50: atLeast(50),
      atLeast100: atLeast(100),
      atLeast150: atLeast(150),
    },
  };

  // --- Top locations ---
  const locMap = new Map<
    string,
    { address: string; count: number; checkIns: number }
  >();
  for (const e of enriched) {
    if (!e.address) continue;
    if (!locMap.has(e.address))
      locMap.set(e.address, { address: e.address, count: 0, checkIns: 0 });
    const l = locMap.get(e.address)!;
    l.count += 1;
    l.checkIns += e.checkIns;
  }
  const topLocations = [...locMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // --- Club info ---
  const club = events[0]?.club ?? {};

  return {
    generatedFrom: events.length + " events",
    dataAsOf: opts.dataAsOf,
    club: {
      name: club.name ?? "Wurzelheim Alexanderplatz",
    },
    totals: {
      events: events.length,
      uniqueParticipants: uniqueParticipants.size,
      totalRsvps: allRsvps,
      totalCheckIns,
      totalAccepted,
      totalDeclined,
      avgCheckInsPerEvent: Math.round(totalCheckIns / events.length),
      checkInRate: +(totalCheckIns / allRsvps).toFixed(3),
      firstEventDate: enriched[0]?.date,
      lastEventDate: enriched[enriched.length - 1]?.date,
      biggestEvent: topEvents[0],
      firstEvent: toEntry(enriched[0]),
    },
    monthly,
    topEvents,
    eventTypes,
    loyalty,
    topLocations,
  };
}
