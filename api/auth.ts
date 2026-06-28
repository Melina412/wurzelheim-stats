// POST /api/auth — verify the master password (wizard step 1). No side effects;
// the client re-sends the password (x-master-password header) on every mutating
// call, so this is just an early "is the password right?" check.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkMasterPassword } from "../src/shared/auth.js";
import { fail } from "../src/shared/api-response.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, "method_not_allowed");
  }
  const authErr = checkMasterPassword(req);
  if (authErr) return fail(res, authErr);
  return res.status(200).json({ ok: true });
}
