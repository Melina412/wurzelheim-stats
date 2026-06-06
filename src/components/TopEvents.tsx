import { motion } from "framer-motion";
import type { EventEntry } from "@/data/stats";
import { fmt, fmtDate } from "@/shared/format";

type Props = { events: EventEntry[] };

const MEDAL = ["text-go-yellow", "text-slate-400", "text-amber-600"];

export function TopEvents({ events }: Props) {
  const max = events[0]?.checkIns || 1;
  const top = events.slice(0, 8);

  return (
    <ul className="flex flex-col gap-2">
      {top.map((e, i) => (
        <motion.li
          key={e.id}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.05 }}
          className="relative overflow-hidden rounded-xl border border-base bg-card px-4 py-3"
        >
          {/* check-in fill bar */}
          <div
            className="absolute inset-y-0 left-0 z-0 bg-go-green/10"
            style={{ width: `${(e.checkIns / max) * 100}%` }}
          />
          <div className="relative flex items-center gap-4">
            <span
              className={`w-7 shrink-0 text-center text-lg font-black ${
                MEDAL[i] ?? "text-muted"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-base-fg">{e.name}</p>
              <p className="text-xs text-muted">
                {fmtDate(e.date)} · {e.type}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-go-green">{fmt(e.checkIns)}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted">
                Check-ins
              </p>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
