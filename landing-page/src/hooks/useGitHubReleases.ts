import { useEffect, useState } from "react";

const RELEASES_API =
  "https://api.github.com/repos/rabbittrix/RAVEN-AI/releases?per_page=100";

export type ReleaseStats = {
  totalDownloads: number;
  latestVersion: string;
  winCount: number;
  linuxCount: number;
  lastReleaseDate: string;
  winUrl: string | null;
  msiUrl: string | null;
  linuxUrl: string | null;
  loading: boolean;
  error: string | null;
};

type GhAsset = {
  name: string;
  download_count: number;
  browser_download_url: string;
};

type GhRelease = {
  tag_name: string;
  published_at: string;
  assets: GhAsset[];
};

function isWinAsset(name: string): boolean {
  const n = name.toLowerCase();
  return n.endsWith(".exe") || n.endsWith(".msi") || n.includes("setup");
}

function isLinuxDeb(name: string): boolean {
  return name.toLowerCase().endsWith(".deb");
}

function pickAsset(assets: GhAsset[], pred: (n: string) => boolean): GhAsset | undefined {
  return assets.find((a) => pred(a.name));
}

function parseReleases(releases: GhRelease[]): Omit<ReleaseStats, "loading" | "error"> {
  let totalDownloads = 0;
  for (const rel of releases) {
    for (const asset of rel.assets ?? []) {
      totalDownloads += asset.download_count ?? 0;
    }
  }

  const latest = releases[0];
  if (!latest) {
    return {
      totalDownloads: 0,
      latestVersion: "—",
      winCount: 0,
      linuxCount: 0,
      lastReleaseDate: "—",
      winUrl: null,
      msiUrl: null,
      linuxUrl: null,
    };
  }

  const assets = latest.assets ?? [];
  const winAssets = assets.filter((a) => isWinAsset(a.name));
  const linuxAssets = assets.filter((a) => isLinuxDeb(a.name));

  const winCount = winAssets.reduce((s, a) => s + (a.download_count ?? 0), 0);
  const linuxCount = linuxAssets.reduce((s, a) => s + (a.download_count ?? 0), 0);

  const exe = pickAsset(assets, (n) => n.toLowerCase().endsWith(".exe"));
  const msi = pickAsset(assets, (n) => n.toLowerCase().endsWith(".msi"));
  const deb = pickAsset(assets, isLinuxDeb);

  return {
    totalDownloads,
    latestVersion: latest.tag_name.replace(/^v/, ""),
    winCount,
    linuxCount,
    lastReleaseDate: new Date(latest.published_at).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    winUrl: exe?.browser_download_url ?? msi?.browser_download_url ?? null,
    msiUrl: msi?.browser_download_url ?? null,
    linuxUrl: deb?.browser_download_url ?? null,
  };
}

const EMPTY: ReleaseStats = {
  totalDownloads: 0,
  latestVersion: "—",
  winCount: 0,
  linuxCount: 0,
  lastReleaseDate: "—",
  winUrl: null,
  msiUrl: null,
  linuxUrl: null,
  loading: true,
  error: null,
};

export function useGitHubReleases(): ReleaseStats {
  const [stats, setStats] = useState<ReleaseStats>(EMPTY);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch(RELEASES_API, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) {
          throw new Error(`GitHub API ${res.status}`);
        }
        const data = (await res.json()) as GhRelease[];
        if (!Array.isArray(data)) {
          throw new Error("Invalid releases payload");
        }
        if (!alive) return;
        setStats({ ...parseReleases(data), loading: false, error: null });
      } catch (err) {
        if (!alive) return;
        setStats({
          ...EMPTY,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load",
        });
      }
    }

    void load();
    return () => {
      alive = false;
    };
  }, []);

  return stats;
}

export const RELEASES_PAGE = "https://github.com/rabbittrix/RAVEN-AI/releases/latest";
