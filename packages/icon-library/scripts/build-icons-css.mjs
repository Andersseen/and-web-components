/**
 * Generates dist/icons.css from the compiled icon catalog.
 * Runs after the tsc build steps, so it imports the compiled
 * dist/generate-css.js rather than the TypeScript source.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.resolve(__dirname, '../dist/icons.css');

const { generateIconsCss } = await import('../dist/generate-css.js');

writeFileSync(OUTPUT, generateIconsCss());
console.log('✓ Generated dist/icons.css');
