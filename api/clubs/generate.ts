// POST /api/clubs/generate — thin handler. Master-PW gated. All logic lives in
// the domain services; this file only does HTTP plumbing + validation.
// Errors are returned as stable codes (see src/shared/api-errors) — the client
// translates them.

import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveClubId } from "../../src/domains/events";
import { generateClub, COLOR_SCHEMES } from "../../src/domains/club";
import type { ColorScheme } from "../../src/domains/club";
import { ServiceError } from "../../src/shared/api-errors";
import { fail } from "../../src/shared/api-response";

// Constant-time string compare (avoids timing attacks on the master password).
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, "method_not_allowed");
  }

  const expected = process.env.MASTER_PW;
  if (!expected) return fail(res, "server_misconfigured");

  const header = req.headers["x-master-password"];
  const provided = Array.isArray(header) ? header[0] : (header ?? "");
  if (!safeEqual(provided, expected)) return fail(res, "unauthorized");

  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : (req.body ?? {});

  const input = String(body.club ?? "");
  const displayName = String(body.displayName ?? "").trim();
  const colorScheme = String(body.colorScheme ?? "");

  if (!displayName || displayName.length > 60)
    return fail(res, "invalid_input");
  if (!(COLOR_SCHEMES as readonly string[]).includes(colorScheme)) {
    return fail(res, "invalid_color");
  }

  try {
    const clubId = await resolveClubId(input);
    if (!clubId) return fail(res, "invalid_input");

    const record = await generateClub({
      clubId,
      displayName,
      colorScheme: colorScheme as ColorScheme,
    });
    return res
      .status(200)
      .json({ ok: true, clubId, generatedAt: record.generatedAt });
  } catch (err) {
    if (err instanceof ServiceError) {
      return fail(
        res,
        err.code,
        err.retryAfterMs ? { retryAfterMs: err.retryAfterMs } : undefined,
      );
    }
    console.error("[generate] failed:", err);
    return fail(res, "upstream_error");
  }
}
