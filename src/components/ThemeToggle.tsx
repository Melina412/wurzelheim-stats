import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/i18n/context";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const t = useT();
  return (
    <button
      onClick={toggle}
      aria-label={t("common.toggleTheme")}
      className="fixed top-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-base bg-card text-base-fg shadow-lg backdrop-blur transition hover:scale-110 hover:text-go-green"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
