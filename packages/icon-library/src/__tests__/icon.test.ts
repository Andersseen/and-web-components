import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('registerIcons() trust guard', () => {
  it('warns once (not throws) when registering markup with an event-handler attribute, and still registers it', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => registerIcons({ evil: '<image href="x" onerror="alert(1)" />' })).not.toThrow();
    expect(getIcon('evil')).toBe('<image href="x" onerror="alert(1)" />');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('evil');

    registerIcons({ evil: '<image href="x" onerror="alert(1)" />' });
    expect(warnSpy).toHaveBeenCalledTimes(1); // still once — warned names aren't repeated

    warnSpy.mockRestore();
  });

  it('warns when registering a disallowed element like <script>', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    registerIcons({ 'script-icon': '<script>alert(1)</script>' });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it('does not warn for markup using only the allowed stroke-icon elements', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    registerIcons({ 'safe': CLOSE, 'safe-2': CHEVRON_DOWN });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
