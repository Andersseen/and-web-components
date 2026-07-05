#!/usr/bin/env node
/**
 * Ensures Storybook dependencies are built before starting the dev server.
 *
 * Storybook's preview.ts imports generated artifacts that are gitignored:
 *   - custom-elements.json (Stencil docs-custom-elements-manifest)
 *   - loader/ (Stencil dist output target)
 *   - motion-core/dist/style.css
 *   - layout-core/dist/layout.css
 *
 * This script checks for those artifacts and builds only the missing/outdated
 * packages, keeping subsequent `pnpm storybook` starts fast.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');

const artifacts = {
  stencil: {
    files: [
      path.resolve(root, 'packages/web-components/custom-elements.json'),
      path.resolve(root, 'packages/web-components/loader/index.js'),
      path.resolve(root, 'packages/web-components/dist/index.js'),
    ],
    build: () => run('pnpm', ['build:stencil']),
  },
  layout: {
    files: [path.resolve(root, 'packages/layout-core/dist/layout.css')],
    build: () => run('pnpm', ['build:layout']),
  },
};

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function isMissingOrOutdated(files) {
  for (const file of files) {
    if (!fs.existsSync(file)) {
      return true;
    }
  }
  return false;
}

let builtSomething = false;

for (const [name, { files, build }] of Object.entries(artifacts)) {
  if (isMissingOrOutdated(files)) {
    console.log(`Storybook artifact(s) for "${name}" are missing. Building...`);
    build();
    builtSomething = true;
  }
}

if (!builtSomething) {
  console.log('Storybook dependencies are up-to-date.');
}
