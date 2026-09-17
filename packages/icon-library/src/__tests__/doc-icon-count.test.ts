import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ALL_ICONS } from '../icons';

/**
 * Root README, SSD and CONTEXT have all drifted from the real icon count
 * before (87, 88 vs. the actual 86) because the number was hand-typed in
 * more than one place. `apps/astro-landing/src/lib/site-data.ts` already
 * solved this for the landing page by deriving its count from `ALL_ICONS`
 * instead of hardcoding it — this test guards the docs that still hardcode
 * a number, so a future icon addition/removal can't silently re-introduce
 * drift without a failing test pointing at the stale file.
 */

const REPO_ROOT = path.resolve(fileURLToPath(import.meta.url), '../../../../../');

const TRACKED_DOCS = ['README.md', 'docs/SSD.md', 'docs/CONTEXT.md', 'packages/icon-library/README.md'];

/** Matches "86 icons", "86 SVGs", "86 SVG icons", "86 tree-shakeable SVG icons", etc. */
const ICON_COUNT_PATTERN = /(\d+)\+?\s*(?:tree-shakeable\s+)?(?:SVG\s+icons?|icons?|SVGs)\b/gi;

const actualIconCount = Object.keys(ALL_ICONS).length;

describe('icon count stays in sync with ALL_ICONS across tracked docs', () => {
  it('ALL_ICONS has at least one icon (sanity check for the count itself)', () => {
    expect(actualIconCount).toBeGreaterThan(0);
  });

  it.each(TRACKED_DOCS)('%s does not hardcode a stale icon count', relativePath => {
    const content = readFileSync(path.join(REPO_ROOT, relativePath), 'utf-8');
    const matches = [...content.matchAll(ICON_COUNT_PATTERN)];

    for (const match of matches) {
      expect(Number(match[1]), `${relativePath}: "${match[0]}" should say ${actualIconCount}`).toBe(actualIconCount);
    }
  });
});
