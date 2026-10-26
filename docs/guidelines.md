# Development guidelines

Single source of rules for writing and checking code on adamkucharczyk.pl. `CLAUDE.md`,
`AGENTS.md`, the dev agent and `readme.md` point here; do not restate these rules elsewhere.
Structure, commands and deployment: `AGENTS.md`.

## 1. Linear development

- Only the current and the future state matter. No backward compatibility, no "legacy" code
  paths, no options or files kept for later, no commented-out code, no unused dependencies.
  Git is the undo: remove, and revert if needed.
- No defensive code for cases that cannot happen here. Inputs are ours (front matter, data
  files, templates); a wrong input should fail the build loudly, not be tolerated silently.
- Linear is not careless: the quality gates (§11) are mandatory, and removal needs proof of
  non-use (grep the sources, check the built HTML).
- A feature that returns (blog, images, dark theme, client-side JS) is built for the need at
  hand, not restored from the original template.

## 2. Architecture

- Eleventy 3 with Nunjucks and Markdown; output is static HTML with inlined CSS and no
  client-side JavaScript. Adding JS needs a reason in the ticket or design.
- Configuration lives in `src/_config/` as small modules with named exports, registered in
  `eleventy.config.js`.
- A new npm dependency needs a reason in the ticket or design; prefer a few lines of code.
- Generated, never edited by hand: `dist/`, `src/_includes/css/`,
  `src/_data/designTokens/colors.json`.

## 3. CSS and design tokens

- CUBE CSS. Layer order (low → high): tailwindBase, reset, fonts, tailwindComponents,
  variables, global, compositions, blocks, utilities, tailwindUtilities. Entry:
  `src/assets/css/global/global.css`.
- Tailwind only turns design tokens into custom properties and a few utilities; preflight and
  most core plugins are off. Do not use stock Tailwind classes.
- Tokens in `src/_data/designTokens/` are the source of truth. Use `var(--color-*)`,
  `var(--font-base|display|mono)`, `var(--space-*)` instead of literal values. Some older
  blocks still hold literal sizes; replace them when you touch the block.
- Colours: edit `colorsBase.json`, run `npm run colors`; if colour names change, update
  `src/assets/css/global/base/variables.css`.
- One light theme (Solarized Light): `color-scheme: light`, `theme-color` from the background
  token (`src/_data/meta.js`). A dark theme is a design decision, not a toggle to add.

## 4. HTML and accessibility

Target: WCAG 2.1 AA. pa11y checks part of it; the rest is on the author.

- Semantic HTML before ARIA. `<a>` navigates, `<button>` acts; no click handlers on `<div>`
  or `<span>`.
- One `<h1>` per page, headings without skipped levels; keep the skip link.
- Every `<img>` has `alt` (empty when decorative); decorative SVG is `aria-hidden` (the `svg`
  shortcode does it); icon-only links and buttons get an accessible name.
- Never disable zoom (`maximum-scale`, `user-scalable=no`).
- Focus stays visible: no `outline: none` without a `:focus-visible` replacement (global rule
  in `global-styles.css`). Hover and focus states are more prominent than the rest state.

## 5. Motion

- `prefers-reduced-motion` is honoured globally in `reset.css`; new motion must degrade with it.
- Never `transition: all`; list the properties. Animate `transform` and `opacity`; short colour
  transitions on hover are fine.

## 6. Images and media

The site has no images today and no image pipeline. When the first one arrives:

- explicit `width` and `height`; `loading="lazy"` below the fold; above the fold eager, and
  `fetchpriority="high"` for the largest one;
- compressed video instead of animated GIF, with a still alternative.

## 7. Fonts

- Self-hosted WOFF2 only, latin and latin-ext subsets (Polish needs latin-ext),
  `font-display: swap`, licences next to the files.
- No font CDNs or other third-party font requests.
- Preload only fonts used above the fold, with `type="font/woff2"` and `crossorigin`.

## 8. Language, typography, dates

- UI and content in Polish. Keep it i18n-friendly: no copy in JS; text in CSS generated
  content (e.g. the external-link marker) is Polish too.
- One-letter words (a, i, o, u, w, z) are bound to the next word by a build transform
  (`src/_config/plugins/typography.js`); do not hand-write `&nbsp;` for them. Use `&nbsp;`
  only where the transform cannot know, e.g. between a number and its unit.
- Polish punctuation: „…” quotes, `…` ellipsis, `—` dash. Markdown's typographer sets the
  quotes in `.md`; in templates type them directly.
- Dates through the `formatDate` filter (`Intl`, `pl-PL`); no hard-coded formats. A date shown
  to readers is set explicitly in front matter, never `"Last Modified"` (on Netlify that is the
  build time).
- `translate="no"` on product and tool names and on code identifiers, so browser translation
  leaves them intact.

## 9. Content files

- Pages: `src/pages/`, Markdown or Nunjucks, with front matter preserved unless the change
  requires otherwise. Posts (when the blog returns): `src/posts/YYYY/YYYY-MM-DD-slug.md`.
- Every page in the sitemap must exist and link only to existing pages; the build fails on a
  dead internal link.

## 10. Public repository and security

- The repository is public. No private data beyond what `src/_data/personal.yaml` already
  publishes; no secrets; `.env` stays out of git.
- `| safe` in Nunjucks only on repo-authored data.
- No third-party requests (fonts, analytics, embeds, forms) without updating the privacy
  policy and the headers in `netlify.toml` in the same change.

## 11. Quality gates

Before every commit, in this order:

```bash
npx prettier --check <changed .js/.json/.css files>   # also run by the pre-commit hook
npm test                                               # node:test, scripts/*.test.js
npm run build                                          # includes the dead-link check
```

Template, layout, navigation, content or CSS changes also need:

```bash
npm run test:a11y      # no new errors against the previous run
```

`test:a11y` leaves a dev server running on port 8080. Stop it with a separate command:
`pkill -f "eleventy --serve"` inside a longer command line matches that line and kills it too.

Visible changes: compare the built page with production (screenshot or computed layout).
New logic in `src/_config/` or `scripts/` gets a `node:test` test, written before the code.

Commits: Conventional Commits, code only. Tickets, knowledge base and pipeline files live in
the private parent repository. `main` deploys to Netlify on push; the pre-push hook runs the
build.
