import { describe, it, expect } from 'vitest';
import { generateIconsCss, generateIconsBaseCss, generateIconCss } from '../generate-css';
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

describe('generateIconsBaseCss (dist/base.css / @andersseen/icon/base.css)', () => {
  it('contains only the shared [and-icon] rule — no banner, no icon-specific mask-image', () => {
    const css = generateIconsBaseCss();

    expect(css).toContain('[and-icon] {');
    expect(css).toContain('width: 1em;');
    expect(css).toContain('background-color: currentColor;');
    expect(css).not.toContain('mask-image');
    expect(css).not.toContain('AUTO-GENERATED');
  });

  it('is byte-identical to the base rule embedded in the full generateIconsCss() output', () => {
    const base = generateIconsBaseCss().trim();
    const full = generateIconsCss();

    expect(full).toContain(base);
  });
});

describe('generateIconCss (dist/icons/<name>.css / @andersseen/icon/icons/<name>.css)', () => {
  it('contains only that icon’s rule — no base rule, no banner, no other icon', () => {
    const css = generateIconCss('home', ALL_ICONS.home);

    expect(css).toContain("[and-icon='home'] {");
    expect(css).not.toContain('[and-icon] {');
    expect(css).not.toContain('AUTO-GENERATED');
    expect(css).not.toContain("[and-icon='search']");
  });

  it('produces the exact same rule text every full-catalog icon rule is built from', () => {
    for (const [name, svg] of Object.entries(ALL_ICONS)) {
      const standalone = generateIconCss(name, svg).trim();
      const full = generateIconsCss();

      expect(full, `${name} rule in generateIconsCss() output should match generateIconCss(${name}, ...)`).toContain(
        standalone,
      );
    }
  });
});

describe('generateIconsCss composition (single generator, no parallel implementation)', () => {
  it('equals the banner + generateIconsBaseCss() + one generateIconCss() per icon, joined', () => {
    const subset = { close: ALL_ICONS.close, home: ALL_ICONS.home, star: ALL_ICONS.star };
    const composed = generateIconsCss(subset);

    const base = generateIconsBaseCss().trim();
    const rules = Object.keys(subset)
      .sort()
      .map(name => generateIconCss(name, subset[name]).trim());

    expect(composed).toContain(base);
    for (const rule of rules) {
      expect(composed).toContain(rule);
    }
    // banner, base, then one block per icon — nothing else.
    expect(composed.split('\n\n').length).toBe(1 + 1 + rules.length);
  });
});
