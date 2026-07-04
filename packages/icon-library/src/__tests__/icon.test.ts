import { describe, it, expect, beforeEach } from 'vitest';
import { registerAllIcons, getRegisteredIconCount, hasIcon, getIcon } from '@andersseen/icon';

describe('@andersseen/icon registration', () => {
  beforeEach(() => {
    const globalObject = globalThis as { __AND_ICONS_REGISTRY__?: Map<string, string> };
    globalObject.__AND_ICONS_REGISTRY__ = new Map<string, string>();
  });

  it('registerAllIcons() registers the expected icons', () => {
    registerAllIcons();

    expect(getRegisteredIconCount()).toBeGreaterThan(0);
    expect(hasIcon('github')).toBe(true);
    expect(hasIcon('moon')).toBe(true);
    expect(hasIcon('sun')).toBe(true);
    expect(hasIcon('close')).toBe(true);
    expect(hasIcon('chevron-down')).toBe(true);
    expect(getIcon('github')).toContain('<');
  });
});
