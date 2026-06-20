import { useParams } from "react-router-dom";
import { useT } from "@/i18n/context";

// Stub — wird in Schritt 12 gebaut (lädt von api/clubs/stats, rendert StatsSections
// mit Club-Anzeigename + Farbschema, Loading/Error/'noch nicht generiert'-States).
export function ClubStats() {
  const { id } = useParams();
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-2xl font-bold text-base-fg">
        {t("clubStats.title")}
      </h1>
      <p className="mt-2 text-muted">
        {t("clubStats.comingSoon", { id: id ?? "" })}
      </p>
    </div>
  );
}
