// Aggregates the raw Campfire events dump into a small stats.json for the frontend.
// Usage: node scripts/aggregate.mjs
// Input:  data/events_raw.json   (raw API dump)
// Output: src/data/stats.json    (aggregated insights)

import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const rawPath = join(root, "data/events_raw.json");
const events = JSON.parse(readFileSync(rawPath, "utf8"));

// "Stand der Daten" = Änderungsdatum der Rohdaten (wird beim Neu-Ziehen aktuell).
const dataAsOf = statSync(rawPath).mtime.toISOString().slice(0, 10);

// --- Event type categorisation (priority order: most specific first) ---
const TYPE_RULES = [
  { type: "Community Day", re: /community.?day|communityday|\bcd\b/i },
  { type: "Max & Dynamax", re: /gigamax|gigadynamax|dynamax|dyna[- ]|max[- ]kampf|max[- ]montag/i },
  { type: "Raids", re: /raid/i },
  { type: "Tausch", re: /tausch/i },
  { type: "Rampenlicht-Stunde", re: /rampenlicht|spotlight/i },
  { type: "Forschung & Schlüpftag", re: /forschung|schlüpftag|hatch/i },
  { type: "GO Fest & Tour", re: /go.?fest|gofest|go.?tour/i },
  { type: "Naturzone", re: /naturzone/i },
];

function classify(name) {
  for (const rule of TYPE_RULES) if (rule.re.test(name)) return rule.type;
  return "Sonstiges";
}

const STATUS = (m) => m.rsvp_status;
const attended = (m) => m.rsvp_status === "CHECKED_IN";

// --- Per-event derived numbers ---
const enriched = events.map((e) => {
  const members = e.members ?? [];
  const checkIns = members.filter(attended).length;
  return {
    id: e.id,
    name: e.name,
    date: e.time,
    address: e.address || "",
    rsvps: members.length,
    checkIns,
    accepted: members.filter((m) => STATUS(m) === "ACCEPTED").length,
    declined: members.filter((m) => STATUS(m) === "DECLINED").length,
    type: classify(e.name),
    memberIds: members.map((m) => m.id),
  };
});

// sort chronologically
enriched.sort((a, b) => new Date(a.date) - new Date(b.date));

// --- Totals ---
const allRsvps = enriched.reduce((s, e) => s + e.rsvps, 0);
const totalCheckIns = enriched.reduce((s, e) => s + e.checkIns, 0);
const totalAccepted = enriched.reduce((s, e) => s + e.accepted, 0);
const totalDeclined = enriched.reduce((s, e) => s + e.declined, 0);

const uniqueParticipants = new Set();
for (const e of enriched) for (const id of e.memberIds) uniqueParticipants.add(id);

// --- Monthly series with cumulative unique participants ---
const seenIds = new Set();
const monthlyMap = new Map(); // "YYYY-MM" -> bucket
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
  const b = monthlyMap.get(month);
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

// --- Top events by check-ins ---
const topEvents = [...enriched]
  .sort((a, b) => b.checkIns - a.checkIns)
  .slice(0, 12)
  .map(({ memberIds, ...rest }) => rest);

// --- Event types ---
const typeMap = new Map();
for (const e of enriched) {
  if (!typeMap.has(e.type))
    typeMap.set(e.type, { type: e.type, count: 0, checkIns: 0 });
  const t = typeMap.get(e.type);
  t.count += 1;
  t.checkIns += e.checkIns;
}
const eventTypes = [...typeMap.values()]
  .map((t) => ({ ...t, avgCheckIns: Math.round(t.checkIns / t.count) }))
  .sort((a, b) => b.count - a.count);

// --- Loyalty tiers (ANONYMOUS — no names/ids leave this script) ---
// Count how many distinct events each person actually CHECKED IN to.
const ACTIVE_THRESHOLD = 5; // < this = casual / tourist, not an "active member"
const visitsById = new Map(); // id -> # events checked into
for (const e of events) {
  for (const m of e.members ?? []) {
    if (m.rsvp_status !== "CHECKED_IN") continue;
    visitsById.set(m.id, (visitsById.get(m.id) ?? 0) + 1);
  }
}
const visitCounts = [...visitsById.values()].sort((a, b) => b - a);
const everCheckedIn = visitCounts.length;
const atLeast = (t) => visitCounts.filter((c) => c >= t).length;

// Tiers by absolute check-in count (more intuitive & honest than percentiles).
const TIERS = [
  { label: "Reingeschnuppert", range: "1", lo: 1, hi: 1, casual: true },
  { label: "Gelegenheits-Gäste", range: "2–4", lo: 2, hi: 4, casual: true },
  { label: "Stammtrainer:innen", range: "5–14", lo: 5, hi: 14 },
  { label: "Vereinsherz", range: "15–49", lo: 15, hi: 49 },
  { label: "Hardcore-Crew", range: "50–99", lo: 50, hi: 99 },
  { label: "Die Legenden", range: "100+", lo: 100, hi: Infinity },
].map((t) => ({
  label: t.label,
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
  elite: { atLeast50: atLeast(50), atLeast100: atLeast(100), atLeast150: atLeast(150) },
};

// --- Top locations ---
const locMap = new Map();
for (const e of enriched) {
  if (!e.address) continue;
  if (!locMap.has(e.address))
    locMap.set(e.address, { address: e.address, count: 0, checkIns: 0 });
  const l = locMap.get(e.address);
  l.count += 1;
  l.checkIns += e.checkIns;
}
const topLocations = [...locMap.values()]
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

// --- Club info ---
const club = events[0]?.club ?? {};

const stats = {
  generatedFrom: events.length + " events",
  dataAsOf,
  club: {
    name: club.name ?? "Wurzelheim Alexanderplatz",
    avatarUrl: club.avatar_url ?? "",
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
    firstEvent: (({ memberIds, ...r }) => r)(enriched[0]),
  },
  monthly,
  topEvents,
  eventTypes,
  loyalty,
  topLocations,
};

mkdirSync(join(root, "src/data"), { recursive: true });
writeFileSync(
  join(root, "src/data/stats.json"),
  JSON.stringify(stats, null, 2),
);

console.log("✓ stats.json written");
console.log(
  `  ${stats.totals.events} events · ${stats.totals.uniqueParticipants} unique · ${stats.totals.totalCheckIns} check-ins`,
);
console.log(`  ${monthly.length} months · ${eventTypes.length} event types`);
console.log("  types:", eventTypes.map((t) => `${t.type}(${t.count})`).join(", "));
