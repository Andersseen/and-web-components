import { describe, it, expect, beforeEach } from 'vitest';

interface CustomElementsRegistry {
  define: (name: string, ctor: unknown) => void;
  get: (name: string) => unknown;
}

describe('@andersseen/web-components registration', () => {
  let defined: Map<string, unknown>;

  beforeEach(() => {
    defined = new Map<string, unknown>();
    (globalThis as { customElements?: CustomElementsRegistry }).customElements = {
      define: (name: string, ctor: unknown) => defined.set(name, ctor),
      get: (name: string) => defined.get(name),
    };
  });

  it('defineAllCustomElements() registers at least 3 distinct components', async () => {
    const { defineAllCustomElements } = await import('@andersseen/web-components');

    defineAllCustomElements();

    expect(defined.get('and-button')).toBeDefined();
    expect(defined.get('and-navbar')).toBeDefined();
    expect(defined.get('and-badge')).toBeDefined();
    expect(defined.size).toBeGreaterThanOrEqual(3);
  });

  it('individual component imports still work', async () => {
    const { defineCustomElement: defineAndButton } =
      await import('@andersseen/web-components/components/and-button.js');
    const { defineCustomElement: defineAndNavbar } =
      await import('@andersseen/web-components/components/and-navbar.js');

    defineAndButton();
    defineAndNavbar();

    expect(defined.get('and-button')).toBeDefined();
    expect(defined.get('and-navbar')).toBeDefined();
  });
});
