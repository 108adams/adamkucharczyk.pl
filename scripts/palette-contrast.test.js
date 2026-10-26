import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

import Color from 'colorjs.io';
import slugify from 'slugify';

const colors = JSON.parse(
  readFileSync(new URL('../src/_data/designTokens/colors.json', import.meta.url), 'utf8')
);
const css = readFileSync(new URL('../src/assets/css/global/base/variables.css', import.meta.url), 'utf8');

// slug -> hex, as generated into CSS
const tokens = new Map(colors.items.map(({name, value}) => [slugify(name, {lower: true}), value]));

// role -> slug, from `--color-<role>: var(--color-<slug>)` declarations
const roles = new Map();
for (const [, role, slug] of css.matchAll(/--color-([\w-]+):\s*var\(--color-([\w-]+)\)\s*;/g)) {
  roles.set(role, slug);
}

const contrast = (fg, bg) => new Color(fg).contrast(new Color(bg), 'WCAG21');

// [role, expected slug, background roles, threshold]
const ROLES = [
  ['text', 'solarized-base00-aa', ['bg', 'bg-accent'], 4.6],
  ['text-accent', 'solarized-base01-aa', ['bg', 'bg-accent'], 4.6],
  ['text-muted', 'solarized-base1-aa', ['bg'], 4.6],
  ['primary-text', 'solarized-cyan-aa', ['bg', 'bg-accent'], 4.6],
  ['primary-text-large', 'solarized-cyan-aa-large', ['bg'], 3.1],
  ['secondary-text', 'solarized-green-aa', ['bg', 'bg-accent'], 4.6],
  ['emphasis', 'orangered-aa', ['bg', 'bg-accent'], 4.6]
];

function hexOf(slug) {
  const hex = tokens.get(slug);
  assert.ok(hex, `palette entry missing: ${slug}`);
  return hex;
}

for (const [role, slug, bgRoles, threshold] of ROLES) {
  test(`--color-${role} is pinned to ${slug} and meets ${threshold}:1`, () => {
    assert.equal(roles.get(role), slug, `--color-${role} must point to --color-${slug}`);
    const fg = hexOf(slug);
    for (const bgRole of bgRoles) {
      const bgSlug = roles.get(bgRole);
      assert.ok(bgSlug, `role missing in variables.css: --color-${bgRole}`);
      const ratio = contrast(fg, hexOf(bgSlug));
      assert.ok(ratio >= threshold, `${slug} on ${bgRole} (${bgSlug}): ${ratio.toFixed(2)} < ${threshold}`);
    }
  });
}
