// Server-side response helper for API handlers. Kept separate from api-errors
// (which stays framework-free + client-safe) because this references Vercel types.

import type { VercelResponse } from "@vercel/node";
import { ERROR_STATUS, ServiceError, type ApiErrorCode } from "./api-errors.js";

/** Send a stable error code with its mapped HTTP status. Client translates the code. */
export function fail(
  res: VercelResponse,
  code: ApiErrorCode,
  extra?: Record<string, unknown>,
) {
  return res.status(ERROR_STATUS[code]).json({ error: code, ...extra });
}

/**
 * Map a caught error to a response. A ServiceError carries its own stable code
 * (services label their own failures); anything else is a genuine unknown and
 * becomes a generic server_error. Use this in every handler's catch block so
 * the same failure always yields the same code, regardless of the route.
 */
export function failFromError(
  res: VercelResponse,
  err: unknown,
  context?: string,
) {
  if (err instanceof ServiceError) {
    return fail(
      res,
      err.code,
      err.retryAfterMs ? { retryAfterMs: err.retryAfterMs } : undefined,
    );
  }
  console.error(context ? `[${context}] failed:` : "Unhandled error:", err);
  return fail(res, "server_error");
}
