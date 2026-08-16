#!/usr/bin/env bash
# Stage installers, build landing SPA, assemble gh-pages-bundle/ for RAVEN-AI-UI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

BUNDLE="${GH_PAGES_BUNDLE:-gh-pages-bundle}"
RELEASES_REPO="${RELEASES_REPO:-rabbittrix/RAVEN-AI}"
UI_REPO="${GH_PAGES_REPO:-rabbittrix/RAVEN-AI-UI}"
TAG="${RELEASE_TAG:-}"
TOKEN="${GH_TOKEN:-${RAVEN_SYNC_TOKEN:-${GITHUB_TOKEN:-}}}"

mkdir -p landing-page/public/release

echo "=== Preserve gh-pages state from ${UI_REPO} ==="
if [ -n "$TOKEN" ]; then
  rm -rf .ui-pages-cache
  git clone --depth 1 --branch gh-pages --single-branch \
    "https://x-access-token:${TOKEN}@github.com/${UI_REPO}.git" \
    .ui-pages-cache 2>/dev/null || true
  if [ -d .ui-pages-cache/release ]; then
    rsync -a .ui-pages-cache/release/ landing-page/public/release/
    echo "Kept existing gh-pages installers"
  fi
  if [ -f .ui-pages-cache/download-stats.json ]; then
    cp .ui-pages-cache/download-stats.json landing-page/public/download-stats.json
    echo "Kept existing download-stats.json"
  fi
  rm -rf .ui-pages-cache
fi

echo "=== Stage release installers from ${RELEASES_REPO} ==="
if [ -n "$TAG" ]; then
  node scripts/stage-release-assets-for-pages.mjs --repo "$RELEASES_REPO" --tag "$TAG"
else
  node scripts/stage-release-assets-for-pages.mjs --repo "$RELEASES_REPO"
fi

echo "=== Generate releases.json (folder + GitHub API) ==="
RELEASES_REPO="$RELEASES_REPO" node scripts/generate-releases-json.mjs --repo "$RELEASES_REPO"

echo "=== Refresh download-stats.json from releases.json ==="
node scripts/update-download-stats.mjs --init --merge-releases
if [ -n "$TOKEN" ]; then
  node scripts/update-download-stats.mjs --sync-github --merge-releases
fi

echo "=== Build landing SPA ==="
(
  cd landing-page
  npm ci
  npm run build
)

echo "=== Assemble ${BUNDLE}/ ==="
rm -rf "$BUNDLE"
mkdir -p "$BUNDLE"
rsync -a landing-page/dist/ "$BUNDLE/"
touch "$BUNDLE/.nojekyll"
cp landing-page/public/releases.json "$BUNDLE/releases.json"
cp landing-page/public/download-stats.json "$BUNDLE/download-stats.json"
if [ -d landing-page/public/release ]; then
  mkdir -p "$BUNDLE/release"
  rsync -a landing-page/public/release/ "$BUNDLE/release/"
fi

echo "Bundle ready: $(du -sh "$BUNDLE" | cut -f1)"
