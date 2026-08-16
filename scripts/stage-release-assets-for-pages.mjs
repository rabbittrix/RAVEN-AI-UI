#!/usr/bin/env node
/**
 * Download GitHub Release installer assets into landing-page/public/release/<tag>/
 * for gh-pages hosting (relative URLs in releases.json).
 *
 * Usage:
 *   node scripts/stage-release-assets-for-pages.mjs
 *   node scripts/stage-release-assets-for-pages.mjs --tag v1.0.1
 *   GH_TOKEN=... node scripts/stage-release-assets-for-pages.mjs --repo rabbittrix/RAVEN-AI
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const releaseRoot = path.join(root, "landing-page", "public", "release");

const args = process.argv.slice(2);
let tagFilter = null;
let repo = process.env.GITHUB_REPOSITORY || "rabbittrix/RAVEN-AI";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--tag" && args[i + 1]) {
    let t = args[++i].trim();
    tagFilter = t.startsWith("v") ? t : `v${t}`;
  } else if (args[i] === "--repo" && args[i + 1]) {
    repo = args[++i];
  }
}

// normalize --tag value
if (tagFilter && !tagFilter.startsWith("v")) {
  tagFilter = `v${tagFilter}`;
}

const token =
  process.env.GH_TOKEN ||
  process.env.RAVEN_SYNC_TOKEN ||
  process.env.GITHUB_TOKEN ||
  "";

if (!token) {
  console.warn("stage-release-assets: no GH token — skipping download (local release/ folder only)");
  process.exit(0);
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function downloadAsset(asset, destPath) {
  const res = await fetch(asset.url, {
    headers: {
      ...headers,
      Accept: "application/octet-stream",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Download failed ${asset.name}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

function isInstaller(name) {
  return /\.(exe|msi|deb)$/i.test(name);
}

async function stageRelease(release) {
  const tag = release.tag_name;
  const dir = path.join(releaseRoot, tag);
  fs.mkdirSync(dir, { recursive: true });

  const installers = (release.assets || []).filter((a) => isInstaller(a.name));
  if (!installers.length) {
    console.warn(`  ${tag}: no installer assets on GitHub Release`);
    return 0;
  }

  let count = 0;
  for (const asset of installers) {
    const dest = path.join(dir, asset.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`  ${tag}/${asset.name} (already staged)`);
      count++;
      continue;
    }
    const bytes = await downloadAsset(asset, dest);
    console.log(`  ${tag}/${asset.name} (${(bytes / (1024 * 1024)).toFixed(1)} MB)`);
    count++;
  }
  return count;
}

async function main() {
  fs.mkdirSync(releaseRoot, { recursive: true });

  let releases;
  if (tagFilter) {
    const one = await ghJson(
      `https://api.github.com/repos/${repo}/releases/tags/${tagFilter}`,
    );
    releases = one ? [one] : [];
  } else {
    releases = (await ghJson(`https://api.github.com/repos/${repo}/releases?per_page=20`)) || [];
  }

  if (!releases.length) {
    console.warn(`stage-release-assets: no releases found on ${repo}${tagFilter ? ` tag ${tagFilter}` : ""}`);
    return;
  }

  let total = 0;
  for (const rel of releases) {
    total += await stageRelease(rel);
  }
  console.log(`Staged ${total} installer file(s) under landing-page/public/release/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
