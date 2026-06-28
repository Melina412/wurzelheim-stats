// Reset a club's generate cooldown by deleting its stored record + view counter.
// Use this so a club can be (re)generated immediately during testing.
//
// Usage: npm run reset:club -- <club-id | cmpf.re link | event link>
// Loads .env.local for the Upstash credentials.

import { resolveClub } from "../src/domains/events";
import { getClub, getViews, clearClubRecord } from "../src/domains/club";

// Load local secrets (.env.local). Node 22+ built-in; ignore if absent.
try {
  process.loadEnvFile(".env.local");
} catch {
  /* env may already be set */
}

async function main(input: string) {
  const resolved = await resolveClub(input);
  if (!resolved) {
    console.error(`❌ Could not read a club ID from "${input}".`);
    process.exit(1);
  }

  const { clubId } = resolved;
  const existing = await getClub(clubId);
  if (!existing) {
    console.log(
      `ℹ️  Nothing stored for ${clubId} — cooldown is already clear.`,
    );
    return;
  }

  const views = await getViews(clubId);
  await clearClubRecord(clubId);
  console.log(`🧹 Reset: "${existing.displayName}" (${clubId})`);
  console.log(`   Cooldown cleared — ${views} views kept.`);
  console.log(
    "   → Regenerate in the wizard; the view counter keeps counting.",
  );
}

const input = process.argv[2];
if (!input) {
  console.error(
    "Usage: npm run reset:club -- <club-id | cmpf.re link | event link>",
  );
  process.exit(1);
}

main(input).catch((err) => {
  console.error("❌ Reset failed:", err?.code ?? err);
  process.exit(1);
});
