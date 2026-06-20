import { useLang, useT } from "@/i18n/context";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <button
      onClick={() => setLang(lang === "de" ? "en" : "de")}
      aria-label={t("common.toggleLanguage")}
      className="fixed top-5 right-20 z-50 grid h-11 w-11 place-items-center rounded-full border border-base bg-card text-sm font-bold text-base-fg shadow-lg backdrop-blur transition hover:scale-110 hover:text-go-green"
    >
      {lang === "de" ? "EN" : "DE"}
    </button>
  );
}
