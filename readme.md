# adamkucharczyk.pl

Personal site. Promotes AI architecture courses and consulting.

## Stack

- [Eleventy 3](https://www.11ty.dev/) — static site generator
- CUBE CSS + Tailwind (tokens/utilities only, no preflight) — see CLAUDE.md for CSS architecture
- Netlify — auto-deploy on push to `main`

## Commands

```bash
npm start           # dev server + watch
npm run build       # production build → dist/
npm run colors      # regenerate color palette from colorsBase.json
npm run test:a11y   # accessibility tests (pa11y)
```

## Key locations

| What | Where |
|------|-------|
| Site metadata, nav | `src/_data/meta.js` |
| Design tokens | `src/_data/designTokens/` |
| Color source (edit this) | `src/_data/designTokens/colorsBase.json` |
| Global CSS entry | `src/assets/css/global/global.css` |
| Pages | `src/pages/` |
| Posts | `src/posts/YYYY/` |
| Layouts | `src/_layouts/` |

## Deployment

Push to `main` → Netlify builds and deploys automatically.
Rollback: revert commit and push, or use Netlify UI.
