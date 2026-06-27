import { useEffect } from "react";
import type { ColorScheme } from "@/domains/club";

/**
 * Apply a club's color scheme by setting a `scheme-*` class on <html> for the
 * lifetime of the component. No class = the default (green) from index.css.
 * Used by the club display page so the whole page (incl. global chrome) themes.
 */
export function useColorScheme(scheme: ColorScheme) {
  useEffect(() => {
    const el = document.documentElement;
    const cls = `scheme-${scheme}`;
    el.classList.add(cls);
    return () => el.classList.remove(cls);
  }, [scheme]);
}
