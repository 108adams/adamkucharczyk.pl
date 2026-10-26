# Repository Guidelines

## Project Structure & Module Organization

This is an Eleventy 3 static site. Source files live in `src/`; production output is generated into `dist/` and should not be edited directly. Pages are in `src/pages/`, posts in `src/posts/`, shared layouts in `src/_layouts/`, reusable Nunjucks/WebC components in `src/_includes/`, and site data in `src/_data/`. Eleventy configuration is modularized under `src/_config/`. Global CSS follows CUBE CSS layers in `src/assets/css/global/`; per-page styles belong in `src/assets/css/local/`. Images, SVGs, fonts, and scripts are under `src/assets/`.

## Build, Test, and Development Commands

- `npm install` installs dependencies; Node.js 20+ is required.
- `npm start` runs the Eleventy development server with watch mode.
- `npm run build` cleans generated files and builds the production site into `dist/`.
- `npm run clean` removes `dist/` plus generated include CSS and scripts.
- `npm run colors` regenerates `src/_data/designTokens/colors.json` from `colorsBase.json`.
- `npm run test:a11y` builds in test mode, serves the site, and runs `pa11y-ci`.

## Coding Style & Naming Conventions

Use ES modules for JavaScript and follow the existing named-export pattern in `src/_config/`. Keep Nunjucks layouts/includes small and composable. Write CSS according to the current CUBE structure: compositions for layout primitives, blocks for components, utilities for single-purpose helpers. Design tokens are the source of truth; avoid hardcoded spacing, color, or type values when a token exists. Use lowercase, descriptive filenames with hyphens or underscores, for example `build-css.js` or `nav-main-drawer-cls.css`.

## Testing Guidelines

There is no unit test suite in this repository. The main automated check is accessibility via `npm run test:a11y`. Run it for template, layout, navigation, content, and CSS changes that affect rendered pages. For build-system or token changes, also run `npm run build` to catch Eleventy, PostCSS, and bundling errors.

## Commit & Pull Request Guidelines

Recent history uses short conventional-style prefixes such as `feat:`, `docs:`, and `chore:`, though some older commits are plain summaries. Prefer `type: concise imperative summary`, for example `feat: add course landing page`. Pull requests should describe the user-facing change, list commands run, link any relevant issue or ticket, and include screenshots for visual changes.

## Agent-Specific Instructions

Do not edit generated files in `dist/`, `src/_includes/css/`, or `src/_includes/scripts/`. Edit `src/_data/designTokens/colorsBase.json` before running `npm run colors`; do not hand-edit generated color scales. Preserve existing content front matter and deployment configuration unless the task specifically requires changes.

## Deployment Notes

Hosted on Netlify only (`netlify.toml`) at `https://adamkucharczyk.pl`. Flow: push to `main` on GitHub, Netlify builds and serves. Rollback: Netlify UI or revert commit.

## Content & Language

Site language is Polish; an English version may follow later. Posts live in `src/posts/YYYY/YYYY-MM-DD-slug.md`, authored directly as files in git.

## Codex Audit Workflow

When asked to review, challenge, or provide a counterview on existing work:

### Step 1 — Load context

Read what exists (skip files that don't exist yet):

```
../tickets/NNNN-*.md          ← in-scope ticket bodies (the requirements spec; board lives in the parent repo)
pipeline/02_architecture.md   ← architectural decisions, ADRs, component boundaries
pipeline/03_design.md         ← technical design
pipeline/04_tasks.md          ← task scope and implementation plan
CLAUDE.md, AGENTS.md          ← repo rules (generated files, CSS layers, tokens, commit scope)
```

### Step 2 — Four audit dimensions

**Architecture**

- Are component boundaries clear and justified? Is an existing layout, partial, collection or CSS block reused before a new one is added?
- Is the change minimal for a static site (no new dependencies or build steps without a reason)?
- Are ADRs present for non-obvious decisions?

**Rule compliance**

- Does the work match `pipeline/03_design.md` / `04_tasks.md`?
- Generated files untouched (`dist/`, `src/_includes/css/`, `src/_includes/scripts/`, `colors.json`); colours changed via `colorsBase.json` + `npm run colors`.
- CSS follows the CUBE layers and design tokens; no hardcoded spacing, colour or type values where a token exists.
- Commits follow Conventional Commits and carry code only — never ticket, KB or pipeline files.

**Security & public exposure** (this repository is public)

- No private data in content or commits beyond what `src/_data/personal.yaml` already publishes.
- No secrets; `.env` stays out of git.
- `| safe` in Nunjucks only on trusted, repo-authored data.
- Headers and CSP in `netlify.toml` still allow what the change needs (forms, embeds) and nothing more.

**Verification** (no unit test suite)

- `npm run build` passes.
- `npm run test:a11y` run for template, layout, navigation, content and CSS changes.
- No internal links to missing pages, no empty pages, sitemap lists only existing pages.
- Polish UI copy, no hardcoded copy in JS (i18n-friendly).

### Step 3 — Output structure

```markdown
## Challenges

[Specific objections with file:line references where possible]

## Missing aspects

[What the work doesn't address but should]

## Alternative approaches

[Concrete alternatives with trade-offs]

## Risks

[What could go wrong in production or during implementation]
```

### Step 4 — Output target & reconciliation

Write findings to a sibling review file next to the artifact under audit — never edit the artifact yourself:

| Artifact under audit          | Review file                          |
| ----------------------------- | ------------------------------------ |
| `pipeline/02_architecture.md` | `pipeline/02_architecture.review.md` |
| `pipeline/03_design.md`       | `pipeline/03_design.review.md`       |
| `pipeline/04_tasks.md`        | `pipeline/04_tasks.review.md`        |
| code changes                  | `pipeline/code.review.md`            |

Claude then runs `/cross-review` to reconcile each finding and revise the artifact (or code) in place — git history plus the `.review.md` file provide the separation, so do not create `_v2` files.
