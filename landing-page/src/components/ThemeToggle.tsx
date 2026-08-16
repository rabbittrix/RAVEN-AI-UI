import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="glass rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--raven-muted)] transition hover:border-neon hover:text-neon"
    >
      {theme === "dark" ? "☀ Light" : "☾ Dark"}
    </button>
  );
}
