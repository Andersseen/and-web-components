import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-icon';

describe('and-icon', () => {
  it('renders host with correct attributes', async () => {
    const { root } = await render(<and-icon name="close" size="16" stroke-width="1.5"></and-icon>);

    expect(root).toBeTruthy();
    expect(root.getAttribute('name')).toBe('close');
    expect(root.getAttribute('size')).toBe('16');
    expect(root.getAttribute('stroke-width')).toBe('1.5');
    expect(root.getAttribute('role')).toBe('img');
    expect(root.getAttribute('aria-hidden')).toBe('true');
  });
});
