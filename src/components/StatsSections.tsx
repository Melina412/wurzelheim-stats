import { motion } from "framer-motion";
import { CalendarDays, TrendingUp, Trophy, Users } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { GrowthChart } from "@/components/GrowthChart";
import { TopEvents } from "@/components/TopEvents";
import { EventTypeChart } from "@/components/EventTypeChart";
import { LoyaltyTiers } from "@/components/LoyaltyTiers";
import { useT, useFormat } from "@/i18n/context";
import { rich } from "@/shared/rich";
import type { Stats } from "@/domains/stats";

const quoted = (s: string) => (
  <span className="font-medium text-base-fg">„{s}"</span>
);

// Capitalise the first letter (the event-type name starts the sentence).
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Data-driven stats sections — shared by the Wurzelheim landing and /club/:id. */
export function StatsSections({ stats }: { stats: Stats }) {
  const t = useT();
  const { fmt, fmtDate } = useFormat();
  const { totals, monthly, eventTypes, loyalty } = stats;

  return (
    <>
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
          label={t("sections.cards.events")}
        />
        <StatCard
          icon={Users}
          value={totals.uniqueParticipants}
          label={t("sections.cards.participants")}
        />
        <StatCard
          icon={TrendingUp}
          value={totals.totalCheckIns}
          label={t("sections.cards.checkins")}
        />
        <StatCard
          icon={Trophy}
          value={Math.round(totals.checkInRate * 100)}
          suffix="%"
          label={t("sections.cards.checkinRate")}
        />
      </motion.section>

      {/* GROWTH */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeader title={t("sections.growthTitle")}>
          {rich(t("sections.growthDesc"), {
            firstName: quoted(totals.firstEvent.name),
            firstDate: fmtDate(totals.firstEvent.date),
            firstCount: (
              <span className="font-bold text-highlight">
                {totals.firstEvent.checkIns}
              </span>
            ),
            bigName: quoted(totals.biggestEvent.name),
            bigCount: (
              <span className="font-bold text-highlight">
                {fmt(totals.biggestEvent.checkIns)}
              </span>
            ),
          })}
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
        <SectionHeader title={t("sections.topEventsTitle")}>
          {t("sections.topEventsDesc")}
        </SectionHeader>
        <TopEvents events={stats.topEvents} />
      </section>

      {/* EVENT TYPES */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <SectionHeader title={t("sections.eventTypesTitle")}>
          {rich(t("sections.eventTypesDesc"), {
            type: (
              <span className="font-bold text-base-fg">
                {cap(t(`eventTypes.${eventTypes[0].type}`))}
              </span>
            ),
            count: (
              <span className="font-bold text-highlight">
                {eventTypes[0].count}
              </span>
            ),
          })}
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
        <SectionHeader title={t("sections.loyaltyTitle")}>
          {rich(t("sections.loyaltyDesc"), {
            everCheckedIn: fmt(loyalty.everCheckedIn),
            activeMembers: (
              <span className="font-bold text-base-fg">
                {fmt(loyalty.activeMembers)}
              </span>
            ),
            threshold: loyalty.activeThreshold,
            atLeast100: (
              <span className="font-bold text-highlight">
                {loyalty.elite.atLeast100}
              </span>
            ),
            atLeast150: (
              <span className="font-bold text-highlight">
                {loyalty.elite.atLeast150}
              </span>
            ),
          })}
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
          {t("sections.loyaltyDisclaimer")}
        </p>
      </section>
    </>
  );
}
