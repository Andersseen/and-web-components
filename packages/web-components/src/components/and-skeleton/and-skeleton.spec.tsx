import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-skeleton';

describe('and-skeleton', () => {
  it('renders with default variant and dimensions', async () => {
    const { root } = await render(<and-skeleton></and-skeleton>);

    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(root.getAttribute('aria-label')).toBe('Loading');
    expect(root.className).toContain('animate-pulse');
    expect(root.className).toContain('bg-muted');
    expect(root.className).toContain('rounded-md');
  });

  it('applies variant, width and height', async () => {
    const { root } = await render(<and-skeleton variant="circle" width="48px" height="48px"></and-skeleton>);

    expect(root.className).toContain('rounded-full');
    expect(root.getAttribute('style')).toContain('width: 48px');
    expect(root.getAttribute('style')).toContain('height: 48px');
  });
});
