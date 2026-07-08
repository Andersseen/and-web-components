import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-input';

describe('and-input', () => {
  it('renders an input element', async () => {
    const { root } = await render(<and-input placeholder="Type here"></and-input>);

    const input = root.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('placeholder')).toBe('Type here');
  });

  it('emits andInputChange on input event', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-input></and-input>);

    const inputSpy = spyOnEvent('andInputChange');
    const input = root.querySelector('input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    await waitForChanges();

    expect(inputSpy).toHaveReceivedEventTimes(1);
    expect(inputSpy).toHaveReceivedEventDetail('hello');
  });

  it('reflects disabled state', async () => {
    const { root } = await render(<and-input disabled></and-input>);

    const input = root.querySelector('input');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });

  it('renders its <input> in light DOM (not Shadow DOM) so a wrapping <form> can see it', async () => {
    const { root } = await render(<and-input name="email" value="a@b.com"></and-input>);
    expect(root.shadowRoot).toBeNull();

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    const input = root.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('name')).toBe('email');
    expect(input.getAttribute('value') ?? input.value).toBe('a@b.com');
    // A real descendant of <form> in the DOM tree — the actual condition FormData relies on.
    expect(form.contains(input)).toBe(true);

    form.remove();
  });
});
