// Smoke test for the Redis helper. Run: npm run test:redis
// Loads .env.local, writes a throwaway club record, reads it back, bumps the
// view counter, then deletes the test keys. Proves connectivity + read/write.

import { readFileSync } from "node:fs";
import { getRedis, setClub, getClub, incrViews } from "../src/domains/club";
import type { ClubRecord } from "../src/domains/club";
import type { Stats } from "../src/domains/stats";

// Load local secrets (.env.local). Node 22+ built-in; ignore if absent.
try {
  process.loadEnvFile(".env.local");
} catch {
  /* REDIS_URL may already be in the environment */
}

const TEST_ID = "__smoketest__";

async function main() {
  const stats = JSON.parse(readFileSync("src/data/stats.json", "utf8")) as Stats;
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
    `   Roundtrip ${roundtripOk ? "OK ✅" : "MISMATCH ❌"} (events gelesen: ${back?.stats.totals.events})`,
  );

  console.log("→ incrViews ×2 …");
  await incrViews(TEST_ID);
  const views = await incrViews(TEST_ID);
  console.log(`   views = ${views}`);

  const r = await getRedis();
  await r.del(`club:${TEST_ID}`);
  await r.del(`views:${TEST_ID}`);
  console.log("→ Testschlüssel gelöscht 🧹");

  await r.quit();
  console.log("✅ Redis-Connect + Schreiben/Lesen/Counter funktionieren.");
}

main().catch((err) => {
  console.error("❌ Test fehlgeschlagen:", err);
  process.exit(1);
});
