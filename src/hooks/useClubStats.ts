import { useEffect, useState } from "react";
import type { ClubRecord } from "@/domains/club";
import type { ApiErrorCode } from "@/shared/api-errors";

export type ClubStatsData = ClubRecord & { views: number };

export type ClubStatsState =
  | { status: "loading" }
  | { status: "error"; code: ApiErrorCode }
  | { status: "ok"; data: ClubStatsData };

/** Fetch a generated club's anonymous stats from /api/clubs/stats. */
export function useClubStats(id: string): ClubStatsState {
  const [state, setState] = useState<ClubStatsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/clubs/stats?club=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) {
          setState({ status: "ok", data: body as ClubStatsData });
        } else {
          const code = (body?.error as ApiErrorCode) ?? "server_error";
          setState({ status: "error", code });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", code: "server_error" });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
