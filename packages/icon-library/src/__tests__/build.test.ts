import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildIconsCss, UnknownIconsError } from '../build';
import { generateIconsCss } from '../generate-css';
import { ALL_ICONS } from '../icons';

const FIXTURES_DIR = path.resolve(fileURLToPath(import.meta.url), '../fixtures');
const CLEAN_PROJECT = path.join(FIXTURES_DIR, 'scanner-project');
const UNKNOWN_PROJECT = path.join(FIXTURES_DIR, 'scanner-project-unknown');

const tmpDirs: string[] = [];
const makeTmpDir = (): string => {
  const dir = mkdtempSync(path.join(tmpdir(), 'and-icons-build-test-'));
  tmpDirs.push(dir);
  return dir;
};

afterEach(() => {
  while (tmpDirs.length > 0) {
    rmSync(tmpDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('buildIconsCss', () => {
  it('writes exactly generateIconsCss(subset) for the scanned + safelisted icons — reuses the shared generator', () => {
    const outDir = makeTmpDir();
    const outFile = path.join(outDir, 'and-icons.generated.css');

    const result = buildIconsCss({ cwd: CLEAN_PROJECT, safelist: ['plus'], outFile });

    expect(result.icons.sort()).toEqual(['close', 'github', 'home', 'plus', 'search', 'settings', 'star']);
    expect(existsSync(outFile)).toBe(true);

    const written = readFileSync(outFile, 'utf-8');
    const expectedSubset = Object.fromEntries(result.icons.map(name => [name, ALL_ICONS[name]]));
    expect(written).toBe(generateIconsCss(expectedSubset));
    expect(result.css).toBe(written);
  });

  it('defaults outFile to ./and-icons.generated.css relative to cwd', () => {
    const outDir = makeTmpDir();

    const result = buildIconsCss({ cwd: outDir, include: [] });

    expect(result.outFile).toBe(path.join(outDir, 'and-icons.generated.css'));
  });

  it('throws UnknownIconsError and writes nothing when a static usage is unknown', () => {
    const outDir = makeTmpDir();
    const outFile = path.join(outDir, 'should-not-exist.css');

    expect(() => buildIconsCss({ cwd: UNKNOWN_PROJECT, outFile })).toThrow(UnknownIconsError);
    expect(existsSync(outFile)).toBe(false);
  });

  it('leaves no partial/temp file behind after a failed build', () => {
    const outDir = makeTmpDir();
    const outFile = path.join(outDir, 'should-not-exist.css');

    try {
      buildIconsCss({ cwd: UNKNOWN_PROJECT, outFile });
    } catch {
      // expected
    }

    expect(readdirSync(outDir)).toEqual([]);
  });
});
