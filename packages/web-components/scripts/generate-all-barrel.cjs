#!/usr/bin/env node
/**
 * Generates tree-shakeable registration barrels for @andersseen/web-components.
 *
 * Run automatically after `stencil build` via the "build" npm script.
 *
 * Outputs / updates:
 *   - dist/components/all.js                 side-effect import of every component
 *   - dist/define-all-custom-elements.js     named defineXxx exports + defineAllCustomElements()
 *   - dist/define-all-custom-elements.d.ts   type declarations
 *   - dist/define-all-custom-elements.cjs.js CJS shim (ESM-only runtime)
 *   - dist/index.js                          patched to re-export define-all-custom-elements
 *   - dist/index.cjs.js                      patched to re-export define-all-custom-elements
 *   - dist/types/index.d.ts                  patched to re-export define-all-custom-elements
 *
 * AUTO-GENERATED — do not edit. Run "pnpm build" to regenerate.
 */

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const componentsDir = path.join(distDir, 'components');

if (!fs.existsSync(componentsDir)) {
  console.error('dist/components directory not found. Run stencil build first.');
  process.exit(1);
}

const files = fs
  .readdirSync(componentsDir)
  .filter((f) => f.startsWith('and-') && f.endsWith('.js'))
  .sort();

const componentNames = files.map((f) => f.replace(/\.js$/, ''));

/**
 * and-foo-bar -> AndFooBar
 */
function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const aliases = componentNames.map((name) => ({
  file: name,
  alias: `define${toPascalCase(name)}`,
  className: toPascalCase(name),
}));

const banner = `/**
 * @andersseen/web-components — register ALL custom elements at once.
 *
 * Usage (import everything):
 *   import { defineAllCustomElements } from "@andersseen/web-components";
 *   defineAllCustomElements();
 *
 * For tree-shaking, import individual components instead:
 *   import { defineAndNavbar } from "@andersseen/web-components";
 *   defineAndNavbar();
 *
 * AUTO-GENERATED — do not edit. Run "pnpm build" to regenerate.
 */
`;

// 1. dist/components/all.js — side-effect import barrel
const sideEffectImports = aliases.map(({ file }) => `import "./${file}.js";`).join('\n');
fs.writeFileSync(path.join(componentsDir, 'all.js'), banner + '\n' + sideEffectImports + '\n');

// 2. dist/define-all-custom-elements.js — ESM named exports + defineAllCustomElements()
const esmImports = aliases
  .map(({ file, alias }) => `import { defineCustomElement as ${alias} } from "./components/${file}.js";`)
  .join('\n');
const esmReExports = aliases.map(({ alias }) => `  ${alias},`).join('\n');
const esmDefinitions = aliases.map(({ alias }) => `  ${alias}();`).join('\n');

const esmContent = `${banner}${esmImports}

export {
${esmReExports}
};

export const defineAllCustomElements = () => {
${esmDefinitions}
};
`;

fs.writeFileSync(path.join(distDir, 'define-all-custom-elements.js'), esmContent);

// 3. dist/define-all-custom-elements.d.ts — type declarations
const dtsReExports = aliases
  .map(({ alias }) => `export declare const ${alias}: () => void;`)
  .join('\n');

const dtsContent = `${banner}${dtsReExports}

export declare const defineAllCustomElements: () => void;
`;

fs.writeFileSync(path.join(distDir, 'define-all-custom-elements.d.ts'), dtsContent);

// 4. dist/define-all-custom-elements.cjs.js — CJS shim
//    The component files are ESM, so synchronous CJS registration is not
//    supported. We export the function with a clear error so CJS consumers
//    that try to call it get actionable feedback.
const cjsContent = `${banner}'use strict';

const defineAllCustomElements = () => {
  throw new Error(
    '@andersseen/web-components: defineAllCustomElements() is only available in ESM. ' +
    'Use \`import { defineAllCustomElements } from "@andersseen/web-components"\` instead.'
  );
};

module.exports = {
  defineAllCustomElements,
};
`;

fs.writeFileSync(path.join(distDir, 'define-all-custom-elements.cjs.js'), cjsContent);

// 5. Patch dist/index.js to re-export the registration barrel.
const indexJsPath = path.join(distDir, 'index.js');
if (fs.existsSync(indexJsPath)) {
  fs.writeFileSync(
    indexJsPath,
    banner + "export * from './esm/index.js';\nexport * from './define-all-custom-elements.js';\n"
  );
}

// 6. Patch dist/index.cjs.js to re-export the registration barrel.
const indexCjsPath = path.join(distDir, 'index.cjs.js');
if (fs.existsSync(indexCjsPath)) {
  fs.writeFileSync(
    indexCjsPath,
    banner + "'use strict';\n\nconst index = require('./cjs/index.cjs.js');\nconst defineAll = require('./define-all-custom-elements.cjs.js');\n\nmodule.exports = Object.assign({}, index, defineAll);\n"
  );
}

// 7. Patch dist/types/index.d.ts to re-export the registration barrel.
const indexDtsPath = path.join(distDir, 'types', 'index.d.ts');
if (fs.existsSync(indexDtsPath)) {
  const original = fs.readFileSync(indexDtsPath, 'utf8');
  const patched = original.trimEnd() + "\nexport * from '../define-all-custom-elements';\n";
  fs.writeFileSync(indexDtsPath, patched);
}

console.log(`✓ Generated component registration barrels (${aliases.length} components)`);
