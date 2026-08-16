import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";

const jurisdictions = [
  { flag: "🇧🇷", code: "BR" },
  { flag: "🇮🇪", code: "IE" },
  { flag: "🇩🇪", code: "DE" },
  { flag: "🇱🇺", code: "LU" },
  { flag: "🇬🇧", code: "UK" },
  { flag: "🇵🇹", code: "PT" },
  { flag: "🇪🇸", code: "ES" },
  { flag: "🇫🇷", code: "FR" },
  { flag: "🇳🇱", code: "NL" },
  { flag: "🇳🇴", code: "NO" },
  { flag: "🌐", code: "ISO" },
];

export function Jurisdictions() {
  const { t } = useI18n();

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          {t.jurisdictionsTitle}
        </h2>
        <p className="mt-3 font-sans text-sm text-[color:var(--raven-muted)]">
          {t.jurisdictionsSub}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {jurisdictions.map((j, i) => (
            <motion.div
              key={j.code}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass flex h-14 w-14 flex-col items-center justify-center rounded-xl text-lg transition hover:border-neon hover:shadow-neon"
              title={j.code}
            >
              <span>{j.flag}</span>
              <span className="mt-0.5 font-mono text-[8px] text-[color:var(--raven-muted)]">
                {j.code}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
