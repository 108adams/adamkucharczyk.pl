---
title: Contact page with Netlify Forms and privacy policy rewrite
status: backlog
type: task
tags: []
created: 2026-10-23T15:04:28.363655022+02:00
updated: 2026-10-23T15:04:28.363655022+02:00
---

## Goal

Contact page `/contact/` with a Netlify Forms form, released together with a
rewritten privacy policy. Decided 2026-10-23.

## Scope

- `src/pages/contact.md` (or `.njk`): fields name, e-mail, message; honeypot
  (`netlify-honeypot`); success page in Polish; e-mail address shown as a
  fallback. Notifications to the owner's address (Netlify UI, not in repo).
- CSP and headers: verify the form POST works with the current policy.
- `src/pages/privacy.md`: today it states the site collects no data — false once
  the form exists. Must state: purpose, legal basis, retention period, Netlify as
  processor (data transfer outside the EEA), data subject rights.
- Footer and home CTA point to `/contact/`.

## Acceptance

- [ ] Form submission arrives in Netlify Forms and as e-mail notification (deploy preview).
- [ ] Privacy policy and form ship in the same deploy.
- [ ] `npm run build` and `npm run test:a11y` pass; form labels and errors accessible.
