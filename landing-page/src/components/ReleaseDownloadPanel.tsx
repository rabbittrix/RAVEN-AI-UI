import { GlassCard } from "@/components/GlassCard";
import {
  platformLabel,
  type ReleaseVersion,
  useGitHubReleases,
} from "@/hooks/useGitHubReleases";
import { useI18n } from "@/i18n/I18nProvider";

function DirectDownloadLink({
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
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? "rounded-xl bg-gradient-to-r from-neon-dim to-neon px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-white shadow-neon transition hover:brightness-110"
          : "glass rounded-xl px-6 py-3 font-display text-xs uppercase tracking-[0.18em] transition hover:border-neon"
      }
    >
      {label}
    </a>
  );
}

function DisabledDownloadButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Installer not published yet"
      className="cursor-not-allowed rounded-xl border border-[color:var(--raven-line)] px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-[color:var(--raven-muted)] opacity-60"
    >
      {label}
    </button>
  );
}

function VersionRow({ release }: { release: ReleaseVersion }) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-[color:var(--raven-line)] bg-[color:var(--raven-bg)]/40 p-4 text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-sm font-bold tracking-wide">
          v{release.version}
        </h3>
        <span className="font-mono text-[10px] text-[color:var(--raven-muted)]">
          {release.publishedLabel}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {release.assets.map((asset) => (
          <li key={asset.url}>
            <a
              href={asset.url}
              download={asset.name}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-wrap items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2 transition hover:border-neon/40 hover:bg-neon/5"
            >
              <span className="font-mono text-[11px] text-[color:var(--raven-text)] group-hover:text-neon">
                {asset.name}
              </span>
              <span className="flex items-center gap-3 font-sans text-[10px] text-[color:var(--raven-muted)]">
                <span>{platformLabel(asset.platform, t)}</span>
                <span>{asset.sizeLabel}</span>
                <span className="rounded bg-neon/10 px-2 py-0.5 font-display uppercase tracking-wider text-neon">
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

  const hasWin = Boolean(releases.winUrl);
  const hasLinux = Boolean(releases.linuxUrl);

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

          {!releases.loading && !releases.error ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {hasWin ? (
                <DirectDownloadLink
                  href={releases.winUrl!}
                  label={t.winLabel}
                  primary
                />
              ) : (
                <DisabledDownloadButton label={t.winLabel} />
              )}
              {hasLinux ? (
                <DirectDownloadLink href={releases.linuxUrl!} label={t.linuxLabel} />
              ) : (
                <DisabledDownloadButton label={t.linuxLabel} />
              )}
            </div>
          ) : null}

          {releases.msiUrl ? (
            <a
              href={releases.msiUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-[11px] text-neon underline underline-offset-4"
            >
              {t.winMsi} (v{releases.latestVersion}) →
            </a>
          ) : null}

          <div className="mt-8 text-left">
            {releases.loading ? (
              <p className="text-center font-mono text-xs text-[color:var(--raven-muted)]">
                {t.downloadLoading}
              </p>
            ) : releases.error ? (
              <p className="text-center font-mono text-xs text-red-400">
                {t.downloadError}: {releases.error}
              </p>
            ) : releases.releases.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--raven-line)] px-4 py-8 text-center">
                <p className="font-sans text-sm text-[color:var(--raven-muted)]">
                  {t.downloadEmpty}
                </p>
                <p className="mt-2 font-mono text-[10px] text-[color:var(--raven-muted)]">
                  {t.downloadEmptyHint}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center font-mono text-[10px] uppercase tracking-wider text-neon">
                  {t.downloadPickVersion}
                </p>
                {releases.releases.map((rel) => (
                  <VersionRow key={rel.tag} release={rel} />
                ))}
              </div>
            )}
          </div>

          <p className="mt-6 font-sans text-[11px] text-[color:var(--raven-muted)]">
            {t.trialNote}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
