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

## Deployment pipeline

```text
RAVEN-AI push/release
  → Build installers (.exe, .msi, .deb) → GitHub Release (RAVEN-AI)
  → deploy-to-ui.yml (RAVEN_SYNC_TOKEN)
  → gh-pages on RAVEN-AI-UI → https://rabbittrix.github.io/RAVEN-AI-UI/
```

Installers live on [RAVEN-AI Releases](https://github.com/rabbittrix/RAVEN-AI/releases).  
The landing page fetches download counts/links via GitHub API.

## Languages

- English (EN)
- Deutsch (DE)
- Português BR (PT)

## Deployment

CI lives in `.github/workflows/deploy-to-ui.yml`. Only GitHub user **`rabbittrix`** may deploy.

No extra secrets are required. The workflow pushes `gh-pages` on **RAVEN-AI** with `GITHUB_TOKEN`.

Optional: add `RAVEN_SYNC_TOKEN` to also mirror [RAVEN-AI-UI](https://github.com/rabbittrix/RAVEN-AI-UI). See `.github/RAVEN_SYNC_TOKEN_SETUP.md`.

**GitHub Pages:** **Settings → Pages → Branch:** `gh-pages` / **(root)** (the workflow tries to set this automatically).

Download artifacts are fetched from: `https://github.com/rabbittrix/RAVEN-AI/releases`

## Note

The `author-tools/` folder in the main monorepo is **private** and must never be pushed to the public UI repository (see root `.gitignore`).
