import { motion } from "framer-motion";
import { CalendarDays, TrendingUp, Trophy, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { GrowthChart } from "@/components/GrowthChart";
import { TopEvents } from "@/components/TopEvents";
import { EventTypeChart } from "@/components/EventTypeChart";
import { LoyaltyTiers } from "@/components/LoyaltyTiers";
import { GithubIcon } from "@/components/GithubIcon";
import { stats } from "@/data/stats";
import { fmt, fmtDate, fmtDateLong } from "@/shared/format";

// Hauptprojekt der Gruppe
const WURZELHEIM_URL = "https://github.com/ichbinbobby/wurzelheim.de";
const REPO_URL = "https://github.com/Melina412/wurzelheim-stats";

function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="mb-8 max-w-2xl"
    >
      <h2 className="text-3xl font-bold tracking-tight text-base-fg sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function StatCard({
  icon: Icon,
  value,
  label,
  suffix,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
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

export default function App() {
  const { totals, monthly, club, topEvents, eventTypes, loyalty } = stats;

  return (
    <div className="relative overflow-hidden">
      <ThemeToggle />

      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-go-green)_0%,transparent_70%)] opacity-20" />

      {/* HERO */}
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

      {/* STAT CARDS */}
      <motion.section
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 lg:grid-cols-4"
      >
        <StatCard
          icon={CalendarDays}
          value={totals.events}
          label="Events organisiert"
        />
        <StatCard
          icon={Users}
          value={totals.uniqueParticipants}
          label="Einzigartige Teilnehmer"
        />
        <StatCard
          icon={TrendingUp}
          value={totals.totalCheckIns}
          label="Check-ins gesamt"
        />
        <StatCard
          icon={Trophy}
          value={Math.round(totals.checkInRate * 100)}
          suffix="%"
          label="Check-in-Quote"
        />
      </motion.section>

      {/* GROWTH */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeader title="Vom ersten Treffen zur Bewegung">
          Beim allerersten Event{" "}
          <span className="font-medium text-base-fg">
            „{totals.firstEvent.name}"
          </span>{" "}
          am {fmtDate(totals.firstEvent.date)} kamen{" "}
          <span className="font-bold text-go-green">
            {totals.firstEvent.checkIns} Leute
          </span>
          . Beim größten Event bisher,{" "}
          <span className="font-medium text-base-fg">
            „{totals.biggestEvent.name}"
          </span>
          , waren es{" "}
          <span className="font-bold text-go-yellow">
            {fmt(totals.biggestEvent.checkIns)}
          </span>
          .
        </SectionHeader>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-base bg-card p-4 shadow-sm sm:p-6"
        >
          <GrowthChart data={monthly} />
        </motion.div>
      </section>

      {/* TOP EVENTS */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <SectionHeader title="Die größten Tage 🏆">
          Diese Events haben die meisten Trainer:innen vor Ort versammelt.
        </SectionHeader>
        <TopEvents events={topEvents} />
      </section>

      {/* EVENT TYPES */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <SectionHeader title="Wofür wir uns treffen">
          {eventTypes[0].type} sind mit {eventTypes[0].count} Events klar die
          häufigste Aktivität der Gruppe.
        </SectionHeader>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-base bg-card p-4 shadow-sm sm:p-6"
        >
          <EventTypeChart data={eventTypes} />
        </motion.div>
      </section>

      {/* LOYALTY */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <SectionHeader title="Das Herz der Community ❤️">
          Von {fmt(loyalty.everCheckedIn)} Trainer:innen, die je eingecheckt
          haben, sind{" "}
          <span className="font-bold text-base-fg">
            {fmt(loyalty.activeMembers)}
          </span>{" "}
          echte Stammgäste (ab {loyalty.activeThreshold} Events). Und ganz oben
          wird's exklusiv: gerade mal{" "}
          <span className="font-bold text-go-green">
            {loyalty.elite.atLeast100}
          </span>{" "}
          Trainer:innen waren bei über 100 Events dabei — nur{" "}
          <span className="font-bold text-go-yellow">
            {loyalty.elite.atLeast150}
          </span>{" "}
          davon sogar 150+.
        </SectionHeader>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-base bg-card p-5 shadow-sm sm:p-7"
        >
          <LoyaltyTiers loyalty={loyalty} />
        </motion.div>
        <p className="mt-3 text-xs text-muted">
          Anonyme Auswertung der Event-Check-ins — ohne Namen. Organisator:innen
          &amp; Ambassadoren liegen naturgemäß ganz oben.
        </p>
      </section>

      {/* THANKS */}
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

      <footer className="border-t border-base py-10 text-center text-sm text-muted">
        <p>
          {club.name} · {fmt(totals.events)} Events · seit{" "}
          {fmtDate(totals.firstEventDate)}
        </p>
        <p className="mt-1 text-xs">
          Stand der Daten: {fmtDateLong(stats.dataAsOf)}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WURZELHEIM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-base bg-card px-4 py-2 text-xs font-medium text-base-fg transition hover:border-go-green hover:text-go-green"
          >
            <GithubIcon size={15} />
            wurzelheim.de
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-base bg-card px-4 py-2 text-xs font-medium text-base-fg transition hover:border-go-green hover:text-go-green"
          >
            <GithubIcon size={15} />
            wurzelheim-stats
          </a>
        </div>
      </footer>
    </div>
  );
}
