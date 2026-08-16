import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { RELEASES_PAGE, useGitHubReleases } from "@/hooks/useGitHubReleases";

export function Hero() {
  const { t } = useI18n();
  const releases = useGitHubReleases();

  const primaryUrl = releases.winUrl ?? RELEASES_PAGE;

  return (
    <section className="relative px-6 pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 w-full max-w-xs animate-float md:max-w-sm"
        >
          <div className="glass overflow-hidden rounded-3xl p-3 shadow-neon">
            <img
              src={`${import.meta.env.BASE_URL}brand/raven-logo.png`}
              alt="RAVEN AI"
              className="w-full rounded-2xl"
              width={512}
              height={286}
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display text-xs uppercase tracking-[0.35em] text-neon-glow"
        >
          {t.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
        >
          <span className="text-gradient">{t.headline}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-[color:var(--raven-muted)] md:text-lg"
        >
          {t.subline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-4 font-mono text-sm font-medium tracking-wide text-neon md:text-base"
        >
          {t.motto}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mx-auto mt-8 max-w-xl space-y-3 font-sans text-sm leading-relaxed text-[color:var(--raven-muted)]"
        >
          <p>{t.heroBody}</p>
          <p>{t.heroBody2}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={primaryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-dim to-neon px-8 py-3.5 font-display text-xs uppercase tracking-[0.2em] text-white shadow-neon transition hover:scale-[1.02] hover:brightness-110"
          >
            {t.cta}
          </a>
          {releases.linuxUrl ? (
            <a
              href={releases.linuxUrl}
              target="_blank"
              rel="noreferrer"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-display text-xs uppercase tracking-[0.18em] text-[color:var(--raven-text)] transition hover:border-neon"
            >
              Ubuntu .deb
            </a>
          ) : null}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-6 font-sans text-xs text-[color:var(--raven-muted)]"
        >
          {t.ctaTrial}
        </motion.p>
      </div>
    </section>
  );
}
