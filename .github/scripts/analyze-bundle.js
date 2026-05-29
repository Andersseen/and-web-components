#!/usr/bin/env node

/**
 * Bundle Size Analysis
 * Measures actual bundle sizes after build for all @andersseen packages.
 */

import { statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2);
}

function getSize(path) {
  try {
    const stats = statSync(path);
    return stats.size;
  } catch {
    return null;
  }
}

function printSize(label, path) {
  const size = getSize(path);
  if (size !== null) {
    console.log(`  ${label.padEnd(20)} ${formatBytes(size).padStart(8)} KB`);
    return size;
  } else {
    console.log(`  ${label.padEnd(20)} Not built yet`);
    return 0;
  }
}

console.log('📦 And Web Components — Bundle Analysis\n');
console.log('='.repeat(60));

let total = 0;

// Web Components (Stencil)
console.log('\n🟨 @andersseen/web-components (Stencil)');
console.log('-'.repeat(60));
const stencilEsm = join(__dirname, '../../packages/web-components/dist/web-components/web-components.esm.js');
const stencilCjs = join(__dirname, '../../packages/web-components/dist/web-components/web-components.cjs.js');
const stencilCss = join(__dirname, '../../packages/web-components/dist/web-components/web-components.css');

total += printSize('ESM (modern):', stencilEsm);
total += printSize('CJS (legacy):', stencilCjs);
total += printSize('Global CSS:', stencilCss);
console.log(
  `  ${'TOTAL (ESM+CSS)'.padEnd(20)} ${formatBytes((getSize(stencilEsm) || 0) + (getSize(stencilCss) || 0)).padStart(8)} KB`,
);

// Headless Components
console.log('\n🟦 @andersseen/headless-components');
console.log('-'.repeat(60));
const headlessEsm = join(__dirname, '../../packages/headless-core/dist/index.js');
const headlessCjs = join(__dirname, '../../packages/headless-core/dist-cjs/index.js');
total += printSize('ESM:', headlessEsm);
total += printSize('CJS:', headlessCjs);

// Motion
console.log('\n🟪 @andersseen/motion');
console.log('-'.repeat(60));
const motionEsm = join(__dirname, '../../packages/motion-core/dist/index.js');
const motionCjs = join(__dirname, '../../packages/motion-core/dist-cjs/index.js');
const motionCss = join(__dirname, '../../packages/motion-core/dist/style.css');
total += printSize('ESM:', motionEsm);
total += printSize('CJS:', motionCjs);
total += printSize('CSS:', motionCss);

// Layout
console.log('\n🟩 @andersseen/layout');
console.log('-'.repeat(60));
const layoutCss = join(__dirname, '../../packages/layout-core/dist/layout.css');
const layoutMinCss = join(__dirname, '../../packages/layout-core/dist/layout.min.css');
total += printSize('CSS:', layoutCss);
total += printSize('CSS (min):', layoutMinCss);

// Icons
console.log('\n🟥 @andersseen/icon');
console.log('-'.repeat(60));
const iconEsm = join(__dirname, '../../packages/icon-library/dist/index.js');
const iconCjs = join(__dirname, '../../packages/icon-library/dist-cjs/index.js');
total += printSize('ESM:', iconEsm);
total += printSize('CJS:', iconCjs);

console.log('\n' + '='.repeat(60));
console.log(`📊 Grand total of all artifacts: ${formatBytes(total)} KB`);
console.log('='.repeat(60));
console.log('\nRun `pnpm build:all` to generate bundles for comparison.\n');
