import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import '../and-select';

describe('and-select', () => {
  const options = [
    { text: 'Apple', value: 'apple' },
    { text: 'Banana', value: 'banana' },
    { text: 'Cherry', value: 'cherry' },
  ];

  it('renders as closed combobox with correct aria', async () => {
    const { root, waitForChanges } = await render(<and-select options={options}></and-select>);
    await waitForChanges();

    const trigger = root.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('opens menu on click and highlights selected option', async () => {
    const { root, waitForChanges } = await render(<and-select options={options} value="banana"></and-select>);
    await waitForChanges();

    const trigger = root.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const listbox = root.querySelector('[role="listbox"]');
    expect(listbox.classList.contains('select-menu--open')).toBe(true);

    const highlighted = root.querySelector('.select-option--highlighted');
    expect(highlighted).toBeTruthy();
    expect(highlighted.getAttribute('aria-selected')).toBe('true'); // banana is selected
  });

  it('navigates with ArrowDown and selects with Enter', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-select options={options}></and-select>);
    await waitForChanges();

    const trigger = root.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.focus();

    // Open with ArrowDown
    trigger.dispatchEvent(new KeyboardEvent('keyDown', { key: 'ArrowDown', bubbles: true }));
    await new Promise(r => setTimeout(r, 0));
    await waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // ArrowDown again should move to next
    trigger.dispatchEvent(new KeyboardEvent('keyDown', { key: 'ArrowDown', bubbles: true }));
    await waitForChanges();

    const highlighted = root.querySelector('.select-option--highlighted');
    expect(highlighted).toBeTruthy();

    // Enter to select
    const changeSpy = spyOnEvent('andSelectChange');
    trigger.dispatchEvent(new KeyboardEvent('keyDown', { key: 'Enter', bubbles: true }));
    await waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(changeSpy).toHaveReceivedEventTimes(1);
  });

  it('closes with Escape and emits select blur', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-select options={options}></and-select>);
    await waitForChanges();

    const trigger = root.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.focus();
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    const blurSpy = spyOnEvent('andSelectBlur');
    trigger.dispatchEvent(new KeyboardEvent('keyDown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 0));
    await waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(blurSpy).toHaveReceivedEventTimes(1);
  });

  it('renders its hidden mirror input in light DOM (not Shadow DOM) so a wrapping <form> can see it', async () => {
    const { root, waitForChanges } = await render(
      <and-select options={options} name="fruit" value="banana"></and-select>,
    );
    expect(root.shadowRoot).toBeNull();

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);
    await waitForChanges();

    const hidden = root.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.getAttribute('name')).toBe('fruit');
    expect(hidden.getAttribute('value') ?? hidden.value).toBe('banana');
    // A real descendant of <form> in the DOM tree — the actual condition FormData relies on.
    expect(form.contains(hidden)).toBe(true);

    form.remove();
  });
});
