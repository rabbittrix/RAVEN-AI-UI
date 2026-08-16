#!/usr/bin/env node
/**
 * Scan landing-page/public/release/ and write releases.json for the landing site.
 * Usage: node scripts/generate-releases-json.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const releaseRoot = path.join(root, "landing-page", "public", "release");
const outFile = path.join(root, "landing-page", "public", "releases.json");
const baseUrl = (process.argv[2] || "/").replace(/\/?$/, "/");

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

const releases = [];

if (fs.existsSync(releaseRoot)) {
  for (const tag of fs.readdirSync(releaseRoot).sort().reverse()) {
    const dir = path.join(releaseRoot, tag);
    if (!fs.statSync(dir).isDirectory()) continue;

    const assets = [];
    for (const name of fs.readdirSync(dir).sort()) {
      const platform = classify(name);
      if (!platform) continue;
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (!stat.isFile() || stat.size === 0) continue;
      assets.push({
        name,
        url: `${baseUrl}release/${tag}/${name}`,
        downloadCount: 0,
        platform,
        sizeLabel: formatBytes(stat.size),
      });
    }

    if (!assets.length) continue;
    const version = tag.replace(/^v/, "");
    const mtime = fs.statSync(dir).mtime;
    releases.push({
      tag,
      version,
      publishedAt: mtime.toISOString(),
      publishedLabel: mtime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      assets,
    });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: "release-folder",
  releases,
};

fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${releases.length} release(s) to ${outFile}`);
