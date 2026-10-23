---
title: Remove template leftovers and dead links
status: backlog
type: task
tags: []
created: 2026-10-23T15:04:28.350654872+02:00
updated: 2026-10-23T15:04:28.350654872+02:00
---

## Goal

No page, link or CTA on the site without content behind it. Decided 2026-10-23
(source of decisions: private knowledge base, owner's ticket 0018).

## Scope

- Remove `src/pages/courses.md` and every link to `/courses/` (nav `top`,
  2× "Zobacz terminy kursów" in `src/pages/index.njk`).
- Remove `src/pages/styleguide.njk` and `src/assets/css/local/styleguide.css`.
- Remove `src/pages/sustainability.md` (reports carbon data of the starter's domain).
- Remove the blog: `src/pages/blog.njk`, `src/posts/` (single post 2025-12-28,
  stays in git history), commented nav entry, blog block in `index.njk`, related
  config in `eleventy.config.js`, `src/common/og-images.njk`, `src/_data/meta.js`
  as needed. The blog returns when there is content.
- Footer: Polish label for "Legal" (`src/_data/navigation.js`). `/contact/` link
  stays only together with ticket 0003; until then remove it.
- Rewrite `src/pages/accessibility.md` briefly in Polish (target standard, how
  to report a barrier) in place of the starter author's note.

## Acceptance

- [ ] `npm run build` and `npm run test:a11y` pass.
- [ ] No internal link to a non-existent page in `dist/` (link check).
- [ ] Sitemap contains only existing pages.
