import { useGitHubReleases } from "@/hooks/useGitHubReleases";
import { useI18n } from "@/i18n/I18nProvider";

export function TrustFooter() {
  const { t } = useI18n();
  const stats = useGitHubReleases();

  return (
    <footer className="border-t border-[color:var(--raven-line)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-2xl px-5 py-4 text-center font-mono text-[11px] leading-relaxed text-[color:var(--raven-muted)] md:text-xs">
          {stats.loading ? (
            <p>{t.footerLoading}</p>
          ) : stats.error ? (
            <p>
              {t.footerError}: {stats.error}
            </p>
          ) : (
            <>
              <p>
                <span className="text-[color:var(--raven-text)]">
                  {t.footerTotal}:
                </span>{" "}
                {stats.totalDownloads.toLocaleString()}
              </p>
              <p className="mt-1">
                v{stats.latestVersion} ({t.footerWin}):{" "}
                {stats.winCount.toLocaleString()} | v{stats.latestVersion} (
                {t.footerLinux}): {stats.linuxCount.toLocaleString()}
              </p>
              <p className="mt-1">
                {t.footerLast}: {stats.lastReleaseDate}
              </p>
            </>
          )}
        </div>
        <p className="mt-6 text-center font-sans text-[11px] text-[color:var(--raven-muted)]">
          {t.footerRights}
          <br />
          <a
            href="mailto:rabbittrix@hotmail.com"
            className="text-neon hover:underline"
          >
            rabbittrix@hotmail.com
          </a>
          {" · "}
          <a
            href="https://github.com/rabbittrix/RAVEN-AI"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neon"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
