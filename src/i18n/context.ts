import { createContext, useContext, useMemo } from "react";
import type { ApiErrorCode } from "../shared/api-errors";
import { makeFormatters } from "../shared/format";
import de from "./de.json";
import en from "./en.json";

export type Lang = "de" | "en";

// de.json is the source of truth for the shape. Widen leaf literals to `string`
// so en.json must have the SAME keys (compile-time parity) — and force `errors`
// to cover every API error code.
type Stringify<T> = {
  [K in keyof T]: T[K] extends string ? string : Stringify<T[K]>;
};
type Dict = Stringify<Omit<typeof de, "errors">> & {
  errors: Record<ApiErrorCode, string>;
};

// Dot-paths into the dictionary → type-safe, autocompleted translation keys.
type Leaves<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Leaves<T[K]>}`;
}[keyof T & string];
export type TKey = Leaves<Dict>;

type Params = Record<string, string | number>;
export type TFunc = (key: TKey, params?: Params) => string;
export type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: TFunc };

export const DICTS: Record<Lang, Dict> = { de, en };

export function translate(dict: Dict, key: TKey, params?: Params): string {
  let cur: unknown = dict;
  for (const part of key.split(".")) {
    cur = (cur as Record<string, unknown> | undefined)?.[part];
  }
  let str = typeof cur === "string" ? cur : key; // fall back to the key if missing
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

export function getInitialLang(): Lang {
  if (typeof window === "undefined") return "de";
  const stored = localStorage.getItem("lang");
  if (stored === "de" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "de";
}

export const LangContext = createContext<Ctx>({
  lang: "de",
  setLang: () => {},
  t: (key, params) => translate(DICTS.de, key, params),
});

export function useT(): TFunc {
  return useContext(LangContext).t;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang };
}

/** Locale-aware number/date formatters bound to the active language. */
export function useFormat() {
  const { lang } = useContext(LangContext);
  return useMemo(() => makeFormatters(lang), [lang]);
}
