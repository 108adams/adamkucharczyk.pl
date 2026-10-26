@AGENTS.md
@docs/guidelines.md

# CLAUDE.md

Global rules (git, security, ticket flow, commit format) come from `~/.claude`. Development
rules: `docs/guidelines.md` (imported above). Structure and commands: `AGENTS.md` (shared with
Codex). This file holds only Claude-specific workflow and context.

## Repo-specific

- **Branch:** work directly on `main`. Netlify auto-deploys on push.
- **Tickets:** no board in this repo. Site tickets live on the owner's private board in the parent directory (`../tickets/`, tag `strona`); ranking in `../tickets/RANKING.md`.
- **Pipeline:** `pipeline/` here is local and gitignored (repo is public). Skills that touch tickets or the knowledge base act on the parent repo instead of this one:
  - clinban: run in a subshell, `(cd .. && clinban <cmd>)`; never create `.clinban` or `tickets/` here.
  - `/architect` batch start and `/ship` Phase 3 (move, archive, `RANKING.md`), Phase 2 (`../kb/`, `../kb/log.md`): edit files in `..`, commit and push with `git -C ..` (private repo, branch `main`).
  - `/ship` Phase 5: archive `pipeline/RUN_LOG.md` and handoffs to `../pipeline/archive/`, not to this repo.
- **Approach gate:** propose before coding only for design, multi-file, or build-system changes. Small content/CSS fixes: just do them.

## Site context

- Personal site of a senior IT architect: an expert profile for recruiters and clients (architecture roles, consulting); training shown as a competence, not a course shop. Decisions: `../kb/decyzje/strona.md`.
- English version is a future goal; do not build i18n yet.
- Design taste: dimmed pastel palette close to Solarized; strong typographic contrast.
- The Sveltia CMS in `src/admin/` is a proof of concept; ignore it unless asked.
