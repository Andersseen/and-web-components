import { describe, expect, it } from 'vitest';
import { h, render } from '@stencil/vitest';
import './and-select';

describe('and-select', () => {
  const options = [
    { value: 'one', text: 'One' },
    { value: 'two', text: 'Two' },
  ];

  it('renders an accessible combobox in light DOM', async () => {
    const { root } = await render(<and-select options={options} label="Number"></and-select>);

    expect(root.shadowRoot).toBeNull();
    const trigger = root.querySelector('[role="combobox"]');
    expect(trigger).toBeTruthy();
    expect(trigger?.getAttribute('aria-label')).toBe('Number');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('mirrors its value into a named form input', async () => {
    const { root } = await render(<and-select options={options} name="number" value="two"></and-select>);

    const input = root.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input.name).toBe('number');
    expect(input.value).toBe('two');
  });

  it('restores its default value when the wrapping <form> is reset', async () => {
    const { root, waitForChanges } = await render(
      <and-select options={options} name="number" value="one"></and-select>,
    );

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    (root as HTMLAndSelectElement).value = 'two';
    await waitForChanges();
    expect((root as HTMLAndSelectElement).value).toBe('two');

    form.dispatchEvent(new Event('reset'));
    await waitForChanges();

    expect((root as HTMLAndSelectElement).value).toBe('one');
    const input = root.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input.value).toBe('one');

    form.remove();
  });

  it('resets to no selection when the default value was empty', async () => {
    const { root, waitForChanges } = await render(<and-select options={options} name="number"></and-select>);

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    (root as HTMLAndSelectElement).value = 'two';
    await waitForChanges();

    form.dispatchEvent(new Event('reset'));
    await waitForChanges();

    expect((root as HTMLAndSelectElement).value).toBe('');

    form.remove();
  });

  it('stops listening for reset after being removed from the DOM', async () => {
    const { root, waitForChanges } = await render(
      <and-select options={options} name="number" value="one"></and-select>,
    );

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    root.remove();

    // Dispatching reset after disconnection must not throw (listener removed).
    expect(() => form.dispatchEvent(new Event('reset'))).not.toThrow();
    await waitForChanges();

    form.remove();
  });
});
