import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";

// Variant for stagger reveal — the parent grid drives "hidden" → "show".
const statCardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function StatCard({
  icon: Icon,
  value,
  label,
  suffix,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <motion.div
      variants={statCardVariant}
      className="rounded-2xl border border-base bg-card p-6 text-left shadow-sm"
    >
      <Icon className="mb-3 text-go-green" size={26} />
      <div className="text-3xl font-extrabold tracking-tight text-base-fg sm:text-4xl">
        <AnimatedNumber value={value} />
        {suffix}
      </div>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </motion.div>
  );
}
