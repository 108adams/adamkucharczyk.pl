---
title: Rewrite home and about pages for recruiter audience
status: backlog
type: task
tags: []
created: 2026-10-23T15:04:28.37055759+02:00
updated: 2026-10-23T15:04:28.37055759+02:00
---

## Goal

Home and about pages serve a recruiter or client verifying the owner's
profile, not a course buyer. Layout: existing components (hero, service cards,
credentials), palette unchanged — no redesign. Decided 2026-10-23.

## Scope

- Home: professional thesis and three differentiators in hero; two paths
  (architecture engagement; training as a competence) as service cards; proof
  points in credentials; CTA to `/contact/`.
- About: short career history, evidence, training section (hours, audiences,
  topics) — no dates or course schedule.
- Every number comes from the owner's canonical career history; known
  mismatches today: current employer and title in `about.md:9`, application
  count in `about.md:7`, years as architect in `index.njk` credentials,
  "20+ years in IT" to verify.
- Content is drafted and approved by the owner (ticket 0018 on the private
  board) before implementation; check against the publication boundary
  rules before push.

## Depends on

- Approved copy from the private board (0018).
- 0002 (removed pages and CTAs), 0003 (contact target).

## Acceptance

- [ ] Copy matches the approved draft verbatim.
- [ ] `npm run build` and `npm run test:a11y` pass.
