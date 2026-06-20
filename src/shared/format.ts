import type { Lang } from "@/i18n/context";

// Locale-aware number + date formatters (built on Intl — zero-dependency).
// Dates are formatted in UTC so the displayed day doesn't shift by viewer TZ.
export function makeFormatters(lang: Lang) {
  const num = new Intl.NumberFormat(lang);
  const dShort = new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const dLong = new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const mShort = new Intl.DateTimeFormat(lang, {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });

  return {
    /** 4634 → "4,634" (en) / "4.634" (de) */
    fmt: (n: number) => num.format(n),
    /** "2025-08-09T…" → "Aug 9, 2025" (en) / "9. Aug. 2025" (de) */
    fmtDate: (iso: string) => dShort.format(new Date(iso)),
    /** "2026-05-31" → "May 31, 2026" (en) / "31. Mai 2026" (de) */
    fmtDateLong: (iso: string) => dLong.format(new Date(iso)),
    /** "2025-03" → "Mar 25" (en) / "Mär. 25" (de) */
    fmtMonth: (ym: string) => {
      const [y, m] = ym.split("-").map(Number);
      return mShort.format(new Date(Date.UTC(y, m - 1, 1)));
    },
  };
}

export type Formatters = ReturnType<typeof makeFormatters>;
