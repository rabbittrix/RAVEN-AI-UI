#!/usr/bin/env bash
# Resolve CI token: prefer Roberto de Souza PAT, fall back to GITHUB_TOKEN.
set -euo pipefail

MODE="${1:-require}" # require | prefer-roberto

if [ -n "${RAVEN_SYNC_TOKEN:-}" ]; then
  LOGIN=$(curl -sSf \
    -H "Authorization: Bearer ${RAVEN_SYNC_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/user | jq -r .login)
  if [ "$LOGIN" != "rabbittrix" ]; then
    echo "::error::RAVEN_SYNC_TOKEN must belong to Roberto de Souza (@rabbittrix). Got: ${LOGIN}"
    exit 1
  fi
  {
    echo "token=${RAVEN_SYNC_TOKEN}"
    echo "mode=roberto"
  } >> "${GITHUB_OUTPUT}"
  echo "Push identity: Roberto de Souza (@rabbittrix)"
  exit 0
fi

if [ "$MODE" = "require" ]; then
  echo "::error::RAVEN_SYNC_TOKEN is required for pushes attributed to Roberto de Souza."
  echo "See .github/RAVEN_SYNC_TOKEN_SETUP.md"
  exit 1
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  {
    echo "token=${GITHUB_TOKEN}"
    echo "mode=actions"
  } >> "${GITHUB_OUTPUT}"
  echo "::warning::RAVEN_SYNC_TOKEN not set — using GITHUB_TOKEN. Add Roberto PAT for exclusive push identity."
  exit 0
fi

echo "::error::No GitHub token available (RAVEN_SYNC_TOKEN or GITHUB_TOKEN)."
exit 1
