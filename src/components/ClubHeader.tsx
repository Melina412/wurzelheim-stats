import { motion } from "framer-motion";
import { useT } from "@/i18n/context";

/** Simple, generic header for club pages (vs. the bespoke Wurzelheim hero). */
export function ClubHeader({ name }: { name: string }) {
  const t = useT();
  return (
    <header className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand"
      >
        {t("clubHeader.eyebrow")}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-black tracking-tight text-base-fg sm:text-6xl"
      >
        {name}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-4 max-w-2xl text-lg text-muted"
      >
        {t("clubHeader.subtitle")}
      </motion.p>
    </header>
  );
}
