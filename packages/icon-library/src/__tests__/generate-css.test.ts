import { describe, it, expect } from 'vitest';
import { generateIconsCss } from '../generate-css';
import { ALL_ICONS } from '../icons';

const iconNames = Object.keys(ALL_ICONS);

describe('generateIconsCss', () => {
  it('generates non-empty CSS for the full catalog', () => {
    const css = generateIconsCss();

    expect(css.trim()).not.toBe('');
  });

  it('emits exactly one [and-icon="name"] rule per catalog entry — no missing, no orphan names', () => {
    const css = generateIconsCss();
    const ruleNames = [...css.matchAll(/\[and-icon='([^']+)'\]/g)].map(match => match[1]);

    expect(new Set(ruleNames).size).toBe(ruleNames.length); // no duplicate rules
    expect(ruleNames.sort()).toEqual([...iconNames].sort());
  });

  it('includes the shared base rule with mask sizing and currentColor', () => {
    const css = generateIconsCss();

    expect(css).toContain('[and-icon] {');
    expect(css).toContain('width: 1em;');
    expect(css).toContain('height: 1em;');
    expect(css).toContain('background-color: currentColor;');
    expect(css).toContain('mask-repeat: no-repeat;');
    expect(css).toContain('-webkit-mask-repeat: no-repeat;');
    expect(css).toContain('mask-size: contain;');
    expect(css).toContain('-webkit-mask-size: contain;');
  });

  it('emits both the standard and -webkit-prefixed mask-image declaration for every icon rule', () => {
    const css = generateIconsCss({ home: ALL_ICONS.home });

    expect(css).toMatch(/-webkit-mask-image: url\('data:image\/svg\+xml;base64,[^']+'\);/);
    expect(css).toMatch(/(?<!-webkit-)mask-image: url\('data:image\/svg\+xml;base64,[^']+'\);/);
  });

  it('round-trips the base64 data URI back to the original inner SVG markup without losing characters', () => {
    const css = generateIconsCss({ home: ALL_ICONS.home });
    const [, base64] = css.match(/mask-image: url\('data:image\/svg\+xml;base64,([^']+)'\);/) ?? [];

    expect(base64).toBeTruthy();
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');

    expect(decoded).toContain(ALL_ICONS.home);
    expect(decoded).toContain('viewBox="0 0 24 24"');
    expect(decoded).toContain('stroke="currentColor"');
    expect(decoded).toContain('fill="none"');
  });

  it('generates only the requested subset when given a custom icon map', () => {
    const css = generateIconsCss({ home: ALL_ICONS.home, search: ALL_ICONS.search, close: ALL_ICONS.close });
    const ruleNames = [...css.matchAll(/\[and-icon='([^']+)'\]/g)].map(match => match[1]);

    expect(ruleNames.sort()).toEqual(['close', 'home', 'search']);
    expect(css).not.toContain("[and-icon='star']");
  });

  it('sorts rules by name for stable diffs', () => {
    const css = generateIconsCss({ star: ALL_ICONS.star, close: ALL_ICONS.close, home: ALL_ICONS.home });
    const ruleNames = [...css.matchAll(/\[and-icon='([^']+)'\]/g)].map(match => match[1]);

    expect(ruleNames).toEqual(['close', 'home', 'star']);
  });
});
