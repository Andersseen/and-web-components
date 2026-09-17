/**
 * Framework-agnostic, textual scanner for static `and-icon="<name>"` usages.
 * Node-only (uses `node:fs`) — never imported by the main entry, only by
 * `build.ts`/`cli.ts`. Deliberately does not parse Angular/Vue/Astro/JSX —
 * see `isValidIconName`/the regex below for exactly what it can and can't
 * resolve statically.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { ALL_ICONS } from './icons';
import { isValidIconName } from './icon-name';

/** `and-icons.config.mjs`'s `export default` shape. Deliberately small. */
export interface AndIconsConfig {
  /** Icon names to always include, even if no static usage is found (for dynamic `and-icon` values the scanner can't resolve). */
  safelist?: string[];
  /** Root-relative directories/files to scan. Default: the whole cwd (`['.']`). */
  include?: string[];
  /** Extra directory names to ignore, merged with the built-in defaults (node_modules, dist, build, coverage, .git, .angular, .next, .nuxt). */
  exclude?: string[];
  /** Output CSS file path. Default: `./and-icons.generated.css`. */
  outFile?: string;
}

export interface ScanOptions {
  /** Defaults to `process.cwd()`. */
  cwd?: string;
  include?: string[];
  exclude?: string[];
  safelist?: string[];
}

export interface IconUsage {
  name: string;
  /** Path relative to `cwd`, or `(safelist)` for a config-provided name. */
  file: string;
}

export interface ScanResult {
  filesScanned: number;
  /** Sorted, deduplicated icon names — every one guaranteed to exist in `ALL_ICONS`. */
  icons: string[];
  /** Every static usage found in source, in scan order (not deduplicated). */
  usages: IconUsage[];
  /** Usages (source or safelist) whose name isn't a real, known icon. */
  unknown: IconUsage[];
}

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.angular',
  '.next',
  '.nuxt',
]);

const SCANNABLE_EXTENSIONS = new Set(['.html', '.htm', '.astro', '.ts', '.tsx', '.jsx', '.vue', '.svelte']);

/**
 * Matches a static `and-icon="name"` / `and-icon='name'` attribute literal.
 * The negative lookbehind rejects property/attribute bindings that spell the
 * same attribute name but aren't static: `[attr.and-icon]="x"` (Angular),
 * `:and-icon="x"` (Vue). A non-string value like `and-icon={x}` (JSX) is
 * already excluded by requiring a quote right after `=`.
 */
const AND_ICON_ATTR = /(?<![\w.:[-])and-icon\s*=\s*(['"])([^'"]*)\1/g;

const listDirEntries = (dir: string) =>
  readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

const walk = (dir: string, excludeDirs: Set<string>, files: string[]): void => {
  for (const entry of listDirEntries(dir)) {
    if (entry.isDirectory()) {
      if (!excludeDirs.has(entry.name)) {
        walk(path.join(dir, entry.name), excludeDirs, files);
      }
      continue;
    }
    if (entry.isFile() && SCANNABLE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(path.join(dir, entry.name));
    }
  }
};

const findUsagesInFile = (file: string): string[] =>
  [...readFileSync(file, 'utf-8').matchAll(AND_ICON_ATTR)].map(match => match[2]);

/**
 * Scans `options.include` (default: the whole `cwd`) for static
 * `and-icon="<name>"` usages, validates every found name (plus
 * `options.safelist`) against `ALL_ICONS`, and returns the result —
 * deterministic for a given source tree (sorted directory walk, sorted
 * `icons` output).
 */
export const scanIcons = (options: ScanOptions = {}): ScanResult => {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const excludeDirs = new Set([...DEFAULT_IGNORED_DIRS, ...(options.exclude ?? [])]);
  const roots = (options.include && options.include.length > 0 ? options.include : ['.']).map(root =>
    path.resolve(cwd, root),
  );

  const files: string[] = [];
  for (const root of roots) {
    if (statSync(root).isDirectory()) {
      walk(root, excludeDirs, files);
    } else {
      files.push(root);
    }
  }
  files.sort();

  const usages: IconUsage[] = [];
  for (const file of files) {
    for (const name of findUsagesInFile(file)) {
      usages.push({ name, file: path.relative(cwd, file) });
    }
  }

  const unknown: IconUsage[] = [];
  const known = new Set<string>();
  const isKnownIcon = (name: string): boolean => isValidIconName(name) && name in ALL_ICONS;

  for (const usage of usages) {
    if (isKnownIcon(usage.name)) {
      known.add(usage.name);
    } else {
      unknown.push(usage);
    }
  }

  for (const name of options.safelist ?? []) {
    if (isKnownIcon(name)) {
      known.add(name);
    } else {
      unknown.push({ name, file: '(safelist)' });
    }
  }

  return {
    filesScanned: files.length,
    icons: [...known].sort(),
    usages,
    unknown,
  };
};
