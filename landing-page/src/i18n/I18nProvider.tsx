import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  localeLabels,
  translations,
  type Locale,
  type Translation,
} from "./translations";

const STORAGE_KEY = "raven.landing.locale";

type I18nContextValue = {
  locale: Locale;
  t: Translation;
  setLocale: (locale: Locale) => void;
  localeLabels: typeof localeLabels;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "de" || stored === "pt") return stored;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("pt")) return "pt";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readLocale());

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
    document.documentElement.lang = next === "pt" ? "pt-BR" : next;
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: translations[locale],
      setLocale,
      localeLabels,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
