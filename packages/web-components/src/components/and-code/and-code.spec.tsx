import { describe, it, expect, vi } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-code';

describe('and-code', () => {
  const getText = (root: HTMLElement) => root.shadowRoot?.textContent ?? '';

  it('renders the provided value', async () => {
    const { root } = await render(<and-code value="npm install"></and-code>);

    expect(getText(root)).toContain('npm install');
  });

  it('shows a bash prompt by default', async () => {
    const { root } = await render(<and-code value="npm install"></and-code>);

    expect(getText(root)).toContain('$');
  });

  it('shows a package-manager prompt for npm/yarn/pnpm', async () => {
    const { root: npmRoot } = await render(<and-code value="install" language="npm"></and-code>);
    expect(getText(npmRoot)).toContain('>');

    const { root: yarnRoot } = await render(<and-code value="add" language="yarn"></and-code>);
    expect(getText(yarnRoot)).toContain('>');

    const { root: pnpmRoot } = await render(<and-code value="add" language="pnpm"></and-code>);
    expect(getText(pnpmRoot)).toContain('>');
  });

  it('hides the prompt when showPrompt is false', async () => {
    const { root } = await render(<and-code value="npm install" showPrompt={false}></and-code>);

    expect(getText(root)).not.toContain('$');
  });

  it('renders multiple lines', async () => {
    const { root } = await render(<and-code value={'npm install\nnpm run build\nnpm run test'}></and-code>);

    expect(getText(root)).toContain('npm install');
    expect(getText(root)).toContain('npm run build');
    expect(getText(root)).toContain('npm run test');
  });

  it('applies the dark theme by default', async () => {
    const { root } = await render(<and-code value="cmd"></and-code>);

    expect(root.className).toContain('bg-[#0d1117]');
  });

  it('applies the light theme when set', async () => {
    const { root } = await render(<and-code value="cmd" theme="light"></and-code>);

    expect(root.className).toContain('bg-muted');
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

  it('merges custom classes', async () => {
    const { root } = await render(<and-code value="cmd" class="my-custom-class"></and-code>);

    expect(root.className).toContain('my-custom-class');
  });
});
