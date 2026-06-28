// POST /api/clubs/generate — thin handler. Master-PW gated. All logic lives in
// the domain services; this file only does HTTP plumbing + validation.
// Errors are returned as stable codes (see src/shared/api-errors) — the client
// translates them.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveClubId } from "../../src/domains/events/index.js";
import { generateClub, COLOR_SCHEMES } from "../../src/domains/club/index.js";
import type { ColorScheme } from "../../src/domains/club/index.js";
import { checkMasterPassword } from "../../src/shared/auth.js";
import { fail, failFromError } from "../../src/shared/api-response.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, "method_not_allowed");
  }

  const authErr = checkMasterPassword(req);
  if (authErr) return fail(res, authErr);

  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : (req.body ?? {});

  const input = String(body.club ?? "");
  // Optional — if blank, the service falls back to the detected club name.
  const displayName = String(body.displayName ?? "").trim();
  const colorScheme = String(body.colorScheme ?? "");

  if (displayName.length > 60) return fail(res, "invalid_input");
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
    return failFromError(res, err, "generate");
  }
}
