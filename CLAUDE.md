@AGENTS.md

# CLAUDE.md

Global rules (git, security, ticket flow, commit format) come from `~/.claude`. Only repo-specific facts here. Structure, commands, style: `AGENTS.md` (shared with Codex).

## Repo-specific

- **Branch:** work directly on `main`. Netlify auto-deploys on push, so run `npm run build` before pushing.
- **Tickets:** clinban board in `tickets/`. No `pipeline/` or `kb/` in this repo yet.
- **Before commit:** `npm run build`; also `npm run test:a11y` for template/CSS/content changes. `test:a11y` starts a background dev server — if it lingers, `pkill -f "eleventy --serve"`.
- **Approach gate:** propose before coding only for design, multi-file, or build-system changes. Small content/CSS fixes: just do them.

## Site context

- Personal site of a senior IT architect: promotes AI architecture courses for senior developers and direct consulting.
- **Language: Polish** for all posts and UI copy. English version is a future goal — keep strings and content i18n-friendly (no hardcoded copy in JS), but do not build i18n yet.
- Design taste: dimmed pastel palette close to Solarized; strong typographic contrast.
- Content is authored as Markdown files in `src/posts/YYYY/YYYY-MM-DD-slug.md`, committed via git. The Sveltia CMS in `src/admin/` is a proof of concept; ignore it unless asked.

## Gotchas

- Tailwind is NOT used conventionally: preflight and most core plugins are off; it only emits token custom properties, spacing utilities and low-specificity utilities. Do not add stock Tailwind classes expecting a full framework.
- CSS layers order (low→high): tailwindBase, reset, fonts, tailwindComponents, variables, global, compositions, blocks, utilities, tailwindUtilities. Global CSS is `src/assets/css/global/global.css`.
- Colors: edit `colorsBase.json`, run `npm run colors`. If color names change, update `src/assets/css/global/base/variables.css`.
- Generated, never edit: `dist/`, `src/_includes/css/`, `src/_includes/scripts/`, `colors.json`.
