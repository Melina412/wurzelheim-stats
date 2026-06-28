// Server-only master-password gate, shared by all mutating endpoints
// (auth / preview / generate). Constant-time compare to avoid timing attacks.

import { timingSafeEqual } from "node:crypto";
import type { VercelRequest } from "@vercel/node";
import type { ApiErrorCode } from "./api-errors.js";

/** Read the master password from the request header. */
export function readMasterPassword(req: VercelRequest): string {
  const h = req.headers["x-master-password"];
  return Array.isArray(h) ? (h[0] ?? "") : (h ?? "");
}

/**
 * Verify the request's master password against MASTER_PW.
 * Returns an error code to fail with, or null when the password is valid.
 */
export function checkMasterPassword(
  req: VercelRequest,
): Extract<ApiErrorCode, "server_misconfigured" | "unauthorized"> | null {
  const expected = process.env.MASTER_PW;
  if (!expected) return "server_misconfigured";

  const a = Buffer.from(readMasterPassword(req));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return "unauthorized";
  return timingSafeEqual(a, b) ? null : "unauthorized";
}
