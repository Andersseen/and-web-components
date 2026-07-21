#!/usr/bin/env node
/**
 * Compiles src/global/elements.css (Tailwind utilities only, no Preflight)
 * through the same PostCSS/Tailwind pipeline Stencil uses for `globalStyle`,
 * since Stencil only supports a single globalStyle entry file and
 * document.css already owns that slot. Output feeds the `./elements.css`
 * package export (see CODEMAP: "Add/adjust a design token").
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const input = resolve(root, 'src/global/elements.css');
const outDir = resolve(root, 'dist/web-components');
const outFile = resolve(outDir, 'elements.css');

const css = readFileSync(input, 'utf-8');

const result = await postcss([tailwindcss(resolve(root, 'tailwind.config.js')), autoprefixer()]).process(css, {
  from: input,
  to: outFile,
});

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, result.css, 'utf-8');
console.log(`✅ elements.css built → ${outFile}`);
