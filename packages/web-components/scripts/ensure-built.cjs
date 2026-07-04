#!/usr/bin/env node
/**
 * Ensures dist/ is up-to-date before running integration tests.
 * If dist/index.js is missing or older than src/index.ts, runs stencil build.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const distIndex = path.resolve(__dirname, '../dist/index.js');
const srcIndex = path.resolve(__dirname, '../src/index.ts');

function needsBuild() {
  if (!fs.existsSync(distIndex)) {
    return true;
  }
  const distMtime = fs.statSync(distIndex).mtimeMs;
  const srcMtime = fs.statSync(srcIndex).mtimeMs;
  return distMtime < srcMtime;
}

if (needsBuild()) {
  console.log('dist/ is missing or outdated. Running build...');
  const result = spawnSync('pnpm', ['run', 'build'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} else {
  console.log('dist/ is up-to-date.');
}
