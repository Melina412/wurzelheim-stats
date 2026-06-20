import { useT } from "@/i18n/context";

// Stub — wird in Schritt 13 als Multi-Step-Wizard gebaut:
// 1) Master-PW prüfen  2) Club-ID bekannt? (sonst Event-Link → auflösen)
// 3) Club vorab laden → Anzeigename bestätigen + Farbe  4) aggregieren → /club/:id
export function Generate() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-2xl font-bold text-base-fg">{t("generate.title")}</h1>
      <p className="mt-2 text-muted">{t("generate.comingSoon")}</p>
    </div>
  );
}
