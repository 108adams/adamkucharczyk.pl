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

The live site is hosted by Netlify at `https://adamkucharczyk.pl`. The current deployment flow is: push to GitHub, Netlify builds the project, then Netlify serves the production site.
