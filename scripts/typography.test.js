import {test} from 'node:test';
import assert from 'node:assert/strict';

import {bindSingleLetterWords} from '../src/_config/plugins/typography.js';

const NBSP = ' ';

test('binds a one-letter word to the next word', () => {
  assert.equal(bindSingleLetterWords('<p>Pracuję w IT.</p>'), `<p>Pracuję w${NBSP}IT.</p>`);
});

test('covers a, i, o, u, w, z in both cases', () => {
  assert.equal(
    bindSingleLetterWords('<p>A to, i tamto, o tym, u mnie, W domu, z nim, Z tobą</p>'),
    `<p>A${NBSP}to, i${NBSP}tamto, o${NBSP}tym, u${NBSP}mnie, W${NBSP}domu, z${NBSP}nim, Z${NBSP}tobą</p>`
  );
});

test('binds chained one-letter words', () => {
  assert.equal(
    bindSingleLetterWords('<p>szkolenia i w firmie</p>'),
    `<p>szkolenia i${NBSP}w${NBSP}firmie</p>`
  );
});

test('collapses a line break after the letter', () => {
  assert.equal(bindSingleLetterWords('<p>pracy z\n  zespołem</p>'), `<p>pracy z${NBSP}zespołem</p>`);
});

test('binds across an inline tag', () => {
  assert.equal(
    bindSingleLetterWords('<p>spotkania i <strong>kursy</strong></p>'),
    `<p>spotkania i${NBSP}<strong>kursy</strong></p>`
  );
});

test('leaves letters inside words and other one-letter tokens alone', () => {
  const html = '<p>kawa i,  plan B oraz e mail</p>';
  assert.equal(bindSingleLetterWords(html), html);
});

test('leaves tags, attributes and code-like elements untouched', () => {
  const html =
    '<a title="w domu" href="/a">x</a><pre>w domu</pre><code>i j</code><script>a = i + w</script><style>a b{}</style>';
  assert.equal(bindSingleLetterWords(html), html);
});

test('resumes after a closed code-like element', () => {
  assert.equal(
    bindSingleLetterWords('<pre>w domu</pre><p>w domu</p>'),
    `<pre>w domu</pre><p>w${NBSP}domu</p>`
  );
});
