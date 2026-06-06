// POST /api/clubs/generate — thin handler. Master-PW gated. All logic lives in
// the domain services; this file only does HTTP plumbing + validation.

import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveClubId } from "../../src/domains/events";
import { generateClub, COLOR_SCHEMES } from "../../src/domains/club";
import type { ColorScheme } from "../../src/domains/club";

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
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.MASTER_PW;
  if (!expected)
    return res.status(500).json({ error: "Server not configured" });

  const header = req.headers["x-master-password"];
  const provided = Array.isArray(header) ? header[0] : (header ?? "");
  if (!safeEqual(provided, expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : (req.body ?? {});

  const input = String(body.club ?? "");
  const displayName = String(body.displayName ?? "").trim();
  const colorScheme = String(body.colorScheme ?? "");

  if (!displayName || displayName.length > 60) {
    return res
      .status(400)
      .json({ error: "Ungültiger Anzeigename (1–60 Zeichen)" });
  }
  if (!(COLOR_SCHEMES as readonly string[]).includes(colorScheme)) {
    return res.status(400).json({ error: "Ungültiges Farbschema" });
  }

  try {
    const clubId = await resolveClubId(input);
    if (!clubId) {
      return res
        .status(400)
        .json({ error: "Ungültige oder fehlende Club-ID/Link" });
    }
    const record = await generateClub({
      clubId,
      displayName,
      colorScheme: colorScheme as ColorScheme,
    });
    return res
      .status(200)
      .json({ ok: true, clubId, generatedAt: record.generatedAt });
  } catch (err) {
    console.error("[generate] failed:", err);
    const msg = err instanceof Error ? err.message : "";
    if (/no events/i.test(msg)) {
      return res
        .status(404)
        .json({
          error: "Kein Club mit Events für diesen Link/diese ID gefunden",
        });
    }
    return res
      .status(502)
      .json({ error: "Stats für diesen Club konnten nicht erzeugt werden" });
  }
}
