import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { StatsSections } from "@/components/StatsSections";
import { StatsMeta } from "@/components/StatsMeta";
import { stats } from "@/data/stats";

// NOTE: hero + thanks are Wurzelheim-specific and still hardcoded German — they
// get converted to i18n keys in the landing-restructure step. The shared,
// data-driven sections live in <StatsSections />.
export function Landing() {
  const { club } = stats;

  return (
    <div className="relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-go-green)_0%,transparent_70%)] opacity-20" />

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
          className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-go-green"
        >
          {club.name}
        </motion.p>
        <h1 className="text-6xl font-black leading-none tracking-tighter text-base-fg sm:text-8xl">
          <AnimatedNumber value={5000} duration={2.5} />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-base font-semibold uppercase tracking-[0.2em] text-go-green sm:text-lg"
        >
          Mitglieder
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-5 max-w-xl text-lg text-muted sm:text-xl"
        >
          In <span className="font-semibold text-base-fg">unter 2 Jahren</span>{" "}
          von einer Handvoll Trainer:innen am Alexanderplatz zu einer der
          größten Communities in Berlin.
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
          Ein riesiges Dankeschön an{" "}
          <span className="font-bold text-go-green">Bobby</span> und{" "}
          <span className="font-bold text-go-green">Ute</span> — und an alle,
          die diese Community mit Herzblut am Leben halten. Ohne euch wären das
          hier nur Zahlen. 🫶
        </motion.p>
      </section>

      <StatsMeta clubName={club.name} stats={stats} />
    </div>
  );
}
