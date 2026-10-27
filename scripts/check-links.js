import 'dotenv/config';
import {url} from '../src/_data/meta.js';
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';

// Internal link check for the production build in dist/ (ADR-2).
// Scope: href, src, form action and srcset candidates in HTML files plus <loc> in sitemap.xml.
// Skipped: fragments, non-http(s) schemes, other origins. Anchors are not checked.

const LINK_ATTRS = new Set(['href', 'src', 'action']);
const NAMED_ENTITIES = {amp: '&', quot: '"', apos: "'", lt: '<', gt: '>'};

const decodeEntities = value =>
  value.replace(/&(?:#(\d+)|#x([0-9a-f]+)|(amp|quot|apos|lt|gt));/gi, (match, dec, hex, name) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return NAMED_ENTITIES[name.toLowerCase()];
  });

// Drop comments and the bodies of <script>/<style>; keep their opening tags (script src).
const stripNonMarkup = html =>
  html.replace(/<!--[\s\S]*?-->/g, '').replace(/(<(script|style)\b[^>]*>)[\s\S]*?<\/\2\s*>/gi, '$1');

const isSpace = ch => /\s/.test(ch);

// Yields {name, attrs} for every opening tag; attribute values may be quoted or unquoted.
function* openingTags(html) {
  const tagStart = /<([a-zA-Z][\w:-]*)/g;
  let match;
  while ((match = tagStart.exec(html))) {
    const attrs = [];
    let i = tagStart.lastIndex;
    while (i < html.length && html[i] !== '>') {
      if (isSpace(html[i]) || html[i] === '/') {
        i++;
        continue;
      }
      let name = '';
      while (i < html.length && !isSpace(html[i]) && !'=>/'.includes(html[i])) name += html[i++];
      while (i < html.length && isSpace(html[i])) i++;
      let value = null;
      if (html[i] === '=') {
        i++;
        while (i < html.length && isSpace(html[i])) i++;
        const quote = html[i];
        if (quote === '"' || quote === "'") {
          const end = html.indexOf(quote, i + 1);
          const stop = end === -1 ? html.length : end;
          value = html.slice(i + 1, stop);
          i = stop + 1;
        } else {
          value = '';
          while (i < html.length && !isSpace(html[i]) && html[i] !== '>') value += html[i++];
        }
      }
      if (name) attrs.push({name: name.toLowerCase(), value});
    }
    tagStart.lastIndex = i;
    yield {name: match[1].toLowerCase(), attrs};
  }
}

const parseSrcset = srcset => {
  const urls = [];
  let i = 0;
  while (i < srcset.length) {
    while (i < srcset.length && (isSpace(srcset[i]) || srcset[i] === ',')) i++;
    if (i >= srcset.length) break;
    let candidate = '';
    while (i < srcset.length && !isSpace(srcset[i])) candidate += srcset[i++];
    const trimmed = candidate.replace(/,+$/, '');
    if (trimmed.length === candidate.length) {
      // Descriptors run up to the next comma.
      while (i < srcset.length && srcset[i] !== ',') i++;
    }
    if (trimmed) urls.push(trimmed);
  }
  return urls;
};

export const extractLinks = html => {
  const links = [];
  for (const {attrs} of openingTags(stripNonMarkup(html))) {
    for (const {name, value} of attrs) {
      if (value === null) continue;
      const decoded = decodeEntities(value).trim();
      if (!decoded) continue;
      if (LINK_ATTRS.has(name)) links.push(decoded);
      else if (name === 'srcset') links.push(...parseSrcset(decoded));
    }
  }
  return links;
};

export const extractBase = html => {
  for (const {name, attrs} of openingTags(stripNonMarkup(html))) {
    if (name !== 'base') continue;
    const href = attrs.find(attr => attr.name === 'href' && attr.value !== null);
    if (href) return decodeEntities(href.value).trim();
  }
  return null;
};

export const extractSitemapLocs = xml =>
  [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map(match => match[1].trim());

export const pageUrlForFile = relPath => {
  const posix = relPath.split(sep).join('/');
  if (posix === 'index.html') return '/';
  if (posix.endsWith('/index.html')) return `/${posix.slice(0, -'index.html'.length)}`;
  return `/${posix}`;
};

export const resolveInternal = (raw, baseUrl, siteOrigin) => {
  if (raw.startsWith('#')) return null;
  let resolved;
  try {
    resolved = new URL(raw, baseUrl);
  } catch {
    return null;
  }
  if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
  if (resolved.origin !== siteOrigin) return null;
  try {
    return decodeURIComponent(resolved.pathname);
  } catch {
    return resolved.pathname;
  }
};

const isFile = path => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

export const targetExists = (distDir, pathname) => {
  const root = resolve(distDir);
  const target = resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + sep)) return false;
  if (pathname.endsWith('/')) return isFile(join(target, 'index.html'));
  return isFile(target) || isFile(join(target, 'index.html'));
};

const htmlFiles = dir =>
  readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
  });

export const checkDist = (distDir, siteOrigin) => {
  let checked = 0;
  const broken = [];
  const check = (source, raw, baseUrl) => {
    const path = resolveInternal(raw, baseUrl, siteOrigin);
    if (path === null) return;
    checked++;
    if (!targetExists(distDir, path)) broken.push({source, raw, path});
  };

  for (const file of htmlFiles(distDir).sort()) {
    const rel = relative(distDir, file).split(sep).join('/');
    const html = readFileSync(file, 'utf8');
    const docUrl = siteOrigin + pageUrlForFile(rel);
    const baseUrl = new URL(extractBase(html) ?? docUrl, docUrl).href;
    for (const raw of extractLinks(html)) check(rel, raw, baseUrl);
  }

  const sitemap = join(distDir, 'sitemap.xml');
  if (existsSync(sitemap)) {
    for (const loc of extractSitemapLocs(readFileSync(sitemap, 'utf8'))) {
      check('sitemap.xml', loc, `${siteOrigin}/`);
    }
  }

  return {checked, broken};
};

export const main = () => {
  const distDir = 'dist';
  if (!existsSync(distDir)) {
    console.error('check-links: brak katalogu dist/ — najpierw npm run build');
    process.exitCode = 1;
    return;
  }
  const {checked, broken} = checkDist(distDir, new URL(url).origin);
  for (const {source, raw, path} of broken) console.error(`${source} → ${raw} (${path})`);
  console.log(`check-links: ${checked} linków, ${broken.length} martwych`);
  process.exitCode = broken.length > 0 ? 1 : 0;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
