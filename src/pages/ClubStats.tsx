import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClubStats } from "@/hooks/useClubStats";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useT } from "@/i18n/context";
import { ClubHeader } from "@/components/ClubHeader";
import { StatsSections } from "@/components/StatsSections";
import { StatsMeta } from "@/components/StatsMeta";
import { ColorSchemePicker } from "@/components/ColorSchemePicker";
import type { ColorScheme } from "@/domains/club/club.types";

export function ClubStats() {
  const { id } = useParams();
  const t = useT();
  const state = useClubStats(id ?? "");

  // Dev-only: locally override the displayed scheme to tune colors without
  // regenerating. null = use the club's stored scheme.
  const [override, setOverride] = useState<ColorScheme | null>(null);
  const scheme =
    override ?? (state.status === "ok" ? state.data.colorScheme : "green");
  useColorScheme(scheme);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-40 text-center text-muted">
        {t("common.loading")}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-md px-6 py-40 text-center">
        <p className="text-lg text-base-fg">{t(`errors.${state.code}`)}</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-base bg-card px-5 py-2 text-sm font-medium text-base-fg transition hover:border-brand hover:text-brand"
        >
          {t("clubStats.backHome")}
        </Link>
      </div>
    );
  }

  const { data } = state;
  return (
    <div className="relative overflow-hidden">
      {/* ambient glow in the club's brand color */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-brand)_0%,transparent_70%)] opacity-20" />

      <ClubHeader name={data.displayName} />
      <StatsSections stats={data.stats} />
      <StatsMeta clubName={data.displayName} stats={data.stats} />

      {/* Dev-only scheme switcher — tune colors live without regenerating. */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-5 left-5 z-50 rounded-2xl border border-base bg-card/90 p-3 shadow-lg backdrop-blur">
          <p className="mb-2 text-xs font-semibold text-muted">Scheme (dev)</p>
          <ColorSchemePicker value={scheme} onChange={setOverride} />
        </div>
      )}
    </div>
  );
}
