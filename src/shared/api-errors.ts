// Stable API error codes — shared by the server (handlers throw/return them)
// and the client (i18n translates them). Keep these in sync with the i18n
// `errors` block. Never send human prose from the API.

export const API_ERROR_CODES = [
  "method_not_allowed",
  "unauthorized",
  "server_misconfigured",
  "invalid_input",
  "invalid_color",
  "rate_limited",
  "no_events",
  "club_not_generated",
  "upstream_error",
  "server_error",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

/** HTTP status for each error code (API-layer mapping; no framework deps). */
export const ERROR_STATUS: Record<ApiErrorCode, number> = {
  method_not_allowed: 405,
  unauthorized: 401,
  server_misconfigured: 500,
  invalid_input: 400,
  invalid_color: 400,
  rate_limited: 429,
  no_events: 404,
  club_not_generated: 404,
  upstream_error: 502,
  server_error: 500,
};

/** Error carrying a stable API code (+ optional retry hint), thrown by services. */
export class ServiceError extends Error {
  code: ApiErrorCode;
  retryAfterMs?: number;
  constructor(code: ApiErrorCode, retryAfterMs?: number) {
    super(code);
    this.name = "ServiceError";
    this.code = code;
    this.retryAfterMs = retryAfterMs;
  }
}
