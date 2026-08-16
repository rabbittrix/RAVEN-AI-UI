# RAVEN AI — Sovereign Landing Page

Premium marketing site for [RAVEN-AI-UI](https://github.com/rabbittrix/RAVEN-AI-UI) — deployed to GitHub Pages.

**Author:** Roberto de Souza · `rabbittrix@hotmail.com`

## Stack

- React 19 + Vite 6 + Tailwind CSS 3
- Framer Motion (scroll / entry animations)
- GitHub Releases API (live download counter + links)

## Local development

```bash
cd landing-page
npm install
npm run dev
```

Open `http://localhost:5173`

## Production build

```bash
npm run build
GITHUB_PAGES=true npm run build   # base path /RAVEN-AI-UI/ for GitHub Pages
```

## Languages

- English (EN)
- Deutsch (DE)
- Português BR (PT)

## Deployment

CI lives in `.github/workflows/deploy-landing.yml`. Only GitHub user **`rabbittrix`** may deploy.

**GitHub Pages setup (one-time):**

1. Repo **Settings → Pages**
2. **Build and deployment → Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `/ (root)`
4. Save

The workflow pushes built files directly to `gh-pages` (no Actions artifact storage).

Download artifacts are fetched from: `https://github.com/rabbittrix/RAVEN-AI/releases`

## Note

The `author-tools/` folder in the main monorepo is **private** and must never be pushed to the public UI repository (see root `.gitignore`).
