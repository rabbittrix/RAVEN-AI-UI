import { GlassCard } from "@/components/GlassCard";
import { RELEASES_PAGE, useGitHubReleases } from "@/hooks/useGitHubReleases";
import { useI18n } from "@/i18n/I18nProvider";

export function DownloadSection() {
  const { t } = useI18n();
  const releases = useGitHubReleases();

  return (
    <section id="download" className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <GlassCard className="text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            {t.downloadTitle}
          </h2>
          <p className="mt-3 font-sans text-sm text-[color:var(--raven-muted)]">
            {t.downloadSub}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={releases.winUrl ?? releases.msiUrl ?? RELEASES_PAGE}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-gradient-to-r from-neon-dim to-neon px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-white shadow-neon transition hover:brightness-110"
            >
              {t.winLabel}
            </a>
            <a
              href={releases.linuxUrl ?? RELEASES_PAGE}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-xl px-6 py-3 font-display text-xs uppercase tracking-[0.18em] transition hover:border-neon"
            >
              {t.linuxLabel}
            </a>
          </div>
          {releases.msiUrl ? (
            <a
              href={releases.msiUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block font-mono text-[11px] text-neon underline underline-offset-4"
            >
              Enterprise MSI →
            </a>
          ) : null}
          <p className="mt-6 font-sans text-[11px] text-[color:var(--raven-muted)]">
            {t.trialNote}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
