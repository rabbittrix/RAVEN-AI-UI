#!/usr/bin/env node
/**
 * Write landing-page/public/releases.json from gh-pages release/ folder
 * plus GitHub Releases API (so new tags appear before installers are staged).
 *
 * Usage:
 *   node scripts/generate-releases-json.mjs
 *   GH_TOKEN=... node scripts/generate-releases-json.mjs --repo rabbittrix/RAVEN-AI
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const releaseRoot = path.join(root, "landing-page", "public", "release");
const outFile = path.join(root, "landing-page", "public", "releases.json");
const statsFile = path.join(root, "landing-page", "public", "download-stats.json");

const args = process.argv.slice(2);
let repo = process.env.RELEASES_REPO || process.env.GITHUB_REPOSITORY || "rabbittrix/RAVEN-AI";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--repo" && args[i + 1]) repo = args[++i];
}

function loadDownloadStats() {
  if (!fs.existsSync(statsFile)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(statsFile, "utf8"));
    return data.assets && typeof data.assets === "object" ? data.assets : {};
  } catch {
    return {};
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function classify(name) {
  const n = name.toLowerCase();
  if (n.endsWith(".deb")) return "linux-deb";
  if (n.endsWith(".msi")) return "windows-msi";
  if (n.endsWith(".exe")) return "windows-exe";
  return null;
}

function compareTags(a, b) {
  const pa = a.replace(/^v/i, "").split(".").map((x) => Number.parseInt(x, 10) || 0);
  const pb = b.replace(/^v/i, "").split(".").map((x) => Number.parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function localAsset(tag, name) {
  const full = path.join(releaseRoot, tag, name);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return null;
  const stat = fs.statSync(full);
  if (stat.size === 0) return null;
  return {
    name,
    url: `release/${tag}/${name}`,
    size: stat.size,
    sizeLabel: formatBytes(stat.size),
  };
}

function assetSortKey(platform) {
  switch (platform) {
    case "windows-exe":
      return 0;
    case "windows-msi":
      return 1;
    case "linux-deb":
      return 2;
    default:
      return 9;
  }
}

function expectedInstallerNames(tag) {
  const t = tag.startsWith("v") ? tag : `v${tag}`;
  return [
    `raven-ai-${t}-setup.exe`,
    `raven-ai-${t}.msi`,
    `raven-ai-${t}_amd64.deb`,
  ];
}

function buildAssetsForTag(tag, ghAssets, downloadStats) {
  const byName = new Map();

  for (const gh of ghAssets ?? []) {
    const platform = classify(gh.name);
    if (!platform) continue;
    const local = localAsset(tag, gh.name);
    byName.set(gh.name, {
      name: gh.name,
      url: local?.url ?? gh.browser_download_url,
      downloadCount: Math.max(
        downloadStats[gh.name] ?? 0,
        gh.download_count ?? 0,
      ),
      platform,
      sizeLabel: local?.sizeLabel ?? formatBytes(gh.size ?? 0),
    });
  }

  const dir = path.join(releaseRoot, tag);
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (byName.has(name)) continue;
      const platform = classify(name);
      if (!platform) continue;
      const local = localAsset(tag, name);
      if (!local) continue;
      byName.set(name, {
        name,
        url: local.url,
        downloadCount: downloadStats[name] ?? 0,
        platform,
        sizeLabel: local.sizeLabel,
      });
    }
  }

  if (byName.size === 0) {
    for (const name of expectedInstallerNames(tag)) {
      const platform = classify(name);
      if (!platform) continue;
      const local = localAsset(tag, name);
      if (!local) continue;
      byName.set(name, {
        name,
        url: local.url,
        downloadCount: downloadStats[name] ?? 0,
        platform,
        sizeLabel: local.sizeLabel,
      });
    }
  }

  return [...byName.values()].sort(
    (a, b) => assetSortKey(a.platform) - assetSortKey(b.platform),
  );
}

function releasesFromFolder(downloadStats) {
  const releases = [];
  if (!fs.existsSync(releaseRoot)) return releases;

  for (const tag of fs.readdirSync(releaseRoot)) {
    const dir = path.join(releaseRoot, tag);
    if (!fs.statSync(dir).isDirectory()) continue;
    const assets = buildAssetsForTag(tag, [], downloadStats);
    if (!assets.length) continue;
    const mtime = fs.statSync(dir).mtime;
    releases.push({
      tag,
      version: tag.replace(/^v/i, ""),
      publishedAt: mtime.toISOString(),
      publishedLabel: mtime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      assets,
    });
  }

  return releases.sort((a, b) => compareTags(a.tag, b.tag));
}

async function fetchGitHubReleases(token) {
  if (!token) return [];
  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    console.warn(`GitHub Releases API ${res.status} — using release/ folder only`);
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function mergeReleases(folderReleases, apiReleases, downloadStats) {
  const byTag = new Map(folderReleases.map((r) => [r.tag, r]));

  for (const gh of apiReleases) {
    const tag = gh.tag_name;
    if (!tag) continue;
    let assets = buildAssetsForTag(tag, gh.assets ?? [], downloadStats);

    if (!assets.length) {
      assets = expectedInstallerNames(tag)
        .map((name) => {
          const platform = classify(name);
          if (!platform) return null;
          const local = localAsset(tag, name);
          return {
            name,
            url: local?.url ?? `release/${tag}/${name}`,
            downloadCount: downloadStats[name] ?? 0,
            platform,
            sizeLabel: local?.sizeLabel ?? "Pending",
          };
        })
        .filter(Boolean);
    }

    if (!assets.length) continue;

    const publishedAt = gh.published_at ?? new Date().toISOString();
    byTag.set(tag, {
      tag,
      version: tag.replace(/^v/i, ""),
      publishedAt,
      publishedLabel: new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      assets,
    });
  }

  return [...byTag.values()].sort((a, b) => compareTags(a.tag, b.tag));
}

async function main() {
  const downloadStats = loadDownloadStats();
  const token =
    process.env.GH_TOKEN ??
    process.env.RAVEN_SYNC_TOKEN ??
    process.env.GITHUB_TOKEN ??
    "";

  const folderReleases = releasesFromFolder(downloadStats);
  const apiReleases = await fetchGitHubReleases(token);
  const releases = apiReleases.length
    ? mergeReleases(folderReleases, apiReleases, downloadStats)
    : folderReleases;

  const source = apiReleases.length ? "release-folder+github-api" : "release-folder";
  const manifest = {
    generatedAt: new Date().toISOString(),
    source,
    releases,
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${releases.length} release(s) to ${outFile} (${source})`);
  for (const rel of releases) {
    console.log(`  ${rel.tag}: ${rel.assets.map((a) => a.name).join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
