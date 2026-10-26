import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportExtGlob from 'postcss-import-ext-glob';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const inputPath = 'src/assets/css/global/global.css';
const outputPath = 'src/_includes/css/global.css';

export const buildAllCss = async () => {
  const inputContent = await fs.readFile(inputPath, 'utf-8');

  const result = await postcss([
    postcssImportExtGlob,
    postcssImport,
    tailwindcss,
    autoprefixer,
    cssnano
  ]).process(inputContent, {from: inputPath});

  await fs.mkdir(path.dirname(outputPath), {recursive: true});
  await fs.writeFile(outputPath, result.css);
};
