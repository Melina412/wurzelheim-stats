// Print all stored clubs with their view + generation counts. Read-only.
// Usage: npm run stats   (loads .env.local for the Upstash credentials)

import {
  listClubIds,
  getClub,
  getViews,
  getGenerations,
} from "../src/domains/club";
import { getHit, TRACKED_PAGES } from "../src/domains/metrics";

// Load local secrets (.env.local). Node 22+ built-in; ignore if absent.
try {
  process.loadEnvFile(".env.local");
} catch {
  /* env may already be set */
}

async function main() {
  const ids = await listClubIds();

  if (ids.length === 0) {
    console.log("\nNo clubs stored yet.");
  } else {
    const rows = await Promise.all(
      ids.map(async (id) => {
        const [record, views, generations] = await Promise.all([
          getClub(id),
          getViews(id),
          getGenerations(id),
        ]);
        return {
          id,
          name: record?.displayName ?? "(no record — reset)",
          views,
          generations,
          date: record?.generatedAt?.slice(0, 10) ?? "—",
        };
      }),
    );

    rows.sort((a, b) => b.views - a.views);

    let totalViews = 0;
    let totalGen = 0;
    console.log(`\n${rows.length} club(s):\n`);
    for (const r of rows) {
      totalViews += r.views;
      totalGen += r.generations;
      console.log(
        `  ${String(r.views).padStart(6)} views · ${String(r.generations).padStart(3)} gen · ${r.date}  ${r.name}`,
      );
      console.log(`         ${r.id}`);
    }
    console.log(
      `\n  Σ ${totalViews} views · ${totalGen} generations · ${rows.length} club(s)`,
    );
  }

  // App-level page hits (landing / generate)
  const hits = await Promise.all(TRACKED_PAGES.map((p) => getHit(p)));
  console.log("\nPages:\n");
  TRACKED_PAGES.forEach((page, i) => {
    console.log(`  ${String(hits[i]).padStart(6)} hits · ${page}`);
  });
  console.log("");
}

main().catch((err) => {
  console.error("❌ stats failed:", err?.code ?? err);
  process.exit(1);
});
