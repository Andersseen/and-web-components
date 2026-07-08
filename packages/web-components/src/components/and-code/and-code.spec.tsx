import { describe, it, expect, vi } from 'vitest';
import { render, h } from '@stencil/vitest';
import { registerIcons, COPY } from '@andersseen/icon';
import './and-code';

registerIcons({ copy: COPY });

describe('and-code', () => {
  const getText = (root: HTMLElement) => root.shadowRoot?.textContent ?? '';

  it('renders the provided value', async () => {
    const { root } = await render(<and-code value="npm install"></and-code>);

    expect(getText(root)).toContain('npm install');
  });

  it('hides the prompt by default (opt-in via showPrompt)', async () => {
    const { root } = await render(<and-code value="npm install"></and-code>);

    expect(getText(root)).not.toContain('$');
  });

  it('shows the $ prompt when showPrompt is true', async () => {
    const { root } = await render(<and-code value="npm install" showPrompt={true}></and-code>);

    expect(getText(root)).toContain('$');
  });

  it('supports a custom prompt character', async () => {
    const { root } = await render(<and-code value="install" prompt=">" showPrompt={true}></and-code>);

    expect(getText(root)).toContain('>');
  });

  it('renders multiple lines', async () => {
    const { root } = await render(<and-code value={'npm install\nnpm run build\nnpm run test'}></and-code>);

    expect(getText(root)).toContain('npm install');
    expect(getText(root)).toContain('npm run build');
    expect(getText(root)).toContain('npm run test');
  });

  it('uses semantic design tokens so it follows the global dark/light theme', async () => {
    const { root } = await render(<and-code value="cmd"></and-code>);

    expect(root.className).toContain('bg-muted');
    expect(root.className).toContain('text-foreground');
    expect(root.className).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it('emits andCodeCopy event when copy button is clicked', async () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
      configurable: true,
    });
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    const { root, waitForChanges, spyOnEvent } = await render(<and-code value="npm install"></and-code>);
    const copySpy = spyOnEvent('andCodeCopy');

    const button = root.shadowRoot.querySelector('button');
    button?.click();
    await waitForChanges();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npm install');
    expect(copySpy).toHaveReceivedEventTimes(1);
  });

  it('renders a visible copy icon once icons are registered', async () => {
    const { root, waitForChanges } = await render(<and-code value="npm install"></and-code>);
    await waitForChanges();

    const icon = root.shadowRoot?.querySelector('and-icon[name="copy"]');
    expect(icon).toBeTruthy();

    const svg = icon?.shadowRoot?.querySelector('svg');
    expect(svg?.innerHTML.trim()).not.toBe('');
  });

  it('merges custom classes', async () => {
    const { root } = await render(<and-code value="cmd" class="my-custom-class"></and-code>);

    expect(root.className).toContain('my-custom-class');
  });
});
