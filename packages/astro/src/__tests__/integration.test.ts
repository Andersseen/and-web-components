import { describe, it, expect, vi } from 'vitest';
import andersseen from '../integration';

describe('@andersseen/astro integration', () => {
  it('injects the full registration script by default', () => {
    const injectScript = vi.fn();
    const integration = andersseen();

    integration.hooks['astro:config:setup']!({ injectScript } as { injectScript: typeof injectScript });

    expect(injectScript).toHaveBeenCalledTimes(2);
    expect(injectScript).toHaveBeenNthCalledWith(
      1,
      'page',
      expect.stringContaining("import { defineAllCustomElements } from '@andersseen/web-components';"),
    );
    expect(injectScript).toHaveBeenNthCalledWith(1, 'page', expect.stringContaining('defineAllCustomElements();'));
    expect(injectScript).toHaveBeenNthCalledWith(
      2,
      'page',
      expect.stringContaining("import { registerAllIcons } from '@andersseen/icon';"),
    );
  });

  it('injects only the requested components when given a list', () => {
    const injectScript = vi.fn();
    const integration = andersseen({ components: ['and-button', 'and-navbar'] });

    integration.hooks['astro:config:setup']!({ injectScript } as { injectScript: typeof injectScript });

    expect(injectScript).toHaveBeenCalledTimes(2);
    expect(injectScript).toHaveBeenNthCalledWith(
      1,
      'page',
      expect.stringContaining(
        "import { defineCustomElement as defineAndButton } from '@andersseen/web-components/components/and-button.js';",
      ),
    );
    expect(injectScript).toHaveBeenNthCalledWith(1, 'page', expect.stringContaining('defineAndButton();'));
    expect(injectScript).toHaveBeenNthCalledWith(1, 'page', expect.stringContaining('defineAndNavbar();'));
  });

  it('can skip icon registration', () => {
    const injectScript = vi.fn();
    const integration = andersseen({ icons: false });

    integration.hooks['astro:config:setup']!({ injectScript } as { injectScript: typeof injectScript });

    expect(injectScript).toHaveBeenCalledTimes(1);
    expect(injectScript).not.toHaveBeenCalledWith('page', expect.stringContaining('registerAllIcons'));
  });
});
