/**
 * Node-only build-time API (`@andersseen/icon/build`) for the scanner loading
 * strategy — never imported by the package's main entry. Thin orchestration
 * over `scanIcons()` (scanner.ts) and `generateIconsCss()` (generate-css.ts):
 * no second CSS generator, the scanner just picks which subset to hand it.
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { generateIconsCss } from './generate-css';
import { ALL_ICONS } from './icons';
import { scanIcons } from './scanner';
import type { AndIconsConfig, IconUsage, ScanOptions, ScanResult } from './scanner';

export { scanIcons };
export type { AndIconsConfig, IconUsage, ScanOptions, ScanResult };

export interface BuildIconsCssOptions extends ScanOptions {
  /** Output CSS file path, relative to `cwd`. Default: `./and-icons.generated.css`. */
  outFile?: string;
}

export interface BuildIconsCssResult extends ScanResult {
  css: string;
  /** Absolute path the CSS was written to. */
  outFile: string;
}

const DEFAULT_OUT_FILE = './and-icons.generated.css';

/** Thrown by `buildIconsCss()` when the scan finds a name outside `ALL_ICONS`. No output file is written. */
export class UnknownIconsError extends Error {
  readonly unknown: IconUsage[];

  constructor(unknown: IconUsage[]) {
    super(`Unknown icon${unknown.length === 1 ? '' : 's'}: ${unknown.map(u => `"${u.name}" (${u.file})`).join(', ')}`);
    this.name = 'UnknownIconsError';
    this.unknown = unknown;
  }
}

/**
 * Writes to a sibling temp file first, then renames over the real path — a
 * process crash mid-write can never leave a truncated/corrupt output file.
 */
const writeAtomic = (file: string, content: string): void => {
  const dir = path.dirname(file);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const tmpFile = path.join(dir, `.${path.basename(file)}.${process.pid}.tmp`);
  writeFileSync(tmpFile, content);
  renameSync(tmpFile, file);
};

/**
 * Scans for `and-icon="name"` usages (`scanIcons`), fails loudly on any name
 * outside `ALL_ICONS` (`UnknownIconsError` — never a silently-empty mask),
 * and otherwise writes one CSS file containing exactly the base rule plus
 * the icons actually used, via the same `generateIconsCss()` that builds
 * `icons.css`/`base.css`/`icons/<name>.css`.
 */
export const buildIconsCss = (options: BuildIconsCssOptions = {}): BuildIconsCssResult => {
  const result = scanIcons(options);

  if (result.unknown.length > 0) {
    throw new UnknownIconsError(result.unknown);
  }

  const subset = Object.fromEntries(result.icons.map(name => [name, ALL_ICONS[name]]));
  const css = generateIconsCss(subset);
  const outFile = path.resolve(options.cwd ?? process.cwd(), options.outFile ?? DEFAULT_OUT_FILE);

  writeAtomic(outFile, css);

  return { ...result, css, outFile };
};
