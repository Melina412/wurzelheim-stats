import { motion } from "framer-motion";
import type { Loyalty } from "@/data/stats";
import { fmt } from "@/shared/format";

type Props = { loyalty: Loyalty };

export function LoyaltyTiers({ loyalty }: Props) {
  const max = Math.max(...loyalty.tiers.map((t) => t.people));

  return (
    <div className="flex flex-col gap-3">
      {loyalty.tiers.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.06 }}
          className="grid grid-cols-[10rem_1fr_auto] items-center gap-3 sm:grid-cols-[13rem_1fr_auto]"
        >
          <div className="min-w-0">
            <p
              className={`truncate font-semibold ${
                t.casual ? "text-muted" : "text-base-fg"
              }`}
            >
              {t.label}
            </p>
            <p className="text-xs text-muted">
              {t.range === "1" ? "1 Event" : `${t.range} Events`}
            </p>
          </div>
          <div className="h-7 overflow-hidden rounded-full bg-go-green/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(t.people / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
              className={`h-full rounded-full ${
                t.casual
                  ? "bg-go-green/30"
                  : "bg-linear-to-r from-go-green to-go-teal"
              }`}
            />
          </div>
          <span className="w-14 text-right font-bold text-base-fg tabular-nums">
            {fmt(t.people)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
