// GET /api/clubs/stats?club=<id> — thin handler. Reads a generated club from
// Redis and returns its (anonymous) record + view count. No master-pw (public
// read). Errors are stable codes (see src/shared/api-errors).
//
// Note: intentionally NOT edge-cached. Stats reads are cheap Redis reads (the
// expensive 5 MB cmpf-tools fetch only happens in /generate). Skipping the edge
// cache keeps the anonymous view counter accurate (a cached response would not
// re-invoke the function, so views would undercount).

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseClubId } from "../../src/domains/events/index.js";
import { getClub, incrViews } from "../../src/domains/club/index.js";
import { fail } from "../../src/shared/api-response.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return fail(res, "method_not_allowed");
  }

  const raw = req.query.club;
  const clubParam = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const clubId = parseClubId(String(clubParam));
  if (!clubId) return fail(res, "invalid_input");

  try {
    const record = await getClub(clubId);
    if (!record) return fail(res, "club_not_generated");

    const views = await incrViews(clubId);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ...record, views });
  } catch (err) {
    console.error("[stats] failed:", err);
    return fail(res, "server_error");
  }
}
