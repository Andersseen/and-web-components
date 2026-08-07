import { describe, it, expect } from 'vitest';
import { ALL_ICONS } from '@andersseen/icon';

/**
 * Content-level guards for the icon set.
 *
 * The registration tests next door only prove an icon *exists*. They never
 * looked at the drawing, which is how `lock` and `user` shipped to npm with
 * half of their shapes missing, and how `image` shipped as a byte-identical
 * copy of `layout`. Everything here inspects the markup itself.
 *
 * Convention every icon must follow (see the package README):
 * Lucide-based, 24×24 viewBox, stroke-only — the `<svg>` wrapper in
 * `<and-icon>` owns `fill="none"`, `stroke="currentColor"` and
 * `stroke-width="2"`, so an icon must never hardcode them.
 */

/** Shape elements an icon body may use. `g` is a grouping wrapper. */
const ALLOWED_ELEMENTS = ['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g'];

/** The 24×24 viewBox. Anything outside this is clipped when rendered. */
const VIEWBOX_MIN = 0;
const VIEWBOX_MAX = 24;

const entries = Object.entries(ALL_ICONS);

const elementsOf = (markup: string): string[] => [...markup.matchAll(/<\s*([a-zA-Z][a-zA-Z0-9-]*)/g)].map(m => m[1]);

const attributesOf = (markup: string): { element: string; name: string; value: string }[] => {
  const found: { element: string; name: string; value: string }[] = [];
  for (const tag of markup.matchAll(/<\s*([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g)) {
    const [, element, rawAttributes] = tag;
    for (const attribute of rawAttributes.matchAll(/([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*"([^"]*)"/g)) {
      found.push({ element, name: attribute[1], value: attribute[2] });
    }
  }
  return found;
};

/**
 * Every coordinate an icon draws at, in absolute user units.
 *
 * Path data is walked command by command so relative commands resolve against
 * the current point; arc radii/flags are skipped (they aren't positions) and
 * only the arc endpoint is recorded. Bézier control points are included: they
 * sit outside the curve itself, so this is a conservative bound — good enough
 * to catch a shape drawn against the wrong viewBox, which is what we're after.
 */
const coordinatesOf = (markup: string): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const push = (x: number, y: number) => points.push({ x, y });

  // Shapes carrying their geometry in a single attribute.
  for (const { element, name, value } of attributesOf(markup)) {
    if (element === 'path' && name === 'd') {
      points.push(...pathCoordinates(value));
    }
    if ((element === 'polyline' || element === 'polygon') && name === 'points') {
      const numbers = [...value.matchAll(/-?\d*\.?\d+/g)].map(Number);
      for (let i = 0; i + 1 < numbers.length; i += 2) {
        push(numbers[i], numbers[i + 1]);
      }
    }
  }

  // Shapes whose extent is spread across several attributes.
  for (const box of markup.matchAll(/<\s*(circle|ellipse|rect|line)([^>]*)>/g)) {
    const [, element, rawAttributes] = box;
    const attr = (attribute: string): number => {
      const match = rawAttributes.match(new RegExp(`${attribute}\\s*=\\s*"([^"]*)"`));
      return match ? Number(match[1]) : 0;
    };
    if (element === 'circle') {
      const [cx, cy, r] = [attr('cx'), attr('cy'), attr('r')];
      push(cx - r, cy - r);
      push(cx + r, cy + r);
    } else if (element === 'ellipse') {
      const [cx, cy, rx, ry] = [attr('cx'), attr('cy'), attr('rx'), attr('ry')];
      push(cx - rx, cy - ry);
      push(cx + rx, cy + ry);
    } else if (element === 'rect') {
      const [x, y] = [attr('x'), attr('y')];
      push(x, y);
      push(x + attr('width'), y + attr('height'));
    } else {
      push(attr('x1'), attr('y1'));
      push(attr('x2'), attr('y2'));
    }
  }

  return points;
};

/** Walks SVG path data and returns every absolute point it moves through. */
const pathCoordinates = (d: string): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  let [x, y, startX, startY] = [0, 0, 0, 0];

  for (const segment of d.matchAll(/([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g)) {
    const command = segment[1];
    const numbers = [...segment[2].matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(Number);
    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();

    // (dx, dy) pairs per repetition, plus which of them are real coordinates.
    const strides: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 };

    if (upper === 'Z') {
      [x, y] = [startX, startY];
      continue;
    }

    const stride = strides[upper];
    for (let i = 0; i + stride <= numbers.length; i += stride) {
      const chunk = numbers.slice(i, i + stride);
      if (upper === 'H') {
        x = relative ? x + chunk[0] : chunk[0];
      } else if (upper === 'V') {
        y = relative ? y + chunk[0] : chunk[0];
      } else if (upper === 'A') {
        // rx ry rotation large-arc sweep x y — only the endpoint is a position.
        x = relative ? x + chunk[5] : chunk[5];
        y = relative ? y + chunk[6] : chunk[6];
      } else {
        for (let pair = 0; pair < chunk.length; pair += 2) {
          const [px, py] = [chunk[pair], chunk[pair + 1]];
          points.push({ x: relative ? x + px : px, y: relative ? y + py : py });
        }
        x = relative ? x + chunk[chunk.length - 2] : chunk[chunk.length - 2];
        y = relative ? y + chunk[chunk.length - 1] : chunk[chunk.length - 1];
      }
      points.push({ x, y });
      if (upper === 'M' && i === 0) {
        [startX, startY] = [x, y];
      }
    }
  }

  return points;
};

describe('icon content guards', () => {
  // The guards below are only worth having if they actually fire, so each one
  // is exercised against markup that should trip it.

  it('resolves relative path commands against the current point', () => {
    // The `home` roof: m3 9 → (3,9), then 9-7 → (12,2), then 9 7 → (21,9).
    const points = coordinatesOf('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />');

    expect(points).toContainEqual({ x: 12, y: 2 });
    expect(points).toContainEqual({ x: 21, y: 9 });
    expect(points.every(({ x, y }) => x >= 0 && x <= 24 && y >= 0 && y <= 24)).toBe(true);
  });

  it('flags a shape drawn past the viewBox', () => {
    const tooTall = coordinatesOf('<path d="M4 8v20" />');
    const tooWide = coordinatesOf('<rect width="30" height="10" x="2" y="6" />');
    const offCircle = coordinatesOf('<circle cx="12" cy="20" r="8" />');

    expect(tooTall.some(({ y }) => y > VIEWBOX_MAX)).toBe(true);
    expect(tooWide.some(({ x }) => x > VIEWBOX_MAX)).toBe(true);
    expect(offCircle.some(({ y }) => y > VIEWBOX_MAX)).toBe(true);
  });

  it('reads polygon and polyline point lists', () => {
    expect(coordinatesOf('<polygon points="5 3 19 12 5 21" />')).toEqual([
      { x: 5, y: 3 },
      { x: 19, y: 12 },
      { x: 5, y: 21 },
    ]);
  });

  it('sees through a <g> wrapper to the shapes inside', () => {
    expect(elementsOf('<g><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /></g>')).toEqual([
      'g',
      'circle',
      'path',
    ]);
  });

  it('spots elements outside the allowed set', () => {
    const elements = elementsOf('<text x="2" y="2">hi</text><path d="M5 12h14" />');

    expect(elements.some(element => !ALLOWED_ELEMENTS.includes(element))).toBe(true);
  });

  it('spots hardcoded paint', () => {
    const attributes = attributesOf('<circle cx="13" cy="7" r="1" fill="currentColor" stroke="#000" />');

    expect(attributes).toContainEqual({ element: 'circle', name: 'fill', value: 'currentColor' });
    expect(attributes).toContainEqual({ element: 'circle', name: 'stroke', value: '#000' });
  });
});

describe('icon content', () => {
  it('ships a non-empty set', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)('%s parses into at least one shape element', (name, markup) => {
    expect(markup.trim(), `${name} is empty`).not.toBe('');

    const shapes = elementsOf(markup).filter(element => element !== 'g');
    expect(shapes.length, `${name} draws nothing`).toBeGreaterThan(0);
  });

  it.each(entries)('%s is well-formed markup', (name, markup) => {
    const openTags = (markup.match(/<\s*[a-zA-Z]/g) ?? []).length;
    const closedTags = (markup.match(/\/>/g) ?? []).length + (markup.match(/<\/\s*[a-zA-Z]/g) ?? []).length;
    expect(closedTags, `${name} has an unclosed tag`).toBe(openTags);
    expect(markup.includes('<>'), `${name} has an empty tag`).toBe(false);
  });

  it.each(entries)('%s only uses allowed shape elements', (name, markup) => {
    for (const element of elementsOf(markup)) {
      expect(ALLOWED_ELEMENTS, `${name} uses <${element}>`).toContain(element);
    }
  });

  it.each(entries)('%s stays inside the 24×24 viewBox', (name, markup) => {
    for (const { x, y } of coordinatesOf(markup)) {
      expect(x, `${name} draws at x=${x}`).toBeGreaterThanOrEqual(VIEWBOX_MIN);
      expect(x, `${name} draws at x=${x}`).toBeLessThanOrEqual(VIEWBOX_MAX);
      expect(y, `${name} draws at y=${y}`).toBeGreaterThanOrEqual(VIEWBOX_MIN);
      expect(y, `${name} draws at y=${y}`).toBeLessThanOrEqual(VIEWBOX_MAX);
    }
  });

  it.each(entries)('%s inherits color from the host <svg>', (name, markup) => {
    for (const { name: attribute, value } of attributesOf(markup)) {
      if (attribute === 'fill') {
        expect(value, `${name} hardcodes fill="${value}"`).toBe('none');
      }
      if (attribute === 'stroke') {
        expect(value, `${name} hardcodes stroke="${value}"`).toBe('currentColor');
      }
      expect(attribute, `${name} sets ${attribute} inline`).not.toBe('style');
      expect(attribute, `${name} pins its own stroke-width`).not.toBe('stroke-width');
    }
  });

  it('has no two icons drawing the same thing', () => {
    const byMarkup = new Map<string, string[]>();
    for (const [name, markup] of entries) {
      const normalized = markup
        .replace(/\s+/g, ' ')
        .replace(/<\/?g>/g, '')
        .trim();
      byMarkup.set(normalized, [...(byMarkup.get(normalized) ?? []), name]);
    }

    const duplicates = [...byMarkup.values()].filter(names => names.length > 1);
    expect(duplicates, `aliased icons: ${duplicates.map(names => names.join(' = ')).join(', ')}`).toEqual([]);
  });

  it('matches the recorded shape signature of every icon', () => {
    // A truncated icon (a `lock` that lost its shackle) still passes every
    // check above, because what's left is valid markup. This snapshot makes a
    // vanished shape show up as a diff in review. Update with `vitest -u`
    // whenever you intentionally add, remove or redraw an icon.
    const signatures = Object.fromEntries(
      entries.map(([name, markup]) => [
        name,
        elementsOf(markup)
          .filter(element => element !== 'g')
          .join(','),
      ]),
    );

    expect(signatures).toMatchSnapshot();
  });
});
