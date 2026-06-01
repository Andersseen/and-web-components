/**
 * Script para eliminar referencias duplicadas a global.css de los componentes Stencil.
 * El global.css ya se inyecta una vez via globalStyle en stencil.config.ts.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const COMPONENTS_DIR = './src/components';

function processDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (entry.endsWith('.tsx')) {
      let content = readFileSync(fullPath, 'utf-8');
      const original = content;

      // Handle styleUrls array with global.css
      content = content.replace(/,\s*['"]\.\.\/\.\.\/global\/global\.css['"]/g, '');

      // Handle styleUrl: '../../global/global.css' (single string)
      // Remove the whole line if it's just the global.css reference
      content = content.replace(/\s*styleUrl:\s*['"]\.\.\/\.\.\/global\/global\.css['"],?\n/g, '\n');

      // Also clean up any remaining styleUrls: ['../../global/global.css'] alone
      content = content.replace(/styleUrls:\s*\['"]\.\.\/\.\.\/global\/global\.css['"]\],?\n/g, '');

      if (content !== original) {
        writeFileSync(fullPath, content, 'utf-8');
        console.log(`✅ Cleaned ${fullPath}`);
      }
    }
  }
}

processDir(COMPONENTS_DIR);
console.log('\nDone! All global.css references removed from components.');
