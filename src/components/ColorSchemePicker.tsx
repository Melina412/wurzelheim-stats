import { Check } from "lucide-react";
import { useT } from "@/i18n/context";
// Value import from the types file directly (NOT the club barrel, which pulls in
// the server-only store). COLOR_SCHEMES is the single source of truth.
import { COLOR_SCHEMES, type ColorScheme } from "@/domains/club/club.types";

/**
 * Five color swatches. Each swatch carries its own `scheme-*` class, so its
 * `bg-brand` resolves to that scheme's color straight from index.css — no
 * hardcoded hex values here.
 */
export function ColorSchemePicker({
  value,
  onChange,
}: {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-3">
      {COLOR_SCHEMES.map((scheme) => {
        const selected = scheme === value;
        return (
          <button
            key={scheme}
            type="button"
            onClick={() => onChange(scheme)}
            aria-label={t(`generate.schemes.${scheme}`)}
            aria-pressed={selected}
            className={`scheme-${scheme} grid h-11 w-11 place-items-center rounded-full bg-brand shadow-sm transition hover:scale-110 ${
              selected
                ? "ring-2 ring-brand ring-offset-2 ring-offset-(--bg)"
                : ""
            }`}
          >
            {selected && <Check size={18} className="text-white" />}
          </button>
        );
      })}
    </div>
  );
}
