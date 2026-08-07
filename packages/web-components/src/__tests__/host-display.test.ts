import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * `src/global/component-base.css` ends with `:host { display: block }`. Stencil
 * concatenates `styleUrls` in array order into one stylesheet per component, so
 * listing the base sheet *after* a component's own CSS silently overrides
 * whatever `:host { display: … }` that component declared — same specificity,
 * later rule wins.
 *
 * That is how `and-button` shipped declaring `inline-block` and rendering as a
 * full-width block, and how `and-modal`/`and-drawer` lost their `display:
 * contents`. Nothing failed: the declaration was still in the file, and no test
 * looks at computed styles.
 *
 * Rule: if a component's own stylesheet sets `:host { display: … }`, the base
 * sheet must come first in `styleUrls`.
 */

const COMPONENTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../components');
const BASE_STYLESHEET = 'component-base.css';

interface ComponentStyles {
  tag: string;
  file: string;
  styleUrls: string[];
  ownDisplay: string | null;
  ownStylesheetIndex: number;
  baseIndex: number;
}

const readComponents = (): ComponentStyles[] => {
  const found: ComponentStyles[] = [];

  for (const dir of readdirSync(COMPONENTS_DIR)) {
    const componentDir = join(COMPONENTS_DIR, dir);
    if (!existsSync(componentDir) || !statSync(componentDir).isDirectory()) {
      continue;
    }

    for (const file of readdirSync(componentDir)) {
      if (!file.endsWith('.tsx') || file.includes('.spec.')) {
        continue;
      }
      const source = readFileSync(join(componentDir, file), 'utf8');

      // One file may hold several @Component classes (and-card, and-tabs, …).
      for (const block of source.split(/(?=@Component\(\{)/).slice(1)) {
        const tag = block.match(/tag:\s*'([^']+)'/)?.[1];
        if (!tag) {
          continue;
        }

        const raw = block.match(/styleUrls:\s*\[([^\]]*)\]/)?.[1] ?? block.match(/styleUrl:\s*('[^']+')/)?.[1] ?? '';
        const styleUrls = [...raw.matchAll(/'([^']+)'/g)].map(match => match[1]);

        const ownStylesheetIndex = styleUrls.findIndex(url => !url.includes('global/'));
        const ownStylesheet = styleUrls[ownStylesheetIndex];
        const ownPath = ownStylesheet ? join(componentDir, ownStylesheet) : null;
        const ownDisplay =
          ownPath && existsSync(ownPath)
            ? (readFileSync(ownPath, 'utf8').match(/:host\s*\{[^}]*?display:\s*([a-z-]+)/)?.[1] ?? null)
            : null;

        found.push({
          tag,
          file: join(dir, file),
          styleUrls,
          ownDisplay,
          ownStylesheetIndex,
          baseIndex: styleUrls.findIndex(url => url.includes(BASE_STYLESHEET)),
        });
      }
    }
  }

  return found.sort((a, b) => a.tag.localeCompare(b.tag));
};

const components = readComponents();

describe('component host display', () => {
  it('finds every component', () => {
    expect(components.length).toBeGreaterThan(30);
    expect(components.map(c => c.tag)).toContain('and-button');
  });

  // Only a display *other than* `block` can be harmed: the base sheet declares
  // `block`, so a component asking for `block` gets it either way.
  it.each(components.filter(c => c.ownDisplay !== null && c.ownDisplay !== 'block' && c.baseIndex !== -1))(
    '$tag keeps the `display: $ownDisplay` its own stylesheet declares',
    ({ tag, styleUrls, ownStylesheetIndex, baseIndex, ownDisplay }) => {
      expect(
        baseIndex,
        `${tag} lists ${BASE_STYLESHEET} after its own stylesheet, so the base ` +
          `\`:host { display: block }\` overrides \`display: ${ownDisplay}\`. ` +
          `Put the base sheet first: [${styleUrls.join(', ')}]`,
      ).toBeLessThan(ownStylesheetIndex);
    },
  );

  it('keeps the base stylesheet the one that declares the fallback display', () => {
    const base = readFileSync(resolve(COMPONENTS_DIR, '../global/component-base.css'), 'utf8');

    // If this ever stops being true, the ordering rule above is pointless and
    // this whole file should be revisited.
    expect(base).toMatch(/:host\s*\{[^}]*display:\s*block/);
  });
});
