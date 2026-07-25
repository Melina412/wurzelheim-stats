import { motion } from "framer-motion";
import { StatsSections } from "@/components/StatsSections";
import { StatsMeta } from "@/components/StatsMeta";
import { stats } from "@/data/stats";
import { useT } from "@/i18n/context";
import { useFireworks } from "@/hooks/useFireworks";
import { usePageHit } from "@/hooks/usePageHit";
import { rich } from "@/shared/rich";

// Hero + thanks are Wurzelheim-specific (club name, the 2-year milestone, the
// names) but the copy is translated; the shared sections live in <StatsSections />.
export function Landing() {
  const { club } = stats;
  const t = useT();
  useFireworks();
  usePageHit("landing");

  return (
    <div className="relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-brand)_0%,transparent_70%)] opacity-20" />

      {/* HERO (Wurzelheim-specific) */}
      <header className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-16 text-center">
        <motion.img
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          src="/logo.png"
          alt={`${club.name} Logo`}
          width={192}
          height={192}
          className="mb-6 h-48 w-48 rounded-3xl border border-base shadow-xl"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand"
        >
          {club.name}
        </motion.p>
        <motion.h1
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 12,
            delay: 0.15,
          }}
          className="text-6xl font-black leading-none tracking-tighter text-base-fg sm:text-8xl"
        >
          {t("landing.heroTitle")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-base font-semibold uppercase tracking-[0.2em] text-brand sm:text-lg"
        >
          {t("landing.heroLabel")}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 max-w-xl text-lg text-muted sm:text-xl"
        >
          {t("landing.heroSubtitle")}
        </motion.p>
      </header>

      {/* Shared data-driven sections */}
      <StatsSections stats={stats} />

      {/* THANKS (Wurzelheim-specific) */}
      <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="text-lg text-muted sm:text-xl"
        >
          {rich(t("landing.thanks"), {
            bobby: <span className="font-bold text-brand">Bobby</span>,
            ute: <span className="font-bold text-brand">Ute</span>,
          })}
        </motion.p>
      </section>

      <StatsMeta clubName={club.name} stats={stats} />
    </div>
  );
}
