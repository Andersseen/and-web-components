import { describe, expect, it } from 'vitest';

import * as ReactComponents from '../src/index';

describe('@andersseen/react-components public API', () => {
  it('exports a non-empty set of wrapped components', () => {
    const exportNames = Object.keys(ReactComponents);
    expect(exportNames.length).toBeGreaterThan(0);
  });

  it('every export is a defined React component', () => {
    for (const [name, value] of Object.entries(ReactComponents)) {
      expect(value, `${name} should be defined`).toBeDefined();
    }
  });
});
