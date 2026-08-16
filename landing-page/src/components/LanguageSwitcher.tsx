import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/translations";

const locales: Locale[] = ["en", "de", "pt"];

export function LanguageSwitcher() {
  const { locale, setLocale, localeLabels } = useI18n();

  return (
    <div className="flex gap-1 rounded-full glass p-0.5">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider transition ${
            locale === code
              ? "bg-neon text-white shadow-neon"
              : "text-[color:var(--raven-muted)] hover:text-[color:var(--raven-text)]"
          }`}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}
