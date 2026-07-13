import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, '../dist/layout.css'), 'utf-8');

describe('@andersseen/layout build output', () => {
  it('compiles the flex direction switches', () => {
    expect(css).toContain('[and-layout~=horizontal]');
    expect(css).toContain('[and-layout~=vertical]');
  });

  it('compiles the grid utilities', () => {
    expect(css).toContain('[and-layout~=grid]');
    expect(css).toContain('[and-layout~="cols:1"]');
    expect(css).toContain('[and-layout~="span:full"]');
  });

  it('compiles spacing utilities across gap/padding/margin', () => {
    expect(css).toContain('[and-layout~="gap:md"]');
    expect(css).toContain('[and-layout~="p:lg"]');
    expect(css).toContain('[and-layout~="m-x:sm"]');
  });

  it('compiles responsive modifiers as min-width media queries', () => {
    expect(css).toMatch(/@media \(min-width: 768px\)/);
    expect(css).toContain('[and-layout~="cols@md:2"]');
  });

  it('compiles typography presets and modifiers', () => {
    expect(css).toContain('[and-text~=h1]');
    expect(css).toContain('[and-text~=caption]');
    expect(css).toContain('[and-text~="weight:bold"]');
  });
});
