import { describe, expect, it } from 'vitest';

import * as VueComponents from '../src/index';

describe('@andersseen/vue-components public API', () => {
  it('exports a non-empty set of wrapped components', () => {
    const exportNames = Object.keys(VueComponents);
    expect(exportNames.length).toBeGreaterThan(0);
  });

  it('every export is a defined Vue component', () => {
    for (const [name, value] of Object.entries(VueComponents)) {
      expect(value, `${name} should be defined`).toBeDefined();
    }
  });
});
