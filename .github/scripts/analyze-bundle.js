#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Compare vanilla vs Stencil bundle sizes
 */

import { statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

console.log('📦 Bundle Size Analysis\n');
console.log('='.repeat(60));

// Check vanilla bundle
const vanillaPaths = {
  js: join(__dirname, '../dist/index.esm.js'),
  css: join(__dirname, '../dist/styles/index.css'),
};

console.log('\n🟦 @andersseen/vanilla-components');
console.log('-'.repeat(60));

let vanillaTotal = 0;

try {
  const jsStats = statSync(vanillaPaths.js);
  const jsSize = (jsStats.size / 1024).toFixed(2);
  vanillaTotal += jsStats.size;
  console.log(`  JavaScript: ${jsSize} KB`);
} catch {
  console.log('  JavaScript: Not built yet');
}

try {
  const cssStats = statSync(vanillaPaths.css);
  const cssSize = (cssStats.size / 1024).toFixed(2);
  vanillaTotal += cssStats.size;
  console.log(`  CSS:        ${cssSize} KB`);
} catch {
  console.log('  CSS:        Not built yet');
}

if (vanillaTotal > 0) {
  console.log(`  TOTAL:      ${(vanillaTotal / 1024).toFixed(2)} KB`);
}

// Check Stencil bundle for comparison
const stencilPath = join(__dirname, '../../web-components/dist/web-components/web-components.esm.js');

console.log('\n🟨 @andersseen/web-components (Stencil)');
console.log('-'.repeat(60));

try {
  const stencilStats = statSync(stencilPath);
  const stencilSize = (stencilStats.size / 1024).toFixed(2);
  console.log(`  Bundle: ${stencilSize} KB`);
} catch {
  console.log('  Bundle: Not built yet');
}

// Comparison
console.log('\n📊 Comparison');
console.log('='.repeat(60));
console.log('Vanilla advantages:');
console.log('  ✓ Zero runtime dependencies');
console.log('  ✓ Native browser APIs only');
console.log('  ✓ Debuggable source code');
console.log('  ✓ Smaller memory footprint');
console.log('  ✓ No framework lock-in');

console.log('\nStencil advantages:');
console.log('  ✓ Lazy loading out of the box');
console.log('  ✓ Built-in TypeScript support');
console.log('  ✓ Automatic polyfills');
console.log('  ✓ React/Vue/Angular wrappers');
console.log('  ✓ More mature ecosystem');

console.log('\n' + '='.repeat(60));
console.log('Run `pnpm build` to generate bundles for comparison');
