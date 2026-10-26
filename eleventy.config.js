/**
 * Most adjustments must be made in `./src/_config/*`
 *
 * Hint VS Code for eleventyConfig autocompletion.
 * © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig -
 * @returns {Object} -
 */

// register dotenv for process.env.* variables to pickup
import dotenv from 'dotenv';
dotenv.config();

// add yaml support
import yaml from 'js-yaml';

//  config import
import {showInSitemap} from './src/_config/collections.js';
import events from './src/_config/events.js';
import filters from './src/_config/filters.js';
import plugins from './src/_config/plugins.js';
import shortcodes from './src/_config/shortcodes.js';

export default async function (eleventyConfig) {
  // --------------------- Events: before build
  eleventyConfig.on('eleventy.before', async () => {
    await events.buildAllCss();
  });

  // --------------------- custom watch targets
  eleventyConfig.addWatchTarget('./src/assets/**/*.{css,svg}');

  // --------------------- layout aliases
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');

  //	---------------------  Collections
  eleventyConfig.addCollection('showInSitemap', showInSitemap);

  // ---------------------  Plugins
  eleventyConfig.addPlugin(plugins.typography);
  eleventyConfig.addPlugin(plugins.htmlConfig);

  // ---------------------  bundle
  eleventyConfig.addBundle('css', {hoist: true});

  // 	--------------------- Library and Data
  eleventyConfig.setLibrary('md', plugins.markdownLib);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // --------------------- Filters
  eleventyConfig.addFilter('formatDate', filters.formatDate);

  // --------------------- Shortcodes
  eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  // --------------------- Passthrough File Copy

  // -- same path
  ['src/assets/fonts/', 'src/assets/images/template'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  eleventyConfig.addPassthroughCopy({
    // -- to root
    'src/assets/images/favicon/*': '/',
    'src/admin/config.yml': 'admin/config.yml'
  });

  // ----------------------  ignore test files
  if (process.env.ELEVENTY_ENV != 'test') {
    eleventyConfig.ignores.add('src/common/pa11y.njk');
  }

  // --------------------- general config
  return {
    markdownTemplateEngine: 'njk',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
