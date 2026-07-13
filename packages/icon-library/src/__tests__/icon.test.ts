import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerAllIcons,
  registerIcons,
  getRegisteredIconCount,
  getRegisteredIconNames,
  hasIcon,
  getIcon,
  ALL_ICONS,
  COMPONENT_ICONS,
  CLOSE,
  CHEVRON_DOWN,
} from '@andersseen/icon';

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

  it('registerIcons() registers only the given subset (tree-shakeable path)', () => {
    registerIcons({ 'close': CLOSE, 'chevron-down': CHEVRON_DOWN });

    expect(getRegisteredIconCount()).toBe(2);
    expect(hasIcon('close')).toBe(true);
    expect(hasIcon('chevron-down')).toBe(true);
    expect(hasIcon('github')).toBe(false);
  });

  it('getRegisteredIconNames() reflects exactly what was registered', () => {
    registerIcons({ 'close': CLOSE, 'chevron-down': CHEVRON_DOWN });

    expect(getRegisteredIconNames().sort()).toEqual(['chevron-down', 'close']);
  });

  it('getIcon() returns undefined for a name that was never registered', () => {
    expect(getIcon('does-not-exist')).toBeUndefined();
    expect(hasIcon('does-not-exist')).toBe(false);
  });

  it('COMPONENT_ICONS is a non-empty subset of ALL_ICONS', () => {
    const componentIconNames = Object.keys(COMPONENT_ICONS);

    expect(componentIconNames.length).toBeGreaterThan(0);
    for (const name of componentIconNames) {
      expect(ALL_ICONS).toHaveProperty(name);
      expect(ALL_ICONS[name]).toBe(COMPONENT_ICONS[name]);
    }
  });
});
