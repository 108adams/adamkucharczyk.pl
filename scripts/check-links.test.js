import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {
  extractLinks,
  extractBase,
  extractSitemapLocs,
  pageUrlForFile,
  resolveInternal,
  targetExists,
  checkDist
} from './check-links.js';

const ORIGIN = 'https://example.pl';

test('extractLinks: double, single and unquoted attribute values', () => {
  const html = `<a href="/a/">a</a><img src='/b.png' alt=x><link href=/c.css rel=stylesheet>`;
  assert.deepEqual(extractLinks(html), ['/a/', '/b.png', '/c.css']);
});

test('extractLinks: srcset candidates without descriptors', () => {
  const html = `<img src="/s.jpg" srcset="/s-320.jpg 320w, /s-640.jpg 640w,/s-960.jpg 2x">`;
  assert.deepEqual(extractLinks(html), ['/s.jpg', '/s-320.jpg', '/s-640.jpg', '/s-960.jpg']);
});

test('extractLinks: data: URL with a comma in srcset is one candidate', () => {
  const html = `<img srcset="data:image/png;base64,AAAA 1x, /real.png 2x">`;
  assert.deepEqual(extractLinks(html), ['data:image/png;base64,AAAA', '/real.png']);
});

test('extractLinks: entities decoded', () => {
  const html = `<a href="/x/?a=1&amp;b=2">x</a><a href="/q&quot;&#39;">y</a>`;
  assert.deepEqual(extractLinks(html), ['/x/?a=1&b=2', `/q"'`]);
});

test('extractLinks: href text in inline script, comment and paragraph is not a link', () => {
  const html = [
    `<script>const t = '<a href="/from-script/">';</script>`,
    `<!-- <a href="/from-comment/">old</a> -->`,
    `<p>Write href="/from-text/" in your markup.</p>`,
    `<style>a[href="/from-style/"] {color: red}</style>`,
    `<script src="/assets/app.js"></script>`
  ].join('\n');
  assert.deepEqual(extractLinks(html), ['/assets/app.js']);
});

test('extractLinks: empty values skipped', () => {
  assert.deepEqual(extractLinks(`<a href="">x</a><img src="  ">`), []);
});

test('extractBase: first <base> href or null', () => {
  assert.equal(extractBase(`<head><base href="/about/"/><base href="/other/"></head>`), '/about/');
  assert.equal(extractBase(`<head><title>x</title></head>`), null);
});

test('extractSitemapLocs: trimmed <loc> contents', () => {
  const xml = `<urlset><url><loc> https://example.pl/ </loc></url><url><loc>https://example.pl/about/</loc></url></urlset>`;
  assert.deepEqual(extractSitemapLocs(xml), ['https://example.pl/', 'https://example.pl/about/']);
});

test('pageUrlForFile: maps dist-relative paths to page URLs', () => {
  assert.equal(pageUrlForFile('index.html'), '/');
  assert.equal(pageUrlForFile('about/index.html'), '/about/');
  assert.equal(pageUrlForFile('404.html'), '/404.html');
});

test('resolveInternal: relative link resolves against base', () => {
  assert.equal(resolveInternal('humans.txt', `${ORIGIN}/about/`, ORIGIN), '/about/humans.txt');
});

test('resolveInternal: query and fragment dropped', () => {
  assert.equal(resolveInternal('/x/?q#f', `${ORIGIN}/`, ORIGIN), '/x/');
});

test('resolveInternal: percent-encoding decoded', () => {
  assert.equal(resolveInternal('/a%20b.pdf', `${ORIGIN}/`, ORIGIN), '/a b.pdf');
});

test('resolveInternal: skipped links return null', () => {
  for (const raw of [
    '#main',
    'mailto:me@example.pl',
    'tel:+48123',
    'data:image/png;base64,AAAA',
    'javascript:void(0)',
    'https://other.example/x/'
  ]) {
    assert.equal(resolveInternal(raw, `${ORIGIN}/about/`, ORIGIN), null, raw);
  }
});

test('resolveInternal: absolute URL on site origin returns path', () => {
  assert.equal(resolveInternal(`${ORIGIN}/privacy/`, `${ORIGIN}/about/`, ORIGIN), '/privacy/');
});

test('targetExists: directory index, file, missing, outside dist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'check-links-'));
  try {
    const dist = join(root, 'dist');
    await mkdir(join(dist, 'about'), {recursive: true});
    await writeFile(join(dist, 'index.html'), '');
    await writeFile(join(dist, 'about', 'index.html'), '');
    await writeFile(join(dist, 'robots.txt'), '');
    await writeFile(join(root, 'secret.txt'), '');
    assert.equal(targetExists(dist, '/'), true);
    assert.equal(targetExists(dist, '/about/'), true);
    assert.equal(targetExists(dist, '/about'), true);
    assert.equal(targetExists(dist, '/robots.txt'), true);
    assert.equal(targetExists(dist, '/missing/'), false);
    assert.equal(targetExists(dist, '/missing.txt'), false);
    assert.equal(targetExists(dist, '/robots.txt/'), false);
    assert.equal(targetExists(dist, '/../secret.txt'), false);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('checkDist: reports one broken link from HTML and sitemap', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'check-links-'));
  try {
    await mkdir(join(dist, 'about'), {recursive: true});
    await writeFile(
      join(dist, 'index.html'),
      `<html><head><base href="/"></head><body><a href="/about/">o</a><a href="mailto:x@y.pl">m</a></body></html>`
    );
    await writeFile(
      join(dist, 'about', 'index.html'),
      `<html><head><base href="/about/"></head><body><a href="/">home</a><link rel=author href="humans.txt"></body></html>`
    );
    await writeFile(
      join(dist, 'sitemap.xml'),
      `<urlset><url><loc>${ORIGIN}/</loc></url><url><loc>${ORIGIN}/about/</loc></url></urlset>`
    );
    const result = checkDist(dist, ORIGIN);
    // <base href> counts too: every href attribute is in scope (ADR-2 Locks).
    assert.equal(result.checked, 7);
    assert.deepEqual(result.broken, [
      {source: 'about/index.html', raw: 'humans.txt', path: '/about/humans.txt'}
    ]);

    await writeFile(join(dist, 'sitemap.xml'), `<urlset><url><loc>${ORIGIN}/gone/</loc></url></urlset>`);
    const withSitemapBroken = checkDist(dist, ORIGIN);
    assert.deepEqual(withSitemapBroken.broken.at(-1), {
      source: 'sitemap.xml',
      raw: `${ORIGIN}/gone/`,
      path: '/gone/'
    });
  } finally {
    await rm(dist, {recursive: true, force: true});
  }
});

test('extractLinks: form action is a link', () => {
  assert.deepEqual(extractLinks('<form action="/contact/sent/" method="POST"></form>'), ['/contact/sent/']);
});

test('checkDist: form action to a missing page is broken, to an existing page is not', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'check-links-'));
  try {
    await writeFile(
      join(dist, 'index.html'),
      `<html><head><base href="/"></head><body><form action="/contact/sent/" method="POST"></form></body></html>`
    );
    assert.deepEqual(checkDist(dist, ORIGIN).broken, [
      {source: 'index.html', raw: '/contact/sent/', path: '/contact/sent/'}
    ]);

    await mkdir(join(dist, 'contact', 'sent'), {recursive: true});
    await writeFile(join(dist, 'contact', 'sent', 'index.html'), '');
    assert.deepEqual(checkDist(dist, ORIGIN).broken, []);
  } finally {
    await rm(dist, {recursive: true, force: true});
  }
});
