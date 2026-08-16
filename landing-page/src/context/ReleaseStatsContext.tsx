import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  assetDownloadTotal,
  fetchGlobalDownloadStats,
  notifyGlobalDownload,
  persistDownload,
  readStoredDownloads,
  type AssetDownloadMap,
} from "@/lib/downloadStats";
import {
  useGitHubReleases,
  type ReleaseStats,
} from "@/hooks/useGitHubReleases";

type ReleaseStatsContextValue = ReleaseStats & {
  recordDownload: (assetName: string) => void;
};

const ReleaseStatsContext = createContext<ReleaseStatsContextValue | null>(null);

function mergeReleaseStats(
  base: ReleaseStats,
  global: AssetDownloadMap,
  pending: AssetDownloadMap,
): ReleaseStats {
  const releases = base.releases.map((rel) => ({
    ...rel,
    assets: rel.assets.map((asset) => {
      const downloadCount = assetDownloadTotal(
        asset.name,
        asset.downloadCount,
        global,
        pending,
      );
      return { ...asset, downloadCount };
    }),
  }));

  let totalDownloads = 0;
  for (const rel of releases) {
    for (const asset of rel.assets) {
      totalDownloads += asset.downloadCount;
    }
  }

  const latest = releases[0];
  const latestAssets = latest?.assets ?? [];
  const winAssets = latestAssets.filter(
    (a) => a.platform === "windows-exe" || a.platform === "windows-msi",
  );
  const linuxAssets = latestAssets.filter((a) => a.platform === "linux-deb");

  const exe = latestAssets.find((a) => a.platform === "windows-exe");
  const msi = latestAssets.find((a) => a.platform === "windows-msi");
  const deb = latestAssets.find((a) => a.platform === "linux-deb");

  return {
    ...base,
    releases,
    totalDownloads,
    latestVersion: latest?.version ?? base.latestVersion,
    winCount: winAssets.reduce((s, a) => s + a.downloadCount, 0),
    linuxCount: linuxAssets.reduce((s, a) => s + a.downloadCount, 0),
    lastReleaseDate: latest?.publishedLabel ?? base.lastReleaseDate,
    winUrl: exe?.url ?? msi?.url ?? base.winUrl,
    msiUrl: msi?.url ?? base.msiUrl,
    linuxUrl: deb?.url ?? base.linuxUrl,
  };
}

export function ReleaseStatsProvider({ children }: { children: ReactNode }) {
  const base = useGitHubReleases();
  const [pendingDownloads, setPendingDownloads] = useState<AssetDownloadMap>(() =>
    readStoredDownloads(),
  );
  const [globalDownloads, setGlobalDownloads] = useState<AssetDownloadMap>({});

  const refreshGlobal = useCallback(async () => {
    const stats = await fetchGlobalDownloadStats();
    setGlobalDownloads((prevGlobal) => {
      setPendingDownloads((pending) => {
        const next = { ...pending };
        for (const [name, count] of Object.entries(stats)) {
          const delta = count - (prevGlobal[name] ?? 0);
          if (delta > 0 && next[name]) {
            next[name] = Math.max(0, next[name] - delta);
            if (next[name] === 0) delete next[name];
          }
        }
        return next;
      });
      return stats;
    });
  }, []);

  useEffect(() => {
    void refreshGlobal();
  }, [refreshGlobal]);

  const recordDownload = useCallback(
    (assetName: string) => {
      setPendingDownloads(persistDownload(assetName));
      void notifyGlobalDownload(assetName);
      window.setTimeout(() => {
        void refreshGlobal();
      }, 4000);
    },
    [refreshGlobal],
  );

  const stats = useMemo(
    () => mergeReleaseStats(base, globalDownloads, pendingDownloads),
    [base, globalDownloads, pendingDownloads],
  );

  const value = useMemo(
    () => ({ ...stats, recordDownload }),
    [stats, recordDownload],
  );

  return (
    <ReleaseStatsContext.Provider value={value}>
      {children}
    </ReleaseStatsContext.Provider>
  );
}

export function useReleaseStats(): ReleaseStatsContextValue {
  const ctx = useContext(ReleaseStatsContext);
  if (!ctx) {
    throw new Error("useReleaseStats must be used within ReleaseStatsProvider");
  }
  return ctx;
}
