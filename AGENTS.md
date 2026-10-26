# Repository Guidelines

Development rules (architecture, CSS and tokens, accessibility, typography, fonts, public-repo
security, quality gates, commits): **`docs/guidelines.md`**. This file holds structure, commands
and the Codex audit workflow only.

## Project Structure

Eleventy 3 static site. Source files live in `src/`; production output is generated into `dist/`. Pages are in `src/pages/`, shared layouts in `src/_layouts/`, Nunjucks includes in `src/_includes/`, site data and design tokens in `src/_data/`. Eleventy configuration is modularized under `src/_config/`. Global CSS follows CUBE CSS layers in `src/assets/css/global/`. Fonts, SVGs and images are under `src/assets/`. Build helper scripts and their `node:test` tests are in `scripts/`.

## Commands

- `npm install` installs dependencies; Node.js 20+ is required.
- `npm start` runs the Eleventy development server with watch mode.
- `npm run build` cleans generated files, builds the production site into `dist/` and checks internal links.
- `npm test` runs the `node:test` suites in `scripts/`.
- `npm run test:a11y` builds in test mode, serves the site, and runs `pa11y-ci`.
- `npm run colors` regenerates `src/_data/designTokens/colors.json` from `colorsBase.json`.

## Deployment

Hosted on Netlify only (`netlify.toml`) at `https://adamkucharczyk.pl`. Flow: push to `main` on GitHub, Netlify builds and serves. Rollback: Netlify UI or revert commit.

## Codex Audit Workflow

When asked to review, challenge, or provide a counterview on existing work:

### Step 1 — Load context

Read what exists (skip files that don't exist yet):

```
../tickets/NNNN-*.md          ← in-scope ticket bodies (the requirements spec; board lives in the parent repo)
pipeline/02_architecture.md   ← architectural decisions, ADRs, component boundaries
pipeline/03_design.md         ← technical design
pipeline/04_tasks.md          ← task scope and implementation plan
docs/guidelines.md            ← development rules (the rule-compliance baseline)
CLAUDE.md, AGENTS.md          ← repo workflow and structure
```

### Step 2 — Four audit dimensions

**Architecture**

- Are component boundaries clear and justified? Is an existing layout, partial, collection or CSS block reused before a new one is added?
- Is the change minimal and linear (no dead code, compatibility shims or new dependencies without a reason)?
- Are ADRs present for non-obvious decisions?

**Rule compliance**

- Does the work match `pipeline/03_design.md` / `04_tasks.md`?
- Does it follow `docs/guidelines.md` (linear development, tokens, accessibility, typography, fonts, public-repo security, commits)? Cite the section.

**Security & public exposure** (this repository is public)

- `docs/guidelines.md` §10: no private data beyond `src/_data/personal.yaml`, no secrets, `| safe` only on repo-authored data, no third-party request without privacy policy and `netlify.toml` updated in the same change.

**Verification**

- The quality gates from `docs/guidelines.md` §11 were run and pass; a11y has no new errors.
- No internal links to missing pages, no empty pages, sitemap lists only existing pages.

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
