import { useEffect } from "react";

/**
 * Fire-and-forget page-hit ping on mount. The server only counts it in
 * production (dev/preview don't inflate the number). Errors are ignored.
 */
export function usePageHit(page: string) {
  useEffect(() => {
    fetch("/api/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page }),
    }).catch(() => {});
  }, [page]);
}
