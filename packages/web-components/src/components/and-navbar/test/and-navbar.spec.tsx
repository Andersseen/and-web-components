import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import '../and-navbar';

describe('and-navbar', () => {
  it('renders', async () => {
    const { root } = await render(<and-navbar></and-navbar>);
    expect(root).toBeTruthy();
  });
});
