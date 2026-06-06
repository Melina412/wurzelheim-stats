const deNum = new Intl.NumberFormat("de-DE");

export const fmt = (n: number) => deNum.format(n);

const MONTHS_DE = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

/** "2025-03" -> "Mär 25" */
export function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return `${MONTHS_DE[Number(m) - 1]} ${y.slice(2)}`;
}

/** "2025-08-09T..." -> "9. Aug 2025" */
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()}. ${MONTHS_DE[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const MONTHS_DE_LONG = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

/** "2026-05-31" -> "31. Mai 2026" */
export function fmtDateLong(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()}. ${MONTHS_DE_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
