import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-card';

describe('and-card', () => {
  it('renders with default variant', async () => {
    const { root } = await render(<and-card>Card content</and-card>);

    expect(root.className).toContain('rounded-lg');
    expect(root.className).toContain('border');
    expect(root.className).toContain('bg-card');
    expect(root.textContent).toContain('Card content');
  });

  it('applies destructive variant', async () => {
    const { root } = await render(<and-card variant="destructive">Alert</and-card>);

    expect(root.className).toContain('text-destructive');
  });

  it('applies elevated variant', async () => {
    const { root } = await render(<and-card variant="elevated">Raised</and-card>);

    expect(root.className).toContain('shadow-lg');
  });

  it('applies outline variant', async () => {
    const { root } = await render(<and-card variant="outline">Outlined</and-card>);

    expect(root.className).toContain('shadow-none');
  });

  it('applies ghost variant', async () => {
    const { root } = await render(<and-card variant="ghost">Ghost</and-card>);

    expect(root.className).toContain('border-transparent');
    expect(root.className).toContain('shadow-none');
  });

  it('adds padding when padded is true', async () => {
    const { root } = await render(<and-card padded>Padded</and-card>);

    expect(root.className).toContain('p-4');
  });

  it('merges custom classes', async () => {
    const { root } = await render(<and-card class="my-card">Custom</and-card>);

    expect(root.className).toContain('my-card');
  });
});
