import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SiteFooter } from "@/components/SiteFooter";

/** App shell: global toggles (theme + language) on every route, the page, then
 *  the global footer (repo links + author credit). */
export function Layout() {
  return (
    <>
      <ThemeToggle />
      <LanguageToggle />
      <Outlet />
      <SiteFooter />
    </>
  );
}
