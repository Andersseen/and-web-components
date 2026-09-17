/**
 * Generates dist/icons.css, dist/base.css and dist/icons/<name>.css from the
 * compiled icon catalog — the full, base-only, and per-icon CSS outputs, all
 * built from the same generate-css.js primitives (no separate logic per
 * output). Runs after the tsc build steps, so it imports the compiled
 * dist/*.js rather than the TypeScript source.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');

const { generateIconsCss, generateIconsBaseCss, generateIconCss } = await import('../dist/generate-css.js');
const { ALL_ICONS } = await import('../dist/icons.js');

writeFileSync(path.join(DIST, 'icons.css'), generateIconsCss());
console.log('✓ Generated dist/icons.css');

writeFileSync(path.join(DIST, 'base.css'), generateIconsBaseCss());
console.log('✓ Generated dist/base.css');

// Rebuilt from scratch every time so a removed/renamed icon never leaves a
// stale dist/icons/<old-name>.css behind.
const iconsDir = path.join(DIST, 'icons');
rmSync(iconsDir, { recursive: true, force: true });
mkdirSync(iconsDir, { recursive: true });

const names = Object.keys(ALL_ICONS).sort();
for (const name of names) {
  writeFileSync(path.join(iconsDir, `${name}.css`), generateIconCss(name, ALL_ICONS[name]));
}
console.log(`✓ Generated dist/icons/*.css (${names.length} files)`);
