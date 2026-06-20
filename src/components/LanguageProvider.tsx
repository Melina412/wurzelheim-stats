import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DICTS,
  LangContext,
  getInitialLang,
  translate,
  type Ctx,
} from "@/i18n/context";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key, params) => translate(DICTS[lang], key, params),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
