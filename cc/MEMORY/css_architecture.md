# CSS Architecture Memory
**Created:** 2025-12-29
**Purpose:** Complete CSS architecture reference for adamkucharczyk.pl

## Critical: Tailwind NOT Used Conventionally

**NEVER** use Tailwind like typical projects. Config disables:
- Preflight (line 76)
- textOpacity, backgroundOpacity, borderOpacity (77-79)
- Container blocked (83)

**Tailwind ONLY generates:**
1. CSS custom properties (`:root` vars) via plugin (92-122)
2. Spacing utilities: `flow-space-*`, `region-space-*`, `gutter-*` (125-146)
3. Standard utils in low-specificity layer

## Cascade Layer Order (CRITICAL)

`src/assets/css/global/global.css:1-19`

1. `tailwindBase` - Tailwind base
2. `reset` - Modern CSS reset
3. `fonts` - Font-face declarations
4. `tailwindComponents` - Tailwind components
5. `variables` - Custom properties from tokens
6. `global` - Global styles
7. `compositions` - Layout patterns (Every Layout)
8. `blocks` - Component styles
9. `utilities` - Utility classes
10. `tailwindUtilities` - Tailwind utils (lowest specificity)

**Specificity strategy:** CUBE CSS methodology - compositions/blocks override earlier layers, utilities override blocks

## Design Token System

**Location:** `src/_data/designTokens/`

**Token Files:**
- `colorsBase.json` - SOURCE (edit this)
- `colors.json` - GENERATED (run `npm run colors`, DO NOT edit)
- `spacing.json` - Fluid spacing (Utopia scale)
- `textSizes.json` - Fluid typography (Utopia scale)
- `fonts.json`, `textWeights.json`, `textLeading.json`
- `borderRadius.json`, `viewports.json`

**Color Generation Workflow:**
1. Edit `colorsBase.json` (shades_neutral/vibrant → 100-900 scales)
2. Run `npm run colors` → generates `colors.json`
3. If color names change → update `src/assets/css/global/base/variables.css`

**Token Processing Pipeline:**
```
JSON tokens → clampGenerator (fluid) → tokensToTailwind (slugify) → Tailwind config → CSS custom properties
```

**Clamp Generator:** `src/_config/utils/clamp-generator.js`
- Converts `{name, min, max}` → `clamp(minRem, intersection + slope*vw, maxRem)`
- Uses viewports: min 320px, max 1350px (from viewports.json)
- Applied to spacing + textSizes

**Tokens to Tailwind:** `src/_config/utils/tokens-to-tailwind.js`
- Slugifies token names: "Step 0" → "step-0"
- Returns key-value object for Tailwind config

## Tailwind Config Deep Dive

**File:** `tailwind.config.js`

**Custom Plugin 1 (92-122):** Generates CSS custom properties
```
--color-* --border-radius-* --space-* --size-* --leading-* --font-*
```
Maps from theme → `:root` vars via postcss-js

**Custom Plugin 2 (125-146):** Generates spacing utilities
- `flow-space-{size}` → `--flow-space: {value}`
- `region-space-{size}` → `--region-space: {value}`
- `gutter-{size}` → `--gutter: {value}`

**Breakpoints (33-38):**
- `ltsm: max 560px`, `sm: 560px`, `md: 900px`
- `ltnavigation: max 1024px`, `navigation: 1024px`

## CSS Files Structure

### Base Layer

**reset.css** (`src/assets/css/global/base/reset.css`)
- Modern reset (Piccalilli + Keith J Grant + Modern CSS)
- Box-sizing, text-wrap: pretty/balance
- Media: `prefers-reduced-motion`, view-transition
- Logical properties (inline-size, block-size)

**fonts.css**
- Spectral
- Redhat: 900 (display headings)
- font-display: swap

**variables.css** (`src/assets/css/global/base/variables.css`)
Critical vars:
```css
--gutter: var(--space-m-l)
--wrapper-width: 85rem
--tracking: -0.04ch, --tracking-s: -0.075ch, --tracking-wide: 0.04ch
--stroke: 1px solid var(--color-bg-accent)
```

**Theme System (lines 4-74):**
```css
:root - light theme (default)
:root[data-theme='light'] - explicit light
:root[data-theme='dark'] - explicit dark
@media (prefers-color-scheme: dark) - auto dark
```

**Semantic colors:**
- Light: `--color-text: gray-800, --color-bg: gray-100`
- Dark: `--color-text: gray-100, --color-bg: gray-800`
- Primary: pink/pink-subdued, Secondary: blue/blue-subdued, Tertiary: gold/gold-subdued

**global-styles.css** (`src/assets/css/global/base/global-styles.css`)
- Body: flex column, font-base, size-step-0, leading-standard
- Headings: font-display, font-extra-bold, leading-fine
- H1: step-6, H2: step-4, H3: step-2
- Links: text-decoration-thickness 0.15ex, offset 0.2ch
- Focus-visible: 3px solid, offset 0.3ch (Firefox: 0.08em)
- Selection: invert text/bg colors

### Compositions (Every Layout Patterns)

**flow.css** - Vertical rhythm
```css
.flow > * + * { margin-block-start: var(--flow-space, 1em) }
```

**wrapper.css** - Content width + breakout grid
```css
Grid template: full | feature | popout | content | popout | feature | full
--wrapper-width: 85rem default, .prose-wrapper: 64rem
```

**cluster.css** - Flex wrap distribution
```css
flex wrap, gap: var(--gutter), customizable alignment/direction
```

**grid.css, sidebar.css, repel.css** - Other layout patterns

### Blocks (Components)

**button.css** - Comprehensive button system
- CSS custom properties for all aspects
- Variants: primary, secondary, tertiary, ghost, small, icon
- color-mix() for hover states
- text-box-trim (Safari TP)

**prose.css** - Content typography
- flow-space: var(--space-m-l)
- Max-width: 60ch for readability
- Custom marker: '– ' colored primary
- Media: ltsm → word-break, hyphens

**section.css, main-nav.css, site-footer.css, theme-switch.css, code.css, etc.**

### Utilities

**region.css** - Vertical padding
```css
--region-space-fallback: var(--region-space, var(--space-l-xl))
padding-block: configurable
```

**visually-hidden.css, ontop.css, grayscale.css, heading-line.css, spin.css**

## Build Process

**File:** `src/_config/events/build-css.js`

**Pipeline (PostCSS):**
1. `postcssImportExtGlob` - Glob imports (@import-glob)
2. `postcssImport` - Resolve @import
3. `tailwindcss` - Process Tailwind
4. `autoprefixer` - Vendor prefixes
5. `cssnano` - Minify

**Build Tasks (parallel):**
1. **Global CSS:** `src/assets/css/global/global.css` → `src/_includes/css/global.css` (inlined in prod)
2. **Local CSS:** `src/assets/css/local/**/*.css` → `src/_includes/css/{basename}` (per-page bundles)
3. **Component CSS:** `src/assets/css/components/**/*.css` → `dist/assets/css/components/{basename}` (external)

**Trigger:** `eleventy.before` event in `eleventy.config.js`

## Key Patterns & Gotchas

**Color System:**
- Edit `colorsBase.json` ONLY
- `shades_neutral` + `shades_vibrant` → 100-900 scales
- `light_dark` → base + subdued variants auto-generated
- Run `npm run colors` after changes

**Spacing Strategy:**
- Use design tokens: `var(--space-{size})`
- Fluid via clamp() - responsive without media queries
- Tailwind utilities: `flow-space-m-l`, `region-space-xl`, `gutter-s`

**Cascade Layers:**
- Override order: tailwindBase < reset < fonts < tailwindComponents < variables < global < compositions < blocks < utilities < tailwindUtilities
- Blocks > compositions > global (intentional)

**Logical Properties:**
- Use: inline-size, block-size, margin-block, padding-inline, etc.
- Better for i18n, consistent with modern CSS

**Custom Properties in Blocks:**
- Define defaults at block level
- Override via inline styles or modifier classes
- Example: `.button { --button-bg: var(--color-text) }`, `.button[data-button-variant="primary"] { --button-bg: var(--color-primary) }`

**Composition Pattern:**
- Single responsibility layouts
- Configurable via CSS custom properties
- Stackable: `<div class="wrapper flow prose">`

**Typography:**
- Fluid sizes: `var(--size-step-{min-2 to 6})`
- Font families: `--font-base` (Spectral), `--font-display` (Redhat)
- Weights: `--font-regular` (400), `--font-bold` (700), `--font-extra-bold` (900)
- Leading: `--leading-fine`, `--leading-standard`, `--leading-flat`

**Performance:**
- Global CSS inlined (critical path)
- Local CSS per-page bundles
- Component CSS external (cacheable)
- Minified via cssnano

## File References (Quick Nav)

- Entry: `src/assets/css/global/global.css:1-19`
- Tailwind config: `tailwind.config.js:29-148`
- Theme vars: `src/assets/css/global/base/variables.css:4-74`
- Build: `src/_config/events/build-css.js:11-48`
- Clamp gen: `src/_config/utils/clamp-generator.js:16-43`
- Flow: `src/assets/css/global/compositions/flow.css:6-8`
- Wrapper: `src/assets/css/global/compositions/wrapper.css:3-39`
- Button: `src/assets/css/global/blocks/button.css:3-116`
- Prose: `src/assets/css/global/blocks/prose.css:3-93`

## Common Tasks

**Add new color:**
1. Edit `src/_data/designTokens/colorsBase.json`
2. Run `npm run colors`
3. Update `src/assets/css/global/base/variables.css` if new semantic color

**Add new spacing:**
1. Edit `src/_data/designTokens/spacing.json` (min/max px)
2. Auto-generates clamp(), available as `var(--space-{name})`

**New composition:**
1. Create `src/assets/css/global/compositions/{name}.css`
2. Auto-imported via `@import-glob` in global.css:11

**New block:**
1. Create `src/assets/css/global/blocks/{name}.css`
2. Auto-imported via `@import-glob` in global.css:12

**New utility:**
1. Create `src/assets/css/global/utilities/{name}.css`
2. Auto-imported via `@import-glob` in global.css:13

**Per-page CSS:**
1. Create `src/assets/css/local/{page}.css`
2. Auto-built to `src/_includes/css/{page}.css`
3. Include in template: `<link>` or inline

## Testing & Validation

- Build must succeed: `npm run build`
- Accessibility: `npm run test:a11y` (pa11y)
- Visual check: inspect cascade layers in DevTools
- Dark mode: toggle theme, check semantic colors
