import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-input';

describe('and-input', () => {
  it('renders an input element', async () => {
    const { root } = await render(<and-input placeholder="Type here"></and-input>);

    const input = root.shadowRoot.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('placeholder')).toBe('Type here');
  });

  it('emits andInput on input event', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-input></and-input>);

    const inputSpy = spyOnEvent('andInput');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    await waitForChanges();

    expect(inputSpy).toHaveReceivedEventTimes(1);
    expect(inputSpy).toHaveReceivedEventDetail('hello');
  });

  it('reflects disabled state', async () => {
    const { root } = await render(<and-input disabled></and-input>);

    const input = root.shadowRoot.querySelector('input');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });
});
