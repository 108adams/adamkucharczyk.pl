---
title: 'Format baseline: prettier drift in 17 files, njk parse error'
status: done
type: task
tags: []
created: 2026-09-30T11:45:48.710673687+02:00
updated: 2026-09-30T12:05:39.368720373+02:00
---

## Outcome (2026-09-30)

- Ran `prettier --write` on 16 tracked js/json/css files. Built `dist/` compared before/after: identical except the feed `<updated>` timestamp.
- `colors.json` is generated (`npm run colors`); added to `.prettierignore`, not reformatted.
- `.njk` stays out of lint-staged: `prettier-plugin-jinja-template` cannot parse Nunjucks `{% asyncEach %}...{% endeach %}` (`src/pages/blog.njk:22`), so the jinja parser is unusable for those files as-is. Revisit only if the plugin gains Nunjucks support.
