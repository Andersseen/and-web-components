import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Content collections don't need an Astro runtime to sanity-check — this
// guards the mistake this docs app actually hit while it was being built:
// adding a page but forgetting its sidebar entry (or vice versa), which
// Astro won't itself catch since orphan pages still build fine.

const rootDir = fileURLToPath(new URL('../..', import.meta.url));
const contentDir = join(rootDir, 'src/content/docs');
const configPath = join(rootDir, 'sidebar.config.mjs');

function collectSlugs(dir: string, base = ''): string[] {
  const slugs: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      slugs.push(...collectSlugs(full, base ? `${base}/${entry}` : entry));
      continue;
    }
    if (!/\.(md|mdx)$/.test(entry)) continue;
    const name = entry.replace(/\.(md|mdx)$/, '');
    if (name === 'index') continue; // homepage — not a sidebar item
    slugs.push(base ? `${base}/${name}` : name);
  }
  return slugs;
}

function collectSidebarSlugs(): string[] {
  const source = readFileSync(configPath, 'utf-8');
  return [...source.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
}

describe('sidebar / content parity', () => {
  const contentSlugs = collectSlugs(contentDir).sort();
  const sidebarSlugs = collectSidebarSlugs().sort();

  it('every content page is listed in the sidebar', () => {
    const orphaned = contentSlugs.filter(slug => !sidebarSlugs.includes(slug));
    expect(orphaned, `pages missing a sidebar entry in sidebar.config.mjs: ${orphaned.join(', ')}`).toEqual([]);
  });

  it('every sidebar entry points at a real content page', () => {
    const dangling = sidebarSlugs.filter(slug => !contentSlugs.includes(slug));
    expect(dangling, `sidebar entries with no matching file under src/content/docs/: ${dangling.join(', ')}`).toEqual(
      [],
    );
  });

  it('has at least one page per top-level section (guides, components, motion)', () => {
    for (const section of ['guides', 'components', 'motion']) {
      const count = contentSlugs.filter(slug => slug.startsWith(`${section}/`)).length;
      expect(count, `expected at least one page under ${section}/`).toBeGreaterThan(0);
    }
  });
});
