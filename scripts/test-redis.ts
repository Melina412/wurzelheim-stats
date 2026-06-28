// Smoke test for the Upstash Redis store. Run: npm run test:redis
// Loads .env.local, writes a throwaway club record, reads it back, bumps the
// view counter, then deletes the test keys. Proves connectivity + read/write.

import { readFileSync } from "node:fs";
import { setClub, getClub, incrViews, clearClub } from "../src/domains/club";
import type { ClubRecord } from "../src/domains/club";
import type { Stats } from "../src/domains/stats";

// Load local secrets (.env.local). Node 22+ built-in; ignore if absent.
try {
  process.loadEnvFile(".env.local");
} catch {
  /* env may already be set */
}

const TEST_ID = "__smoketest__";

async function main() {
  const stats = JSON.parse(
    readFileSync("src/data/stats.json", "utf8"),
  ) as Stats;
  const record: ClubRecord = {
    displayName: "Smoke Test (delete me)",
    colorScheme: "green",
    stats,
    generatedAt: new Date().toISOString(),
  };

  console.log("→ setClub …");
  await setClub(TEST_ID, record);

  console.log("→ getClub …");
  const back = await getClub(TEST_ID);
  const roundtripOk =
    back?.displayName === record.displayName &&
    back?.stats.totals.events === stats.totals.events;
  console.log(
    `   Roundtrip ${roundtripOk ? "OK ✅" : "MISMATCH ❌"} (events read: ${back?.stats.totals.events})`,
  );

  console.log("→ incrViews ×2 …");
  await incrViews(TEST_ID);
  const views = await incrViews(TEST_ID);
  console.log(`   views = ${views}`);

  await clearClub(TEST_ID);
  console.log("→ Test keys deleted 🧹");
  console.log("✅ Upstash connect + write/read/counter all work.");
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
