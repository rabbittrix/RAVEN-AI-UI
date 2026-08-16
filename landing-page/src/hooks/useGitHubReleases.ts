import { useEffect, useState } from "react";

const MANIFEST_URL = `${import.meta.env.BASE_URL}releases.json`;
const RELEASES_API =
  "https://api.github.com/repos/rabbittrix/RAVEN-AI/releases?per_page=100";

export type PlatformKind = "windows-exe" | "windows-msi" | "linux-deb";

export type ReleaseAsset = {
  name: string;
  url: string;
  downloadCount: number;
  platform: PlatformKind;
  sizeLabel: string;
};

export type ReleaseVersion = {
  tag: string;
  version: string;
  publishedAt: string;
  publishedLabel: string;
  assets: ReleaseAsset[];
};

export type ReleaseStats = {
  releases: ReleaseVersion[];
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
  size: number;
};

type GhRelease = {
  tag_name: string;
  published_at: string;
  assets: GhAsset[];
};

type ManifestRelease = ReleaseVersion;

type ReleasesManifest = {
  releases?: ManifestRelease[];
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function classifyAsset(name: string): PlatformKind | null {
  const n = name.toLowerCase();
  if (n.endsWith(".deb")) return "linux-deb";
  if (n.endsWith(".msi")) return "windows-msi";
  if (n.endsWith(".exe")) return "windows-exe";
  return null;
}

function isVersionedRavenAsset(name: string): boolean {
  return /raven-ai-v[\d.]+/i.test(name);
}

function assetSortKey(platform: PlatformKind): number {
  switch (platform) {
    case "windows-exe":
      return 0;
    case "windows-msi":
      return 1;
    case "linux-deb":
      return 2;
  }
}

function mapAssets(raw: GhAsset[]): ReleaseAsset[] {
  const mapped = raw
    .map((a) => {
      const platform = classifyAsset(a.name);
      if (!platform) return null;
      return {
        name: a.name,
        url: a.browser_download_url,
        downloadCount: a.download_count ?? 0,
        platform,
        sizeLabel: formatBytes(a.size ?? 0),
      };
    })
    .filter((a): a is ReleaseAsset => a !== null);

  mapped.sort((a, b) => {
    const va = isVersionedRavenAsset(a.name) ? 0 : 1;
    const vb = isVersionedRavenAsset(b.name) ? 0 : 1;
    if (va !== vb) return va - vb;
    return assetSortKey(a.platform) - assetSortKey(b.platform);
  });

  return mapped;
}

function resolveAssetUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${url.replace(/^\//, "")}`;
}

function normalizeVersions(versions: ReleaseVersion[]): ReleaseVersion[] {
  return versions.map((rel) => ({
    ...rel,
    assets: rel.assets.map((a) => ({ ...a, url: resolveAssetUrl(a.url) })),
  }));
}

function statsFromVersions(versions: ReleaseVersion[]): Omit<ReleaseStats, "loading" | "error"> {
  const normalized = normalizeVersions(versions);
  let totalDownloads = 0;
  for (const rel of normalized) {
    for (const asset of rel.assets) {
      totalDownloads += asset.downloadCount;
    }
  }

  const latest = normalized[0];
  const latestAssets = latest?.assets ?? [];
  const winAssets = latestAssets.filter(
    (a) => a.platform === "windows-exe" || a.platform === "windows-msi",
  );
  const linuxAssets = latestAssets.filter((a) => a.platform === "linux-deb");

  const exe = latestAssets.find((a) => a.platform === "windows-exe");
  const msi = latestAssets.find((a) => a.platform === "windows-msi");
  const deb = latestAssets.find((a) => a.platform === "linux-deb");

  return {
    releases: normalized,
    totalDownloads,
    latestVersion: latest?.version ?? "—",
    winCount: winAssets.reduce((s, a) => s + a.downloadCount, 0),
    linuxCount: linuxAssets.reduce((s, a) => s + a.downloadCount, 0),
    lastReleaseDate: latest?.publishedLabel ?? "—",
    winUrl: exe?.url ?? msi?.url ?? null,
    msiUrl: msi?.url ?? null,
    linuxUrl: deb?.url ?? null,
  };
}

function parseGhReleases(releases: GhRelease[]): Omit<ReleaseStats, "loading" | "error"> {
  const versions: ReleaseVersion[] = [];

  for (const rel of releases) {
    const assets = mapAssets(rel.assets ?? []);
    if (assets.length === 0) continue;

    versions.push({
      tag: rel.tag_name,
      version: rel.tag_name.replace(/^v/, ""),
      publishedAt: rel.published_at,
      publishedLabel: new Date(rel.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      assets,
    });
  }

  return statsFromVersions(versions);
}

function parseManifest(manifest: ReleasesManifest): Omit<ReleaseStats, "loading" | "error"> {
  const versions = (manifest.releases ?? []).map((rel) => ({
    ...rel,
    assets: [...rel.assets].sort((a, b) => assetSortKey(a.platform) - assetSortKey(b.platform)),
  }));
  return statsFromVersions(versions);
}

const EMPTY: ReleaseStats = {
  releases: [],
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

async function loadManifest(): Promise<Omit<ReleaseStats, "loading" | "error"> | null> {
  const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as ReleasesManifest;
  if (!data || !Array.isArray(data.releases)) return null;
  return parseManifest(data);
}

async function loadFromGitHubApi(): Promise<Omit<ReleaseStats, "loading" | "error"> | null> {
  const res = await fetch(RELEASES_API, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) {
    return parseGhReleases([]);
  }
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as GhRelease[];
  if (!Array.isArray(data)) {
    return null;
  }
  return parseGhReleases(data);
}

export function useGitHubReleases(): ReleaseStats {
  const [stats, setStats] = useState<ReleaseStats>(EMPTY);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const manifest = await loadManifest();
        if (!alive) return;
        if (manifest) {
          setStats({ ...manifest, loading: false, error: null });
          return;
        }

        const api = await loadFromGitHubApi();
        if (!alive) return;
        if (api) {
          setStats({ ...api, loading: false, error: null });
          return;
        }

        setStats({
          ...parseGhReleases([]),
          loading: false,
          error: null,
        });
      } catch {
        if (!alive) return;
        setStats({
          ...parseGhReleases([]),
          loading: false,
          error: null,
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

export function platformLabel(
  platform: PlatformKind,
  t: {
    winExe: string;
    winMsi: string;
    linuxDeb: string;
  },
): string {
  switch (platform) {
    case "windows-exe":
      return t.winExe;
    case "windows-msi":
      return t.winMsi;
    case "linux-deb":
      return t.linuxDeb;
  }
}
