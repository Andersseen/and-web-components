import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ALL_ICONS } from '../icons';
import { generateIconCss, generateIconsBaseCss, generateIconsCss } from '../generate-css';

/**
 * Verifies the actual build output (`pnpm -C packages/icon-library build`
 * must have run first — same requirement the rest of this suite already has,
 * since `@andersseen/icon` self-resolves to `dist/` via package "exports").
 * No hardcoded icon count anywhere — everything is derived from `ALL_ICONS`.
 */
const PACKAGE_ROOT = path.resolve(fileURLToPath(import.meta.url), '../../../');
const DIST = path.join(PACKAGE_ROOT, 'dist');
const iconNames = Object.keys(ALL_ICONS).sort();

describe('dist output — full CSS (strategy A)', () => {
  it('dist/icons.css exists and matches generateIconsCss()', () => {
    const css = readFileSync(path.join(DIST, 'icons.css'), 'utf-8');
    expect(css).toBe(generateIconsCss());
  });
});

describe('dist output — selective per-icon CSS (strategy B)', () => {
  it('dist/base.css matches generateIconsBaseCss()', () => {
    const css = readFileSync(path.join(DIST, 'base.css'), 'utf-8');
    expect(css).toBe(generateIconsBaseCss());
  });

  it('emits exactly one dist/icons/<name>.css per ALL_ICONS entry — no missing, no stale', () => {
    const files = readdirSync(path.join(DIST, 'icons')).sort();
    const expected = iconNames.map(name => `${name}.css`).sort();
    expect(files).toEqual(expected);
    expect(files).toHaveLength(iconNames.length);
  });

  it.each(iconNames)('dist/icons/%s.css points at the correct SVG', name => {
    const css = readFileSync(path.join(DIST, 'icons', `${name}.css`), 'utf-8');
    expect(css).toBe(generateIconCss(name, ALL_ICONS[name]));
  });
});

describe('dist output — build-time scanner (strategy C)', () => {
  it('dist/cli.js exists, is executable, and starts with a Node shebang', () => {
    const cliPath = path.join(DIST, 'cli.js');
    expect(existsSync(cliPath)).toBe(true);

    const stats = statSync(cliPath);
    expect(stats.mode & 0o111).not.toBe(0);

    const content = readFileSync(cliPath, 'utf-8');
    expect(content.split('\n')[0]).toBe('#!/usr/bin/env node');
  });

  it('dist/build.js (the programmatic @andersseen/icon/build API) exists', () => {
    expect(existsSync(path.join(DIST, 'build.js'))).toBe(true);
    expect(existsSync(path.join(DIST, 'build.d.ts'))).toBe(true);
  });
});

describe('dist output — runtime lazy loading (strategy D)', () => {
  it('dist/lazy.js exists and never embeds any icon’s data: URI (never bundles the SVG catalog)', () => {
    const lazyPath = path.join(DIST, 'lazy.js');
    expect(existsSync(lazyPath)).toBe(true);

    const content = readFileSync(lazyPath, 'utf-8');
    expect(content).not.toContain('data:image/svg+xml');
    expect(content).not.toMatch(/from ['"]\.\/icons(\.js)?['"]/);

    // sanity check: dist/lazy.js should be tiny compared to the full catalog CSS.
    const iconsCssSize = statSync(path.join(DIST, 'icons.css')).size;
    expect(content.length).toBeLessThan(iconsCssSize / 10);
  });
});

describe('package.json — public exports resolve to real files', () => {
  const pkg = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf-8')) as {
    bin: Record<string, string>;
    exports: Record<string, string | Record<string, string>>;
    sideEffects: string[];
  };

  it('bin.and-icons points at an existing file', () => {
    expect(existsSync(path.join(PACKAGE_ROOT, pkg.bin['and-icons']))).toBe(true);
  });

  it('every non-wildcard export condition resolves to a real file', () => {
    for (const [subpath, condition] of Object.entries(pkg.exports)) {
      if (subpath.includes('*')) {
        continue; // dist/icons/*.css — checked in the per-icon test above instead
      }
      const targets = typeof condition === 'string' ? [condition] : Object.values(condition);
      for (const target of targets) {
        expect(existsSync(path.join(PACKAGE_ROOT, target)), `${subpath} -> ${target}`).toBe(true);
      }
    }
  });

  it('the icons/*.css wildcard export resolves for a sample icon', () => {
    const iconsGlob = pkg.exports['./icons/*.css'] as string;
    const sample = iconsGlob.replace('*', iconNames[0]);
    expect(existsSync(path.join(PACKAGE_ROOT, sample))).toBe(true);
  });

  it('sideEffects keeps CSS and browser.js, but not lazy.js/build.js/cli.js', () => {
    expect(pkg.sideEffects).toContain('*.css');
    expect(pkg.sideEffects).toContain('./dist/browser.js');
    expect(pkg.sideEffects.some(entry => entry.includes('lazy'))).toBe(false);
  });
});
