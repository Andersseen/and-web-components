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
});
