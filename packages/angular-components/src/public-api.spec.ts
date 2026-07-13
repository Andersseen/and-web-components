import { describe, expect, it } from 'vitest';

import { DIRECTIVES } from './public-api';

describe('@andersseen/angular-components public API', () => {
  it('exports a non-empty DIRECTIVES array of generated Angular wrapper components', () => {
    expect(Array.isArray(DIRECTIVES)).toBe(true);
    expect(DIRECTIVES.length).toBeGreaterThan(0);
  });

  it('every directive is a defined class', () => {
    for (const directive of DIRECTIVES) {
      expect(typeof directive).toBe('function');
      expect(directive.name).toBeTruthy();
    }
  });

  it('registers the underlying custom elements (ProxyCmp defines them on import)', () => {
    // ProxyCmp() runs defineCustomElementFn() as a class decorator, i.e. at import
    // time (see stencil-generated/angular-component-lib/utils.ts). In a DOM
    // environment that means every wrapped tag is already defined by the time this
    // module has finished loading, without needing Angular's TestBed/DI at all.
    expect(customElements.get('and-button')).toBeDefined();
    expect(customElements.get('and-modal')).toBeDefined();
    expect(customElements.get('and-accordion')).toBeDefined();
  });

  it('a registered element can actually be constructed by the DOM', () => {
    const button = document.createElement('and-button');
    expect(button).toBeInstanceOf(HTMLElement);
    expect(button.tagName.toLowerCase()).toBe('and-button');
  });
});
