import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, '../dist/layout.css'), 'utf-8');

/**
 * The README is this package's entire public API: there are no exports to
 * typecheck, just attribute tokens that either compiled into `dist/layout.css`
 * or silently didn't. A documented token that never compiled is invisible —
 * `and-layout="p-t:xxxs"` simply does nothing.
 *
 * So the tables below mirror the README's reference sections exactly. Add a
 * token to the README, add it here; the test is the proof the docs aren't
 * writing cheques the stylesheet can't cash.
 */

/** Sass quotes a value only when it needs to, so accept both forms. */
const hasToken = (attribute: 'and-layout' | 'and-text', token: string): boolean =>
  css.includes(`[${attribute}~="${token}"]`) || css.includes(`[${attribute}~=${token}]`);

/** README → "Spacing": the value scale… */
const SPACING_VALUES = ['none', 'xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'auto'];
/** …and every property it applies to. */
const SPACING_PROPERTIES = [
  'gap',
  'gap-x',
  'gap-y',
  'p',
  'p-t',
  'p-b',
  'p-l',
  'p-r',
  'p-x',
  'p-y',
  'm',
  'm-t',
  'm-b',
  'm-l',
  'm-r',
  'm-x',
  'm-y',
];

/** README → "Responsive modifiers". */
const BREAKPOINTS = { 'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '1280px', '2xl': '1536px' };

const layoutTokens = (): string[] => {
  const tokens = ['horizontal', 'vertical', 'grid'];

  for (let column = 1; column <= 12; column++) {
    tokens.push(`cols:${column}`, `span:${column}`);
  }
  tokens.push('span:full');

  for (let line = 1; line <= 13; line++) {
    tokens.push(`col-start:${line}`, `col-end:${line}`);
  }
  tokens.push('col-start:auto', 'col-end:auto');

  for (const value of ['start', 'end', 'center', 'baseline', 'stretch']) tokens.push(`align:${value}`);
  for (const value of ['start', 'end', 'center', 'between', 'around', 'evenly']) tokens.push(`justify:${value}`);
  for (const value of ['nowrap', 'wrap', 'wrap-reverse']) tokens.push(`wrap:${value}`);

  for (const property of SPACING_PROPERTIES) {
    for (const value of SPACING_VALUES) tokens.push(`${property}:${value}`);
  }

  return tokens;
};

const textTokens = (): string[] => [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'p-sm',
  'p-xs',
  'caption',
  ...['left', 'center', 'right', 'justify'].map(value => `align:${value}`),
  ...['thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'].map(value => `weight:${value}`),
  ...['primary', 'secondary', 'accent', 'muted', 'destructive', 'background', 'foreground'].map(
    value => `color:${value}`,
  ),
];

describe('@andersseen/layout build output', () => {
  it('compiles something at all', () => {
    expect(css.length).toBeGreaterThan(1000);
  });

  it.each(layoutTokens())('compiles the documented `and-layout` token %s', token => {
    expect(
      hasToken('and-layout', token),
      `[and-layout~="${token}"] is documented but missing from dist/layout.css`,
    ).toBe(true);
  });

  it.each(textTokens())('compiles the documented `and-text` token %s', token => {
    expect(hasToken('and-text', token), `[and-text~="${token}"] is documented but missing from dist/layout.css`).toBe(
      true,
    );
  });

  it.each(Object.entries(BREAKPOINTS))('emits the %s breakpoint at min-width %s', (name, width) => {
    expect(css, `no @media (min-width: ${width}) for the ${name} breakpoint`).toContain(`@media (min-width: ${width})`);
  });

  // README: everything except the bare direction/grid switches and the
  // typography presets takes a `prop@breakpoint:value` form.
  it.each(Object.keys(BREAKPOINTS))('compiles responsive variants at the %s breakpoint', breakpoint => {
    for (const token of ['cols@:2', 'span@:6', 'align@:center', 'justify@:between', 'wrap@:wrap', 'gap@:md', 'p@:lg']) {
      const responsive = token.replace('@:', `@${breakpoint}:`);
      expect(hasToken('and-layout', responsive), `[and-layout~="${responsive}"] missing`).toBe(true);
    }

    for (const token of ['align@:center', 'weight@:bold', 'color@:muted']) {
      const responsive = token.replace('@:', `@${breakpoint}:`);
      expect(hasToken('and-text', responsive), `[and-text~="${responsive}"] missing`).toBe(true);
    }
  });

  it('ships no attribute token the README never mentions', () => {
    const documented = new Set([
      ...layoutTokens().map(token => `and-layout|${token}`),
      ...textTokens().map(token => `and-text|${token}`),
    ]);

    const shipped = new Set(
      [...css.matchAll(/\[(and-layout|and-text)~="?([^"\]]+)"?\]/g)]
        .map(match => `${match[1]}|${match[2]}`)
        // Responsive variants are covered by the test above.
        .filter(token => !token.includes('@')),
    );

    const undocumented = [...shipped].filter(token => !documented.has(token));
    expect(undocumented, `tokens in dist/layout.css with no README entry: ${undocumented.join(', ')}`).toEqual([]);
  });
});
