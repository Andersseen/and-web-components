import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-accordion';

describe('and-accordion', () => {
  it('renders with default props', async () => {
    const { root } = await render(
      <and-accordion>
        <and-accordion-item value="item-1">
          <and-accordion-trigger>Trigger 1</and-accordion-trigger>
          <and-accordion-content>Content 1</and-accordion-content>
        </and-accordion-item>
      </and-accordion>,
    );

    expect(root).toBeTruthy();
    expect(root.getAttribute('data-orientation')).toBe('vertical');
  });

  it('contains trigger and content children', async () => {
    const { root } = await render(
      <and-accordion>
        <and-accordion-item value="item-1">
          <and-accordion-trigger>Trigger 1</and-accordion-trigger>
          <and-accordion-content>Content 1</and-accordion-content>
        </and-accordion-item>
      </and-accordion>,
    );

    expect(root.querySelector('and-accordion-trigger')).toBeTruthy();
    expect(root.querySelector('and-accordion-content')).toBeTruthy();
  });
});
