// Aggregates the raw Campfire events dump into a small stats.json for the frontend.
// Usage: npm run aggregate   (runs via tsx)
// Input:  data/events_raw.json   (raw API dump)
// Output: src/data/stats.json    (aggregated insights)

import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { aggregate } from "../src/domains/stats";
import type { RawEvent } from "../src/domains/events";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const rawPath = join(root, "data/events_raw.json");
const events: RawEvent[] = JSON.parse(readFileSync(rawPath, "utf8"));

// "Stand der Daten" = Änderungsdatum der Rohdaten (wird beim Neu-Ziehen aktuell).
const dataAsOf = statSync(rawPath).mtime.toISOString().slice(0, 10);

const stats = aggregate(events, { dataAsOf });

mkdirSync(join(root, "src/data"), { recursive: true });
writeFileSync(
  join(root, "src/data/stats.json"),
  JSON.stringify(stats, null, 2),
);

console.log("✓ stats.json written");
console.log(
  `  ${stats.totals.events} events · ${stats.totals.uniqueParticipants} unique · ${stats.totals.totalCheckIns} check-ins`,
);
console.log(
  `  ${stats.monthly.length} months · ${stats.eventTypes.length} event types`,
);
console.log(
  "  types:",
  stats.eventTypes.map((t) => `${t.type}(${t.count})`).join(", "),
);
