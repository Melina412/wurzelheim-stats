// POST /api/hit { page } — increment a page-hit counter. No auth (public,
// no PII). Only counts real production traffic; dev/preview just read the value.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  incrHit,
  getHit,
  TRACKED_PAGES,
  type TrackedPage,
} from "../src/domains/metrics/index.js";
import { fail, failFromError } from "../src/shared/api-response.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, "method_not_allowed");
  }

  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : (req.body ?? {});
  const page = String(body.page ?? "");
  if (!(TRACKED_PAGES as readonly string[]).includes(page)) {
    return fail(res, "invalid_input");
  }

  try {
    const hits =
      process.env.VERCEL_ENV === "production"
        ? await incrHit(page as TrackedPage)
        : await getHit(page);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, hits });
  } catch (err) {
    return failFromError(res, err, "hit");
  }
}
