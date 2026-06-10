<!-- Global config: ~/.claude/CLAUDE.md (pipeline workflow, ticket lifecycle, communication style). -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Eleventy-based static site generator project using the "Eleventy Excellent" starter template. The project follows the workflow suggested by Andy Bell's buildexcellentwebsit.es, implementing CUBE CSS methodology with Tailwind CSS for utility classes.

**Key Technologies:**
- Eleventy 3.x (static site generator)
- CUBE CSS methodology for styling
- Tailwind CSS (custom configuration - see CSS Architecture below)
- Nunjucks, Markdown, and WebC for templating
- PostCSS with cssnano, autoprefixer for CSS processing
- esbuild for JavaScript bundling
- Node.js 20+

<!-- Ticket workflow: see ~/.claude/CLAUDE.md -->

<!-- Communication: see ~/.claude/CLAUDE.md -->

## Code Architecture

### Configuration Structure (`src/_config/`)

The Eleventy configuration is modularized into separate concerns:

- **collections.js** - Eleventy collections (blog posts, sitemap pages, tag lists)
- **filters.js** - Template filters (dates, markdown formatting, slugification, sorting)
- **plugins.js** - Eleventy plugins and markdown-it configuration
- **shortcodes.js** - Reusable shortcodes (images, SVGs)
- **events.js** - Build lifecycle hooks (CSS/JS compilation, SVG conversion)

Each category is further modularized into subdirectories:
- `filters/` - Individual filter implementations
- `plugins/` - Custom plugins (drafts, HTML minification, markdown)
- `shortcodes/` - Individual shortcode implementations
- `events/` - Event handlers (build-css.js, build-js.js, svg-to-jpeg.js)
- `setup/` - Setup scripts (color generation, favicons, screenshots)
- `utils/` - Utility functions (clamp-generator, tokens-to-tailwind)

Each module exports named functions, which are consolidated in the parent `*.js` file and imported into `eleventy.config.js`.

### CSS Architecture (CUBE CSS + Tailwind)

**IMPORTANT:** Tailwind CSS is NOT used conventionally in this project. The configuration disables preflight and most core plugins. Tailwind only generates:
1. Custom properties from design tokens (`--color-*`, `--space-*`, etc.)
2. Utility classes for spacing (`flow-space-*`, `region-space-*`, `gutter-*`)
3. Standard Tailwind utilities in a cascade layer with low specificity

**CSS Organization** (`src/assets/css/global/`):

Follows CUBE CSS methodology with cascade layers (in order):
1. `tailwindBase` - Tailwind base styles
2. `reset` - CSS reset
3. `fonts` - Font declarations
4. `tailwindComponents` - Tailwind components
5. `variables` - CSS custom properties from design tokens
6. `global` - Global styles
7. `compositions` - Layout compositions (Every Layout patterns)
8. `blocks` - Component/block styles
9. `utilities` - Utility classes
10. `tailwindUtilities` - Tailwind utilities

**CSS Build Process:**
- Entry point: `src/assets/css/global/global.css`
- Built via PostCSS during `eleventy.before` event
- Global CSS is inlined in production for performance
- Local CSS: Place in `src/assets/css/local/` for per-page bundles
- Component CSS: Place in `src/assets/css/components/` (output to dist)

### Design Tokens (`src/_data/designTokens/`)

Design tokens are JSON files that define the design system:
- `colorsBase.json` - Source colors (run `npm run colors` to generate `colors.json`)
- `colors.json` - Generated color palette (DO NOT edit manually)
- `spacing.json`, `textSizes.json` - Fluid spacing and typography
- `fonts.json`, `textWeights.json`, `textLeading.json` - Typography tokens
- `borderRadius.json`, `viewports.json` - UI tokens

**Color Generation:**
- Edit `src/_data/designTokens/colorsBase.json` with base colors
- Run `npm run colors` to generate complete palette
- Colors under `shades_neutral` or `shades_vibrant` are converted to 100-900 scales
- If color names change, update `src/assets/css/global/base/variables.css`

### Content Structure

- `src/posts/` - Blog posts organized by year (YYYY/YYYY-MM-DD-slug.md)
- `src/pages/` - Static pages
- `src/docs/` - Documentation pages
- `src/common/` - Shared content (404 page, pa11y test page)

### Template Architecture

- `src/_layouts/` - Main layout templates (base.njk, page.njk, post.njk, tags.njk)
- `src/_includes/` - Reusable components
  - `head/` - Head section components
  - `partials/` - Partial templates
  - `schemas/` - JSON-LD schema templates
  - `webc/` - WebC components
  - `css/`, `scripts/` - Generated CSS/JS (not in source control)

### Data Files (`src/_data/`)

- `meta.js` - Site metadata, author info, navigation config, theme settings
- `navigation.js` - Navigation structure
- `helpers.js` - Helper functions available in templates
- `builtwith.json` - Sites built with this starter
- `personal.yaml` - Personal/social media links

### Asset Processing

**Images:**
- Uses @11ty/eleventy-img for optimization
- Shortcode: `{% image "path", "alt text" %}`
- Automatic WebP generation, lazy loading by default

**JavaScript:**
- Source: `src/assets/scripts/`
- Built via esbuild during `eleventy.before` event
- Output to `src/_includes/scripts/` for inlining

**SVG:**
- Source: `src/assets/svg/`
- Shortcode: `{% svg "filename" %}`
- SVG to JPEG conversion for OG images in development

### Special Features

- **Open Graph Images:** Automatically generated for blog posts
- **Dark/Light Mode:** Accessible theme switching based on user preference
- **301 Redirects:** Configured for Netlify deployment
- **RSS Feeds:** Multiple feed formats (Atom, JSON) configurable in meta.js
- **Accessibility:** Built-in pa11y testing, ARIA patterns
- **Progressive Enhancement:** Uses `<is-land>` for component hydration

### File Organization Principles

Based on the project's established patterns:
1. Keep configuration modular - one file per concern, then consolidate
2. Use named exports from modules, default export from consolidation files
3. Global styles use cascade layers; local/component CSS has higher specificity
4. Design tokens are single source of truth - generate derivatives, don't hardcode
5. Template languages: Nunjucks for layouts/includes, Markdown for content, WebC for components

## Commands

### Development
```bash
npm install              # Install dependencies
npm start                # Start dev server with watch mode
npm run build            # Clean and create production build
npm run clean            # Remove dist and generated CSS/scripts
```

### Setup & Generation
```bash
npm run favicons         # Generate favicon files
npm run colors           # Generate color palette from colorsBase.json
npm run screenshots      # Generate screenshot images
npm run clean:og         # Remove Open Graph images
```

### Testing
```bash
npm run test:a11y        # Run pa11y accessibility tests
npm run pa11y:build      # Build in test mode
npm run pa11y:test       # Run pa11y tests (after build)
```

## Best Practices

### Before Coding

- **BP-1 (MUST)** Ask clarifying questions (prefer AskUserQuestion tool for ≤6 questions), understand fully
- **BP-2 (MUST)** Propose approach, wait approval
- **BP-3 (SHOULD)** ≥2 approaches → list pros/cons

### Coding

- **C-1 (SHOULD)** Write tests for build scripts and complex JS. Use pa11y for accessibility validation
- **C-2 (MUST)** Use domain vocabulary (CUBE CSS, design tokens, compositions, blocks, utilities)
- **C-3 (SHOULD)** Avoid Unicode/emojis in Node.js console output (Windows compatibility). Browser content is fine

### Security

- **S-1 (MUST)** NO hardcoded secrets/credentials
  - Use environment variables (.env file)
  - Never commit `.env`, API keys, tokens
  - Document required vars in `.env.example`
- **S-2 (MUST)** Template safety
  - Nunjucks auto-escapes by default - keep it
  - Use `| safe` filter ONLY for trusted content
  - Sanitize external data in build scripts before templating
- **S-3 (MUST)** Build script security
  - Use array args for child_process: `spawn('git', ['add', file])` not `exec(\`git add ${file}\`)`
  - Validate inputs used in system commands
  - Never log secrets, tokens, API keys, or PII

### Workflow

- **WF-1 (MUST)** Incremental; stop at milestones
- **WF-2 (MUST)** Commit message format (Conventional Commits):
  - Type: `feat|fix|refactor|test|docs|style|chore`
  - Scope optional: `feat(css)`, `fix(build)`
  - Subject: imperative, lowercase, no period, <72 chars
  - Footer: ALWAYS include Claude Code attribution
  - Use HEREDOC for multi-line messages

- **WF-3 (MUST)** Wait commit confirmation; then close ticket: `clinban move <id> done` → `clinban archive <id>`
- **WF-4 (SHOULD)** Parallel tool execution:
  - Run independent Read/Grep/Glob operations in parallel
  - Single message with multiple tool calls for efficiency
  - Sequential only when dependencies exist
- **WF-5 (MUST)** Summary reporting:
  - **Successful implementation**: Report on-screen ONLY (no summary file)
  - **Outstanding work/problems**: report on-screen with clear next steps; move ticket to `blocked` with a Blocker note in the body
  - Never create generic SUMMARY.md for completed tasks
- **WF-6 (SHOULD)** Pre-commit verification:
  - [ ] Ticket is `in-progress`: `clinban list --status in-progress`
  - [ ] Build succeeds: `npm run build`
  - [ ] Accessibility tests pass: `npm run test:a11y`
  - [ ] No debug code: remove console.log, debugger statements
  - [ ] Review staged changes: `git status` and `git diff --staged`

### Git Operations

- **G-1 (MUST)** Stage specific files: `git add file1 file2` (avoid `git add -A`)
- **G-2 (NEVER)** Force push to main/master branches
- **G-3 (MUST)** Use HEREDOC for multi-line commit messages (see WF-2)
- **G-4 (SHOULD)** Sequential git operations: `git add . && git commit && git push`
  - Chain with `&&` so failure stops execution
- **G-5 (NEVER)** Use `--amend` unless user explicitly requests it
- **G-6 (MUST)** Branch strategy: Single main branch workflow
  - Work directly on `main` or use feature branches as needed
  - Check current branch: `git status`
- **G-7 (MUST)** PR/MR creation (if using):
  - Title: Conventional Commits format
  - Description: Summary, test plan, breaking changes
  - Complete WF-6 checklist before requesting review

### Task Management

- **TM-1 (MUST)** Use TodoWrite for multi-step tasks (≥3 distinct steps)
- **TM-2 (MUST)** Mark task in_progress BEFORE starting work
- **TM-3 (MUST)** Mark completed IMMEDIATELY after finishing (no batching)
- **TM-4 (MUST)** Only ONE task in_progress at any time
- **TM-5 (MUST)** Provide both forms: `content` (imperative) and `activeForm` (present continuous)

### Function Quality

1. Readable? Stop
2. High complexity? Refactor
3. Better algorithms?
4. Unused params?
5. Best name vs 3 alternatives?

**Refactor only if:** multi-use OR enables testing OR unreadable

### Test Quality

1. Parameterize; no magic literals
2. Must fail for real bugs
3. Name matches assertion
4. Independent expectations
5. Same rules as prod
6. Express invariants
7. Edge cases, boundaries
8. Skip type-checker coverage

## Agent Rules

Agents follow modified rules:

**Applies:**
- BP-1: Clarify scope
- BP-3: Multiple approaches

**Skip:**
- BP-2: No approval needed (read-only)
- C-1,C-2: No code (read-only agents)
- WF-1-5: No commits
- Test checklist: Only if writes tests

**Docs:** Report findings inline with file:line refs

## Dependency Management

- **DEP-1** Production: `npm install <pkg>`, Dev: `npm install -D <pkg>`
- **DEP-2** Semver: `^1.2.3` (1.x compatible), `~1.2.3` (1.2.x only), `1.2.3` (exact)
- **DEP-3** Updates: `npm outdated`, `npm update <pkg>`, `npm audit` for security
- **DEP-4** Always commit `package-lock.json` with `package.json` changes
- **DEP-5** Document env vars in `.env.example`

## Quality Standards

- **ESLint**: JavaScript linting (if configured)
- **Prettier**: Code formatting (if configured)
- **pa11y**: Automated accessibility testing (WCAG compliance)
- **Build validation**: Eleventy build must succeed without errors
- **Performance**: Monitor bundle sizes, optimize images, lazy load resources

## Development Notes

- Project uses ES modules (`type: "module"` in package.json)
- Environment variables loaded via dotenv (create `.env` if needed)
- Build output goes to `dist/` directory
- Styleguide available at `/styleguide/`
- Environment modes: `ELEVENTY_ENV=test|development|production`

## Deployment

**Netlify** (auto-deploy on push to main):

- **Pre-deploy:** Build succeeds locally (`npm run build`), accessibility tests pass (`npm run test:a11y`)
- **Post-deploy:** Verify production URL, check Netlify deploy logs for errors/warnings
- **Rollback:** Use Netlify UI or revert git commit and push

## Known Issues & Troubleshooting

### Claude Code Permissions Bug

**Issue**: `.claude/settings.local.json` allow rules not honored, gets corrupted on approval

**Symptoms:**
- Claude asks for git/bash permissions despite allow list
- After approval, entire `allow` section gets wiped
- Loses all pre-configured permissions

**Workaround:**
```bash
# Restore from template
cp .claude/settings.local.template.json .claude/settings.local.json
```

**Template location**: `.claude/settings.local.template.json`
- Contains comprehensive allow rules
- Do NOT commit settings.local.json (gitignored)
- Template is tracked in git

**Status**: Known Claude Code CLI bug, reported upstream
