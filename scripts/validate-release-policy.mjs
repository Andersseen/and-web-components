#!/usr/bin/env node
// TD-28 release-policy guard.
//
// @andersseen/web-components is the product; angular/react/vue-components are
// thin generated adapters that must mirror its version exactly on the pre-1.0
// line (see docs/SSD.md TD-28, ADR-5, ADR-7). The version-matching itself is
// enforced by the Changesets `fixed` group in .changeset/config.json — this
// script is defense-in-depth: it fails CI if that policy is ever missing,
// weakened, or if its output would violate the release contract.
//
// Usage: node scripts/validate-release-policy.mjs [repoRoot]
// Exits non-zero (and prints every failure) if any check fails.

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(process.argv[2] ?? join(__dirname, '..'));

const PRODUCT = 'web-components';
const WRAPPERS = ['angular-components', 'react-components', 'vue-components'];
const EXPECTED_GROUP = [PRODUCT, ...WRAPPERS].map(pkg => `@andersseen/${pkg}`).sort();

const failures = [];
function fail(message) {
  failures.push(message);
}
function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

// --- Minimal semver helpers (dependency-light on purpose: this script only
// ever needs to compare plain X.Y.Z versions and evaluate simple
// space-separated ">=" / "<" / "<=" / ">" / "=" comparator clauses, not the
// full semver grammar). ---
function parseVersion(version, context) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`${context}: "${version}" is not a plain X.Y.Z version`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}
function compareVersions(a, b) {
  const va = parseVersion(a, 'compareVersions');
  const vb = parseVersion(b, 'compareVersions');
  for (let i = 0; i < 3; i++) {
    if (va[i] !== vb[i]) return va[i] - vb[i];
  }
  return 0;
}
const COMPARATORS = {
  '>=': (a, b) => compareVersions(a, b) >= 0,
  '<=': (a, b) => compareVersions(a, b) <= 0,
  '>': (a, b) => compareVersions(a, b) > 0,
  '<': (a, b) => compareVersions(a, b) < 0,
  '=': (a, b) => compareVersions(a, b) === 0,
};
function satisfiesRange(version, range) {
  const clauses = range.trim().split(/\s+/).filter(Boolean);
  if (clauses.length === 0) {
    throw new Error(`empty range`);
  }
  for (const clause of clauses) {
    const match = /^(>=|<=|>|<|=)(\d+\.\d+\.\d+)$/.exec(clause);
    if (!match) {
      throw new Error(`unrecognized range clause "${clause}" in "${range}"`);
    }
    const [, op, clauseVersion] = match;
    if (!COMPARATORS[op](version, clauseVersion)) return false;
  }
  return true;
}

// --- 1. .changeset/config.json: fixed group + peer-safety flag ---
const config = readJson(join(repoRoot, '.changeset', 'config.json'));

const fixedGroups = Array.isArray(config.fixed) ? config.fixed : [];
const matchingGroup = fixedGroups.find(
  group => Array.isArray(group) && group.some(name => EXPECTED_GROUP.includes(name)),
);
if (!matchingGroup) {
  fail(
    `.changeset/config.json: no "fixed" group contains @andersseen/${PRODUCT} — the wrapper packages will not mirror its version. Expected a group with exactly: ${EXPECTED_GROUP.join(', ')}`,
  );
} else {
  const actual = [...matchingGroup].sort();
  const expected = [...EXPECTED_GROUP];
  const same = actual.length === expected.length && actual.every((name, i) => name === expected[i]);
  if (!same) {
    fail(
      `.changeset/config.json: the fixed release group is incomplete or has unexpected members.\n    expected: ${expected.join(', ')}\n    actual:   ${actual.join(', ')}`,
    );
  }
}

const onlyUpdatePeerDependentsWhenOutOfRange =
  config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH?.onlyUpdatePeerDependentsWhenOutOfRange;
if (onlyUpdatePeerDependentsWhenOutOfRange !== true) {
  fail(
    '.changeset/config.json: ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange must be true — without it, Changesets majors every peer-dependent wrapper on any web-components minor/major release (TD-28).',
  );
}

// --- 2. Package versions and peer ranges ---
let productVersion;
try {
  const productPkg = readJson(join(repoRoot, 'packages', PRODUCT, 'package.json'));
  productVersion = productPkg.version;
  parseVersion(productVersion, `packages/${PRODUCT}/package.json version`);
} catch (err) {
  fail(`packages/${PRODUCT}/package.json: ${err.message}`);
}

for (const wrapper of WRAPPERS) {
  const pkgPath = join(repoRoot, 'packages', wrapper, 'package.json');
  let pkg;
  try {
    pkg = readJson(pkgPath);
  } catch (err) {
    fail(`packages/${wrapper}/package.json: could not read/parse (${err.message})`);
    continue;
  }

  // Invariant: 1.0.0 is permanently unpublishable for the wrapper packages
  // (already unpublished from npm once; npm never allows reuse). This is the
  // exact failure mode TD-28 produced twice.
  if (pkg.version === '1.0.0') {
    fail(
      `packages/${wrapper}/package.json: version is exactly "1.0.0", which is permanently unpublishable for this package (TD-28).`,
    );
  }

  // Invariant: wrapper version mirrors web-components' version exactly.
  if (productVersion && pkg.version !== productVersion) {
    fail(
      `packages/${wrapper}/package.json: version "${pkg.version}" does not match @andersseen/${PRODUCT}'s version "${productVersion}" — the release lines have diverged.`,
    );
  }

  // Invariant: the peer range on web-components must (a) use the workspace:
  // protocol, so pnpm links the local in-progress package instead of
  // resolving @andersseen/web-components from the npm registry during local
  // development/CI (verified empirically while building this guard — dropping
  // the "workspace:" prefix silently switches pnpm to a registry install),
  // and (b) actually be satisfied by the current web-components version.
  const range = pkg.peerDependencies?.['@andersseen/web-components'];
  if (typeof range !== 'string') {
    fail(`packages/${wrapper}/package.json: missing peerDependencies["@andersseen/web-components"].`);
  } else if (!range.startsWith('workspace:')) {
    fail(
      `packages/${wrapper}/package.json: peerDependencies["@andersseen/web-components"] = "${range}" does not use the "workspace:" protocol — pnpm will resolve it from the npm registry instead of the local workspace package.`,
    );
  } else if (productVersion) {
    const stripped = range.slice('workspace:'.length);
    try {
      if (stripped !== '*' && stripped !== '^' && stripped !== '~' && !satisfiesRange(productVersion, stripped)) {
        fail(
          `packages/${wrapper}/package.json: peerDependencies["@andersseen/web-components"] = "${range}" is not satisfied by the current version "${productVersion}".`,
        );
      }
    } catch (err) {
      fail(
        `packages/${wrapper}/package.json: peerDependencies["@andersseen/web-components"] = "${range}" — ${err.message}`,
      );
    }
  }
}

// --- Report ---
if (failures.length > 0) {
  console.error(`❌ release-policy validation failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):\n`);
  for (const message of failures) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

console.log('✅ release-policy validation passed: web-components/wrapper release contract is intact.');
