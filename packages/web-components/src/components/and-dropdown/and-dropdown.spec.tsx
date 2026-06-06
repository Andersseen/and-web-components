import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-dropdown';

describe('and-dropdown', () => {
  it('renders trigger button with label', async () => {
    const { root } = await render(<and-dropdown label="Menu"></and-dropdown>);

    const button = root.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Menu');
  });

  it('renders closed menu by default', async () => {
    const { root } = await render(<and-dropdown></and-dropdown>);

    const menu = root.shadowRoot.querySelector('.and-dropdown-menu');
    expect(menu.className).toContain('invisible');
  });
});
