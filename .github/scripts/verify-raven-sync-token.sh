#!/usr/bin/env bash
# Verify RAVEN_SYNC_TOKEN belongs to Roberto de Souza (GitHub: rabbittrix).
# All CI pushes must use this token — never GITHUB_TOKEN (github-actions[bot]).
set -euo pipefail

if [ -z "${RAVEN_SYNC_TOKEN:-}" ]; then
  echo "::error::RAVEN_SYNC_TOKEN is required for pushes attributed to Roberto de Souza."
  echo "See .github/RAVEN_SYNC_TOKEN_SETUP.md — add a fine-grained PAT on the **rabbittrix** account:"
  echo "  https://github.com/rabbittrix/RAVEN-AI/settings/secrets/actions"
  exit 1
fi

LOGIN=$(curl -sSf \
  -H "Authorization: Bearer ${RAVEN_SYNC_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user | jq -r .login)

if [ "$LOGIN" != "rabbittrix" ]; then
  echo "::error::RAVEN_SYNC_TOKEN must belong to Roberto de Souza (@rabbittrix). Current token user: ${LOGIN}"
  exit 1
fi

echo "Push identity verified: Roberto de Souza (@${LOGIN})"
