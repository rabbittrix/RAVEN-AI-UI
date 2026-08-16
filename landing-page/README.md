# RAVEN AI — Sovereign Landing Page

Premium marketing site for [RAVEN-AI-UI](https://github.com/rabbittrix/RAVEN-AI-UI) — deployed to GitHub Pages.

**Author:** Roberto de Souza · `rabbittrix@hotmail.com`

## Stack

- React 19 + Vite 6 + Tailwind CSS 3
- Framer Motion (scroll / entry animations)
- GitHub Releases API (live download counter + links)

## Local development

**Run from repo root** (`H:\Raven-ai`), not from `landing-page/`:

```powershell
# Landing page only
npm run landing:install
npm run landing:build
npm run landing:dev

# Or use the helper script
npm run build:landing
```

```powershell
# Windows desktop installers (.exe + .msi) — repo root only
npm run build:win
# or: npm run tauri:build:win
```

```powershell
# Ubuntu .deb — Linux/WSL or GitHub Actions CI
npm run tauri:build:linux
```

> PowerShell does not support `&&`. Use `;` or run commands separately:
> `npm ci; npm run build`

## Deployment pipeline (RAVEN-AI → RAVEN-AI-UI)

```text
RAVEN-AI push/release
  → Build installers (.exe, .msi, .deb) → GitHub Release (RAVEN-AI)
  → deploy-to-ui.yml (RAVEN_SYNC_TOKEN)
  → Sync landing-page/ → RAVEN-AI-UI main
  → deploy-landing.yml → gh-pages (live site + download links)
```

Installers live on [RAVEN-AI Releases](https://github.com/rabbittrix/RAVEN-AI/releases).  
The landing page fetches download counts/links via GitHub API.

## Languages

- English (EN)
- Deutsch (DE)
- Português BR (PT)

## Deployment

CI lives in `.github/workflows/deploy-landing.yml`. Only GitHub user **`rabbittrix`** may deploy.

**Required secrets (Settings → Secrets → Actions):**

| Repo | Secret | Purpose |
| --- | --- | --- |
| **RAVEN-AI-UI** | `RAVEN_SYNC_TOKEN` | Push `gh-pages` + configure Pages API |
| **RAVEN-AI** | `RAVEN_SYNC_TOKEN` | Mirror `landing-page/` to UI repo (optional; skips if unset) |

PAT scopes: `repo`, `workflow`. Author on all CI commits: **Roberto de Souza** only.

**GitHub Pages setup (automatic):** the workflow sets **Branch:** `gh-pages` / **/(root)** after each deploy.

Manual fallback: [Settings → Pages](https://github.com/rabbittrix/RAVEN-AI-UI/settings/pages)

Download artifacts are fetched from: `https://github.com/rabbittrix/RAVEN-AI/releases`

**Monorepo sync:** pushes to `landing-page/` in [RAVEN-AI](https://github.com/rabbittrix/RAVEN-AI) trigger `sync-landing-ui.yml` (uses the same `RAVEN_SYNC_TOKEN` secret on that repo).

## Note

The `author-tools/` folder in the main monorepo is **private** and must never be pushed to the public UI repository (see root `.gitignore`).
