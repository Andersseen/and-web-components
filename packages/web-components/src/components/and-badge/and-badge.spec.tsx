import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-badge';

describe('and-badge', () => {
  it('renders with default variant', async () => {
    const { root } = await render(<and-badge>Default</and-badge>);

    expect(root.className).toContain('bg-primary');
    expect(root.className).toContain('text-primary-foreground');
    expect(root.textContent).toContain('Default');
  });

  it('has no default role, so static labels are not announced as live regions', async () => {
    const { root } = await render(<and-badge>Default</and-badge>);

    expect(root.getAttribute('role')).toBeNull();
  });

  it('applies secondary variant', async () => {
    const { root } = await render(<and-badge variant="secondary">Secondary</and-badge>);

    expect(root.className).toContain('bg-secondary');
    expect(root.className).toContain('text-secondary-foreground');
  });

  it('applies destructive variant', async () => {
    const { root } = await render(<and-badge variant="destructive">Destructive</and-badge>);

    expect(root.className).toContain('bg-destructive');
    expect(root.className).toContain('text-destructive-foreground');
  });

  it('applies outline variant', async () => {
    const { root } = await render(<and-badge variant="outline">Outline</and-badge>);

    expect(root.className).toContain('border-border');
    expect(root.className).toContain('text-foreground');
  });

  it('merges custom classes', async () => {
    const { root } = await render(<and-badge class="my-custom-class">Custom</and-badge>);

    expect(root.className).toContain('my-custom-class');
  });
});
