// Eleventy
import {EleventyRenderPlugin} from '@11ty/eleventy';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import webc from '@11ty/eleventy-plugin-webc';
import {eleventyImageTransformPlugin} from '@11ty/eleventy-img';

// custom
import {markdownLib} from './plugins/markdown.js';
import {drafts} from './plugins/drafts.js';

// Custom transforms
import {htmlConfig} from './plugins/html-config.js';

export default {
  EleventyRenderPlugin,
  syntaxHighlight,
  webc,
  eleventyImageTransformPlugin,
  markdownLib,
  drafts,
  htmlConfig
};
