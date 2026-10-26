// Polish typography: a one-letter word (a, i, o, u, w, z) must not end a line.
const SINGLE_LETTER = /(?<=^|[\s(„"'])([aiouwzAIOUWZ])\s+/g;
const RAW_ELEMENTS = new Set(['pre', 'code', 'script', 'style', 'textarea']);

/** Joins every one-letter word to the following word with a no-break space, outside tags and code. */
export const bindSingleLetterWords = html => {
  let rawElement = null;

  return html
    .split(/(<[^>]*>)/)
    .map(part => {
      if (part.startsWith('<')) {
        const [, closing, name] = part.match(/^<(\/?)([a-zA-Z0-9-]*)/);
        const tag = name.toLowerCase();
        if (rawElement && closing && tag === rawElement) rawElement = null;
        else if (!rawElement && !closing && RAW_ELEMENTS.has(tag)) rawElement = tag;
        return part;
      }
      return rawElement ? part : part.replace(SINGLE_LETTER, '$1 ');
    })
    .join('');
};

export const typography = eleventyConfig => {
  eleventyConfig.addTransform('polish-typography', (content, path) =>
    path && path.endsWith('.html') ? bindSingleLetterWords(content) : content
  );
};
