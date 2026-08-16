import { GlassCard } from "@/components/GlassCard";
import {
  platformLabel,
  type ReleaseVersion,
  useGitHubReleases,
} from "@/hooks/useGitHubReleases";
import { useI18n } from "@/i18n/I18nProvider";

function DownloadButton({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      download
      className={
        primary
          ? "inline-flex min-w-[12rem] items-center justify-center rounded-xl bg-gradient-to-r from-neon-dim to-neon px-6 py-3.5 font-display text-xs uppercase tracking-[0.18em] text-white shadow-neon transition hover:scale-[1.01] hover:brightness-110"
          : "glass inline-flex min-w-[12rem] items-center justify-center rounded-xl px-6 py-3.5 font-display text-xs uppercase tracking-[0.18em] text-[color:var(--raven-text)] transition hover:border-neon hover:text-neon"
      }
    >
      {label}
    </a>
  );
}

function VersionRow({ release }: { release: ReleaseVersion }) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-[color:var(--raven-line)] bg-[color:var(--raven-bg)]/30 p-5 text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[color:var(--raven-line)] pb-3">
        <h3 className="font-display text-base font-bold tracking-wide">
          v{release.version}
        </h3>
        <span className="font-mono text-[10px] text-[color:var(--raven-muted)]">
          {release.publishedLabel}
        </span>
      </div>
      <ul className="mt-3 divide-y divide-[color:var(--raven-line)]">
        {release.assets.map((asset) => (
          <li key={asset.url}>
            <a
              href={asset.url}
              download={asset.name}
              className="group flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-mono text-[11px] text-[color:var(--raven-text)] group-hover:text-neon">
                {asset.name}
              </span>
              <span className="flex items-center gap-3 font-sans text-[10px] text-[color:var(--raven-muted)]">
                <span>{platformLabel(asset.platform, t)}</span>
                <span>{asset.sizeLabel}</span>
                <span className="rounded-full bg-neon/10 px-2.5 py-1 font-display uppercase tracking-wider text-neon">
                  {t.downloadAction}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReleaseDownloadPanel() {
  const { t } = useI18n();
  const releases = useGitHubReleases();
  const latest = releases.releases[0];
  const hasInstallers = releases.releases.length > 0;

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

          {releases.loading ? (
            <p className="mt-10 font-mono text-xs text-[color:var(--raven-muted)]">
              {t.downloadLoading}
            </p>
          ) : hasInstallers && latest ? (
            <>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {releases.winUrl ? (
                  <DownloadButton
                    href={releases.winUrl}
                    label={t.winLabel}
                    primary
                  />
                ) : null}
                {releases.linuxUrl ? (
                  <DownloadButton href={releases.linuxUrl} label={t.linuxLabel} />
                ) : null}
              </div>
              {releases.msiUrl ? (
                <a
                  href={releases.msiUrl}
                  download
                  className="mt-4 inline-block font-mono text-[11px] text-neon underline underline-offset-4 hover:brightness-110"
                >
                  {t.winMsi} (v{latest.version}) →
                </a>
              ) : null}

              {releases.releases.length > 1 ? (
                <div className="mt-10 space-y-4 text-left">
                  <p className="text-center font-mono text-[10px] uppercase tracking-wider text-neon">
                    {t.downloadPickVersion}
                  </p>
                  {releases.releases.map((rel) => (
                    <VersionRow key={rel.tag} release={rel} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-left">
                  <VersionRow release={latest} />
                </div>
              )}
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[color:var(--raven-line)] bg-[color:var(--raven-bg)]/20 px-6 py-10">
              <p className="font-sans text-sm text-[color:var(--raven-muted)]">
                {t.downloadEmpty}
              </p>
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-[color:var(--raven-muted)]">
                {t.downloadEmptyHint}
              </p>
            </div>
          )}

          <p className="mt-8 font-sans text-[11px] text-[color:var(--raven-muted)]">
            {t.trialNote}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
