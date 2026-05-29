import { newSpecPage } from '@stencil/core/testing';
import { AndSelect } from '../and-select';

describe('and-select', () => {
  const options = [
    { text: 'Apple', value: 'apple' },
    { text: 'Banana', value: 'banana' },
    { text: 'Cherry', value: 'cherry' },
  ];

  it('renders as closed combobox with correct aria', async () => {
    const page = await newSpecPage({
      components: [AndSelect],
      html: `<and-select></and-select>`,
    });

    (page.root as any).options = options;
    await page.waitForChanges();

    const trigger = page.root.shadowRoot.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('opens menu on click and highlights selected option', async () => {
    const page = await newSpecPage({
      components: [AndSelect],
      html: `<and-select></and-select>`,
    });

    (page.root as any).options = options;
    (page.root as any).value = 'banana';
    await page.waitForChanges();

    const trigger = page.root.shadowRoot.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const listbox = page.root.shadowRoot.querySelector('[role="listbox"]');
    expect(listbox.classList.contains('select-menu--open')).toBe(true);

    const highlighted = page.root.shadowRoot.querySelector('.select-option--highlighted');
    expect(highlighted).toBeTruthy();
    expect(highlighted.getAttribute('aria-selected')).toBe('true'); // banana is selected
  });

  it('navigates with ArrowDown and selects with Enter', async () => {
    const page = await newSpecPage({
      components: [AndSelect],
      html: `<and-select></and-select>`,
    });

    (page.root as any).options = options;
    await page.waitForChanges();

    const trigger = page.root.shadowRoot.querySelector('[role="combobox"]') as HTMLButtonElement;

    // Open with ArrowDown
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // ArrowDown again should move to next
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();

    const highlighted = page.root.shadowRoot.querySelector('.select-option--highlighted');
    expect(highlighted).toBeTruthy();

    // Enter to select
    const changeListener = jest.fn();
    page.root.addEventListener('andSelectChange', changeListener);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it('closes with Escape and emits blur', async () => {
    const page = await newSpecPage({
      components: [AndSelect],
      html: `<and-select></and-select>`,
    });

    (page.root as any).options = options;
    await page.waitForChanges();

    const trigger = page.root.shadowRoot.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    const blurListener = jest.fn();
    page.root.addEventListener('andBlur', blurListener);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await page.waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(blurListener).toHaveBeenCalledTimes(1);
  });
});
