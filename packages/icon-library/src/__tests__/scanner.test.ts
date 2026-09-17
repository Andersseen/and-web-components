import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { scanIcons } from '../scanner';

const FIXTURES_DIR = path.resolve(fileURLToPath(import.meta.url), '../fixtures');
const CLEAN_PROJECT = path.join(FIXTURES_DIR, 'scanner-project');
const UNKNOWN_PROJECT = path.join(FIXTURES_DIR, 'scanner-project-unknown');

describe('scanIcons — detection', () => {
  it('detects double- and single-quoted static and-icon="name" literals', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT });

    expect(result.icons).toContain('home'); // and-icon="home"
    expect(result.icons).toContain('search'); // and-icon='search'
  });

  it('scans .html, .astro, .tsx, .vue, and .svelte files', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT });

    // one static, known usage lives in each of the five source files
    expect(result.icons.sort()).toEqual(['close', 'github', 'home', 'search', 'settings', 'star']);
    expect(result.filesScanned).toBe(5);
  });
});

describe('scanIcons — dedupe', () => {
  it('collapses repeated usages of the same icon into one entry in `icons`', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT });

    const closeUsages = result.usages.filter(usage => usage.name === 'close');
    expect(closeUsages.length).toBeGreaterThanOrEqual(2); // Widget.tsx uses it twice
    expect(result.icons.filter(name => name === 'close')).toEqual(['close']); // one entry, not two
  });
});

describe('scanIcons — determinism', () => {
  it('produces the same `icons` list and the same file order on repeated scans', () => {
    const first = scanIcons({ cwd: CLEAN_PROJECT });
    const second = scanIcons({ cwd: CLEAN_PROJECT });

    expect(second.icons).toEqual(first.icons);
    expect(second.usages.map(u => u.file)).toEqual(first.usages.map(u => u.file));
  });
});

describe('scanIcons — ignores dynamic usages', () => {
  it('never invents an icon name from a JSX expression or a Vue binding', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT });

    expect(result.icons).not.toContain('dynamicIcon');
    expect(result.usages.some(u => u.name === 'dynamicIcon')).toBe(false);
    expect(result.unknown.some(u => u.name === 'dynamicIcon')).toBe(false);
  });
});

describe('scanIcons — safelist', () => {
  it('includes safelisted names even when no static usage exists in source', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT, safelist: ['plus', 'minus'] });

    expect(result.icons).toContain('plus');
    expect(result.icons).toContain('minus');
  });

  it('reports an invalid safelist entry as unknown, tagged with a (safelist) location', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT, safelist: ['not-a-real-icon'] });

    expect(result.unknown).toContainEqual({ name: 'not-a-real-icon', file: '(safelist)' });
  });
});

describe('scanIcons — unknown static icon', () => {
  it('reports a static usage of a name outside ALL_ICONS, with its file', () => {
    const result = scanIcons({ cwd: UNKNOWN_PROJECT });

    expect(result.unknown).toContainEqual({ name: 'does-not-exist', file: 'bad.html' });
    expect(result.icons).not.toContain('does-not-exist');
  });
});

describe('scanIcons — ignores default directories', () => {
  it('never scans node_modules or dist, even when they contain and-icon literals', () => {
    const result = scanIcons({ cwd: CLEAN_PROJECT });

    expect(result.icons).not.toContain('node-modules-icon');
    expect(result.icons).not.toContain('dist-icon');
    expect(result.usages.every(u => !u.file.includes('node_modules') && !u.file.startsWith('dist'))).toBe(true);
  });
});

describe('scanIcons — exclude option', () => {
  it('skips an additional directory named in options.exclude', () => {
    const withoutExclude = scanIcons({ cwd: CLEAN_PROJECT });
    const withExclude = scanIcons({ cwd: CLEAN_PROJECT, exclude: ['src'] });

    expect(withoutExclude.filesScanned).toBeGreaterThan(0);
    expect(withExclude.filesScanned).toBe(0);
    expect(withExclude.icons).toEqual([]);
  });
});
