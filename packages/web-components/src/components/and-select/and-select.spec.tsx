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

  it('mirrors its name into a named native select', async () => {
    const { root, waitForChanges } = await render(
      <and-select options={options} name="number" value="two"></and-select>,
    );
    await waitForChanges();

    const mirror = root.querySelector('select') as HTMLSelectElement;
    expect(mirror.getAttribute('name')).toBe('number');
    expect(mirror.value).toBe('two');
  });

  it('renders no mirror control when neither name nor required is set', async () => {
    const { root } = await render(<and-select options={options}></and-select>);

    expect(root.querySelector('select')).toBeNull();
  });

  it('renders a required mirror select even without a name', async () => {
    const { root } = await render(<and-select options={options} required></and-select>);

    const mirror = root.querySelector('select') as HTMLSelectElement;
    expect(mirror).toBeTruthy();
    expect(mirror.hasAttribute('required')).toBe(true);
  });

  it('disables the mirror select so a disabled select is excluded from FormData', async () => {
    const { root } = await render(<and-select options={options} name="number" value="two" disabled></and-select>);

    const mirror = root.querySelector('select') as HTMLSelectElement;
    expect(mirror.hasAttribute('disabled')).toBe(true);
  });

  it('keeps the mirror select enabled when the component is not disabled', async () => {
    const { root } = await render(<and-select options={options} name="number" value="two"></and-select>);

    const mirror = root.querySelector('select') as HTMLSelectElement;
    expect(mirror.hasAttribute('disabled')).toBe(false);
  });

  it('mirror select is out of the tab order and not exposed as a duplicate accessible control', async () => {
    const { root } = await render(<and-select options={options} name="number" label="Number" required></and-select>);

    const mirror = root.querySelector('select') as HTMLSelectElement;
    expect(mirror.tabIndex).toBe(-1);
    expect(mirror.getAttribute('aria-label')).toBe('Number');
    expect(mirror.classList.contains('sr-only')).toBe(true);
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
    const mirror = root.querySelector('select') as HTMLSelectElement;
    expect(mirror.value).toBe('one');

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
