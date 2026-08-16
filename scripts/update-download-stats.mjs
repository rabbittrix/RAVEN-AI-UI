#!/usr/bin/env node
/**
 * Maintain landing-page/public/download-stats.json (global installer counts).
 *
 * Usage:
 *   node scripts/update-download-stats.mjs --init
 *   node scripts/update-download-stats.mjs --asset raven-ai-v1.0.1-setup.exe
 *   node scripts/update-download-stats.mjs --sync-github
 *   node scripts/update-download-stats.mjs --asset foo --merge-releases
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function parseArgs(argv) {
  const opts = {
    init: false,
    syncGithub: false,
    mergeReleases: false,
    asset: null,
    set: null,
    file: path.join(root, "landing-page", "public", "download-stats.json"),
    releasesFile: path.join(root, "landing-page", "public", "releases.json"),
    releaseRoot: path.join(root, "landing-page", "public", "release"),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--init") opts.init = true;
    else if (arg === "--sync-github") opts.syncGithub = true;
    else if (arg === "--merge-releases") opts.mergeReleases = true;
    else if (arg === "--asset") opts.asset = argv[++i];
    else if (arg === "--set") opts.set = argv[++i];
    else if (arg === "--file") opts.file = path.resolve(argv[++i]);
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/update-download-stats.mjs --init
  node scripts/update-download-stats.mjs --asset <installer-name>
  node scripts/update-download-stats.mjs --set <name>=<count>
  node scripts/update-download-stats.mjs --sync-github [--merge-releases]
`);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  return opts;
}

function classify(name) {
  const n = name.toLowerCase();
  if (n.endsWith(".deb")) return "linux-deb";
  if (n.endsWith(".msi")) return "windows-msi";
  if (n.endsWith(".exe")) return "windows-exe";
  return null;
}

function loadStats(file) {
  if (!fs.existsSync(file)) {
    return { updatedAt: null, assets: {} };
  }
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return {
      updatedAt: data.updatedAt ?? null,
      assets: data.assets && typeof data.assets === "object" ? data.assets : {},
    };
  } catch {
    return { updatedAt: null, assets: {} };
  }
}

function saveStats(file, stats) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const payload = {
    updatedAt: new Date().toISOString(),
    assets: stats.assets,
  };
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

function discoverAssetNames(releaseRoot, releasesFile) {
  const names = new Set();

  if (fs.existsSync(releaseRoot)) {
    for (const tag of fs.readdirSync(releaseRoot)) {
      const dir = path.join(releaseRoot, tag);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const name of fs.readdirSync(dir)) {
        if (classify(name)) names.add(name);
      }
    }
  }

  if (fs.existsSync(releasesFile)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(releasesFile, "utf8"));
      for (const rel of manifest.releases ?? []) {
        for (const asset of rel.assets ?? []) {
          if (asset?.name) names.add(asset.name);
        }
      }
    } catch {
      /* ignore malformed manifest */
    }
  }

  return [...names].sort();
}

function initStats(stats, releaseRoot, releasesFile) {
  const names = discoverAssetNames(releaseRoot, releasesFile);
  for (const name of names) {
    if (typeof stats.assets[name] !== "number") {
      stats.assets[name] = 0;
    }
  }
  return stats;
}

async function syncFromGitHub(stats, repo, token) {
  if (!token) {
    console.warn("No GH_TOKEN — skipping GitHub Releases sync");
    return stats;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    console.warn(`GitHub Releases sync failed (${res.status})`);
    return stats;
  }

  const releases = await res.json();
  if (!Array.isArray(releases)) return stats;

  for (const rel of releases) {
    for (const asset of rel.assets ?? []) {
      if (!asset?.name || !classify(asset.name)) continue;
      const remote = asset.download_count ?? 0;
      const current = stats.assets[asset.name] ?? 0;
      stats.assets[asset.name] = Math.max(current, remote);
    }
  }

  return stats;
}

function mergeIntoReleases(releasesFile, stats) {
  if (!fs.existsSync(releasesFile)) return;

  const manifest = JSON.parse(fs.readFileSync(releasesFile, "utf8"));
  let changed = false;

  for (const rel of manifest.releases ?? []) {
    for (const asset of rel.assets ?? []) {
      const next = stats.assets[asset.name] ?? asset.downloadCount ?? 0;
      if (asset.downloadCount !== next) {
        asset.downloadCount = next;
        changed = true;
      }
    }
  }

  if (changed) {
    manifest.generatedAt = new Date().toISOString();
    fs.writeFileSync(releasesFile, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Merged download counts into ${releasesFile}`);
  }
}

const opts = parseArgs(process.argv.slice(2));

if (!opts.init && !opts.syncGithub && !opts.asset && !opts.set) {
  console.error("Provide --init, --asset, --set, or --sync-github");
  process.exit(1);
}

let stats = loadStats(opts.file);

if (opts.init) {
  stats = initStats(stats, opts.releaseRoot, opts.releasesFile);
}

if (opts.syncGithub) {
  const repo = process.env.GITHUB_REPOSITORY ?? "rabbittrix/RAVEN-AI";
  const token =
    process.env.GH_TOKEN ??
    process.env.RAVEN_SYNC_TOKEN ??
    process.env.GITHUB_TOKEN ??
    "";
  stats = await syncFromGitHub(stats, repo, token);
}

if (opts.set) {
  const eq = opts.set.indexOf("=");
  if (eq <= 0) {
    console.error("--set expects name=count");
    process.exit(1);
  }
  const name = opts.set.slice(0, eq);
  const count = Number.parseInt(opts.set.slice(eq + 1), 10);
  if (!Number.isFinite(count) || count < 0) {
    console.error("--set count must be a non-negative integer");
    process.exit(1);
  }
  stats.assets[name] = count;
}

if (opts.asset) {
  if (!classify(opts.asset)) {
    console.error(`Not a recognized installer asset: ${opts.asset}`);
    process.exit(1);
  }
  stats = initStats(stats, opts.releaseRoot, opts.releasesFile);
  stats.assets[opts.asset] = (stats.assets[opts.asset] ?? 0) + 1;
}

const saved = saveStats(opts.file, stats);
console.log(`Updated ${opts.file}`);
console.log(JSON.stringify(saved.assets, null, 2));

if (opts.mergeReleases) {
  mergeIntoReleases(opts.releasesFile, stats);
}
