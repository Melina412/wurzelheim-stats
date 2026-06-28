// POST /api/clubs/preview — master-PW gated. Resolves user input (club id or
// event link) to a club id, plus the club name when it's cheaply available
// (event-link path). Does NOT fetch the full events list and does NOT store
// anything — it just lets the wizard confirm the right club before generating.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveClub } from "../../src/domains/events/index.js";
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

  try {
    const resolved = await resolveClub(input);
    if (!resolved) return fail(res, "invalid_input");
    return res.status(200).json({
      ok: true,
      clubId: resolved.clubId,
      clubName: resolved.clubName,
    });
  } catch (err) {
    return failFromError(res, err, "preview");
  }
}
