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

  it('restores its default value when the wrapping <form> is reset', async () => {
    const { root, waitForChanges } = await render(<and-input name="email" value="a@b.com"></and-input>);

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    const input = root.querySelector('input') as HTMLInputElement;
    input.value = 'changed@b.com';
    input.dispatchEvent(new Event('input'));
    await waitForChanges();
    expect((root as HTMLAndInputElement).value).toBe('changed@b.com');

    form.dispatchEvent(new Event('reset'));
    await waitForChanges();

    expect((root as HTMLAndInputElement).value).toBe('a@b.com');

    form.remove();
  });

  it('stops listening for reset after being removed from the DOM', async () => {
    const { root, waitForChanges } = await render(<and-input name="email" value="a@b.com"></and-input>);

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    root.remove();

    const input = document.createElement('input');
    form.appendChild(input);
    input.value = 'noop';
    // Dispatching reset after disconnection must not throw (listener removed).
    expect(() => form.dispatchEvent(new Event('reset'))).not.toThrow();
    await waitForChanges();

    form.remove();
  });
});

describe('and-input — ARIA serialization (regression)', () => {
  it('emits aria-required as "true"/"false", never as an empty attribute', async () => {
    // A boolean `true` serialises to aria-required="", which is not a valid
    // ARIA boolean and is read as the default (false) by screen readers.
    const { root } = await render(<and-input label="Email" required></and-input>);

    const input = root.querySelector('input');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('omits empty aria-describedby instead of rendering describedby=""', async () => {
    const { root } = await render(<and-input label="Email"></and-input>);

    const input = root.querySelector('input');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('keeps aria-describedby when one is provided', async () => {
    const { root } = await render(<and-input label="Email" describedBy="err-1"></and-input>);

    expect(root.querySelector('input').getAttribute('aria-describedby')).toBe('err-1');
  });
});
