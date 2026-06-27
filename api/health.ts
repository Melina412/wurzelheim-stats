import type { VercelRequest, VercelResponse } from "@vercel/node";

// Diagnostic endpoint — NO imports from src/. If /api/health works but
// /api/clubs/stats crashes, the problem is bundling of the src/ imports.
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, runtime: process.version });
}
