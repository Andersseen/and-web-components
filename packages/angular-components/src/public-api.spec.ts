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
});
