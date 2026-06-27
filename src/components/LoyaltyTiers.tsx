import { motion } from "framer-motion";
import type { Loyalty } from "@/data/stats";
import { useT, useFormat } from "@/i18n/context";

type Props = { loyalty: Loyalty };

export function LoyaltyTiers({ loyalty }: Props) {
  const t = useT();
  const { fmt } = useFormat();
  const max = Math.max(...loyalty.tiers.map((tier) => tier.people));

  return (
    <div className="flex flex-col gap-3">
      {loyalty.tiers.map((tier, i) => (
        <motion.div
          key={tier.key}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.06 }}
          className="grid grid-cols-[10rem_1fr_auto] items-center gap-3 sm:grid-cols-[13rem_1fr_auto]"
        >
          <div className="min-w-0">
            <p
              className={`truncate font-semibold ${
                tier.casual ? "text-muted" : "text-base-fg"
              }`}
            >
              {t(`tiers.${tier.key}`)}
            </p>
            <p className="text-xs text-muted">
              {tier.range === "1" ? "1 Event" : `${tier.range} Events`}
            </p>
          </div>
          <div className="h-7 overflow-hidden rounded-full bg-brand/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(tier.people / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
              className={`h-full rounded-full ${
                tier.casual
                  ? "bg-brand/30"
                  : "bg-linear-to-r from-brand to-brand-strong"
              }`}
            />
          </div>
          <span className="w-14 text-right font-bold text-base-fg tabular-nums">
            {fmt(tier.people)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
