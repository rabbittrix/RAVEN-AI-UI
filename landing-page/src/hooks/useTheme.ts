import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "raven.landing.theme";

export function readTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const color = theme === "dark" ? "#0B0B10" : "#FAF9F7";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => readTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return { theme, toggle };
}
