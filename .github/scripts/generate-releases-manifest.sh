#!/usr/bin/env bash
# Write landing-page/public/releases.json from GitHub Releases (works for private repos in CI).
set -euo pipefail

OUT="${1:-landing-page/public/releases.json}"
REPO="${GITHUB_REPOSITORY:-rabbittrix/RAVEN-AI}"
TOKEN="${GH_TOKEN:-${RAVEN_SYNC_TOKEN:-${GITHUB_TOKEN:-}}}"

mkdir -p "$(dirname "$OUT")"

if [ -z "$TOKEN" ]; then
  echo "::warning::No GitHub token — writing empty releases manifest"
  printf '{"generatedAt":null,"source":"empty","releases":[]}\n' > "$OUT"
  exit 0
fi

JSON=$(curl -sSf \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${REPO}/releases?per_page=100")

node -e "
const fs = require('fs');
const raw = JSON.parse(process.argv[1]);
const releases = (Array.isArray(raw) ? raw : [])
  .map((rel) => {
    const assets = (rel.assets || [])
      .filter((a) => /\.(exe|msi|deb)$/i.test(a.name))
      .map((a) => {
        const n = a.name.toLowerCase();
        let platform = 'windows-exe';
        if (n.endsWith('.msi')) platform = 'windows-msi';
        if (n.endsWith('.deb')) platform = 'linux-deb';
        const bytes = a.size || 0;
        const sizeLabel =
          bytes < 1024 ? bytes + ' B' :
          bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB' :
          (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return {
          name: a.name,
          url: a.browser_download_url,
          downloadCount: a.download_count || 0,
          platform,
          sizeLabel,
        };
      });
    if (!assets.length) return null;
    return {
      tag: rel.tag_name,
      version: String(rel.tag_name).replace(/^v/, ''),
      publishedAt: rel.published_at,
      publishedLabel: new Date(rel.published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      }),
      assets,
    };
  })
  .filter(Boolean);

const out = {
  generatedAt: new Date().toISOString(),
  source: 'github-api',
  releases,
};

fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 2));
console.log('Wrote ' + releases.length + ' release(s) to ' + process.argv[2]);
" "$JSON" "$OUT"
