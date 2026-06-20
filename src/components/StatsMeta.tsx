import { useT, useFormat } from "@/i18n/context";
import type { Stats } from "@/domains/stats";

/** Per-club meta line (name · events · since · data date). Sits right above the
 *  global SiteFooter so the two read as one footer block. */
export function StatsMeta({
  clubName,
  stats,
}: {
  clubName: string;
  stats: Stats;
}) {
  const t = useT();
  const { fmt, fmtDate, fmtDateLong } = useFormat();
  return (
    <section className="px-6 pb-8 text-center text-sm text-muted">
      <p className="font-semibold text-base-fg">{clubName}</p>
      <p className="mt-1">
        {t("meta.eventsSince", {
          events: fmt(stats.totals.events),
          since: fmtDate(stats.totals.firstEventDate),
        })}
      </p>
      <p className="mt-1 text-xs">
        {t("meta.dataAsOf", { date: fmtDateLong(stats.dataAsOf) })}
      </p>
    </section>
  );
}
