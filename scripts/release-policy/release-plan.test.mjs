#!/usr/bin/env node
// TD-28 regression test.
//
// A static check on package.json versions is not enough to catch TD-28: the
// bug only appears in the *release plan* that `changeset version` (i.e.
// `pnpm version-packages`) computes, which depends on Changesets' internal
// dependency/peer-bump logic, not just on the numbers currently committed.
//
// This test exercises the real, already-installed `@changesets/cli` (the
// exact binary `pnpm version-packages` runs) against disposable temp-directory
// fixtures — never against this repository's own files or changelogs — and
// asserts on its actual output. It:
//
//   1. Proves the *pre-fix* config (bare `workspace:*` peer range, no `fixed`
//      group) reproduces the historical bug: a `web-components` minor release
//      forces the wrappers to an unpublishable `1.0.0` (TD-28).
//   2. Proves the *current* config does not, for both a patch and a minor
//      `web-components` release.
//   3. Proves `scripts/validate-release-policy.mjs` actually rejects broken
//      release states (a wrapper pinned to 1.0.0, a fixed group missing a
//      member, a peer range that would silently switch pnpm to a registry
//      install) and passes on the real, current repository.
//
// Run: node scripts/release-policy/release-plan.test.mjs

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../..');
const CHANGESET_BIN = resolve(REPO_ROOT, 'node_modules/.bin/changeset');
const VALIDATE_SCRIPT = resolve(REPO_ROOT, 'scripts/validate-release-policy.mjs');

const PRODUCT = 'web-components';
const WRAPPERS = ['angular-components', 'react-components', 'vue-components'];
const ALL_PACKAGES = [PRODUCT, ...WRAPPERS];

let failures = 0;
let checks = 0;
function check(name, condition, detail) {
  checks++;
  if (condition) {
    console.log(`  ok   - ${name}`);
  } else {
    failures++;
    console.error(`  FAIL - ${name}${detail !== undefined ? `\n         ${detail}` : ''}`);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);
  if (type === 'patch') return `${major}.${minor}.${patch + 1}`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  if (type === 'major') return `${major + 1}.0.0`;
  throw new Error(`unknown bump type: ${type}`);
}

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'td28-release-plan-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Materializes a minimal, disposable pnpm workspace containing only the four
 * packages this policy governs, so the real Changesets engine can be run
 * against it without ever touching this repository's own files.
 */
function buildFixture(dir, { versions, peerRange, config }) {
  mkdirSync(join(dir, '.changeset'), { recursive: true });
  writeFileSync(join(dir, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n");
  writeJson(join(dir, 'package.json'), { name: 'td28-fixture-root', private: true });
  // `ignore` in the real config references packages that don't exist in this
  // minimal fixture, which Changesets rejects outright — irrelevant here.
  writeJson(join(dir, '.changeset', 'config.json'), { ...config, ignore: [] });
  for (const pkg of ALL_PACKAGES) {
    const pkgDir = join(dir, 'packages', pkg);
    mkdirSync(pkgDir, { recursive: true });
    const json = { name: `@andersseen/${pkg}`, version: versions[pkg] };
    if (pkg !== PRODUCT) {
      json.peerDependencies = { '@andersseen/web-components': peerRange };
    }
    writeJson(join(pkgDir, 'package.json'), json);
  }
}

function writeChangeset(dir, bumpType, id = 'sim') {
  writeFileSync(
    join(dir, '.changeset', `${id}.md`),
    `---\n"@andersseen/${PRODUCT}": ${bumpType}\n---\n\nSimulated ${bumpType} release for the TD-28 regression test.\n`,
  );
}

function runChangesetVersion(dir) {
  execFileSync(CHANGESET_BIN, ['version'], { cwd: dir, stdio: 'pipe' });
}

function readVersions(dir) {
  const out = {};
  for (const pkg of ALL_PACKAGES) {
    out[pkg] = readJson(join(dir, 'packages', pkg, 'package.json')).version;
  }
  return out;
}

function runValidator(dir) {
  try {
    execFileSync(process.execPath, [VALIDATE_SCRIPT, dir], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Seed everything from the REAL, current repository state so this test tracks
// reality instead of a hardcoded snapshot that drifts.
const REAL_CONFIG = readJson(join(REPO_ROOT, '.changeset', 'config.json'));
const BASE_VERSIONS = Object.fromEntries(
  ALL_PACKAGES.map(pkg => [pkg, readJson(join(REPO_ROOT, 'packages', pkg, 'package.json')).version]),
);
const REAL_PEER_RANGE = readJson(join(REPO_ROOT, 'packages', 'angular-components', 'package.json')).peerDependencies[
  '@andersseen/web-components'
];

console.log(`Base versions (read live from the repo): ${JSON.stringify(BASE_VERSIONS)}`);
console.log(`Wrapper peer range (read live from the repo): ${REAL_PEER_RANGE}\n`);

// ---------------------------------------------------------------------------
// 0. The pre-fix config still reproduces the historical bug (documents it,
//    and proves this harness would have caught it before it ever merged).
// ---------------------------------------------------------------------------
console.log('=== TD-28 historical bug: pre-fix config + MINOR web-components release ===');
withTempDir(dir => {
  const preFixConfig = { ...REAL_CONFIG };
  delete preFixConfig.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH;
  preFixConfig.fixed = [];
  buildFixture(dir, { versions: BASE_VERSIONS, peerRange: 'workspace:*', config: preFixConfig });
  writeChangeset(dir, 'minor');
  runChangesetVersion(dir);
  const after = readVersions(dir);
  check(
    'pre-fix config forces all three wrappers to unpublishable 1.0.0 on a plain minor release',
    WRAPPERS.every(w => after[w] === '1.0.0'),
    JSON.stringify(after),
  );
});

// ---------------------------------------------------------------------------
// 1 & 2. Current config: patch and minor release-plan simulations.
// ---------------------------------------------------------------------------
for (const bumpType of ['patch', 'minor']) {
  console.log(`\n=== current config: web-components ${bumpType.toUpperCase()} release ===`);
  withTempDir(dir => {
    buildFixture(dir, { versions: BASE_VERSIONS, peerRange: REAL_PEER_RANGE, config: REAL_CONFIG });
    writeChangeset(dir, bumpType);
    runChangesetVersion(dir);
    const after = readVersions(dir);
    const expectedProductVersion = bumpVersion(BASE_VERSIONS[PRODUCT], bumpType);

    check(
      `@andersseen/${PRODUCT} bumps to the expected ${bumpType} version`,
      after[PRODUCT] === expectedProductVersion,
      `got ${after[PRODUCT]}, expected ${expectedProductVersion}`,
    );
    for (const wrapper of WRAPPERS) {
      check(
        `${wrapper} mirrors @andersseen/${PRODUCT}'s new version`,
        after[wrapper] === after[PRODUCT],
        `${wrapper}=${after[wrapper]} vs ${PRODUCT}=${after[PRODUCT]}`,
      );
      check(`${wrapper} did not land on 1.0.0`, after[wrapper] !== '1.0.0', after[wrapper]);
    }
  });
}

// ---------------------------------------------------------------------------
// 3. Validator self-tests: it must actually catch broken states, not just
//    rubber-stamp whatever is on disk.
// ---------------------------------------------------------------------------
console.log('\n=== validator self-test: rejects a wrapper pinned to exactly 1.0.0 ===');
withTempDir(dir => {
  const versions = { ...BASE_VERSIONS, 'angular-components': '1.0.0' };
  buildFixture(dir, { versions, peerRange: REAL_PEER_RANGE, config: REAL_CONFIG });
  check('validator fails when a wrapper version is exactly 1.0.0', runValidator(dir) === false);
});

console.log('\n=== validator self-test: rejects a fixed group missing a wrapper ===');
withTempDir(dir => {
  const brokenConfig = {
    ...REAL_CONFIG,
    fixed: REAL_CONFIG.fixed.map(group => group.filter(name => name !== '@andersseen/vue-components')),
  };
  buildFixture(dir, { versions: BASE_VERSIONS, peerRange: REAL_PEER_RANGE, config: brokenConfig });
  check('validator fails when the fixed group is missing a package', runValidator(dir) === false);
});

console.log('\n=== validator self-test: rejects a peer range without the workspace: protocol ===');
withTempDir(dir => {
  buildFixture(dir, { versions: BASE_VERSIONS, peerRange: '>=0.4.0 <1.0.0', config: REAL_CONFIG });
  check(
    'validator fails when the peer range drops the workspace: protocol (would resolve from the npm registry)',
    runValidator(dir) === false,
  );
});

console.log('\n=== validator self-test: passes on the real, current repository ===');
check('validator passes against the live repository', runValidator(REPO_ROOT) === true);

// ---------------------------------------------------------------------------
console.log(`\n${checks} check(s) run.`);
if (failures > 0) {
  console.error(`❌ ${failures} check(s) failed.`);
  process.exit(1);
}
console.log('✅ all TD-28 release-plan regression checks passed.');
