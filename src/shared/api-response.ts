// Server-side response helper for API handlers. Kept separate from api-errors
// (which stays framework-free + client-safe) because this references Vercel types.

import type { VercelResponse } from "@vercel/node";
import { ERROR_STATUS, type ApiErrorCode } from "./api-errors.js";

/** Send a stable error code with its mapped HTTP status. Client translates the code. */
export function fail(
  res: VercelResponse,
  code: ApiErrorCode,
  extra?: Record<string, unknown>,
) {
  return res.status(ERROR_STATUS[code]).json({ error: code, ...extra });
}
