import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-tabs';

describe('and-tabs', () => {
  it('renders with default value', async () => {
    const { root } = await render(
      <and-tabs default-value="tab-1">
        <and-tabs-trigger value="tab-1">Tab 1</and-tabs-trigger>
        <and-tabs-trigger value="tab-2">Tab 2</and-tabs-trigger>
        <and-tabs-content value="tab-1">Content 1</and-tabs-content>
        <and-tabs-content value="tab-2">Content 2</and-tabs-content>
      </and-tabs>,
    );

    expect(root).toBeTruthy();
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
  });
});
