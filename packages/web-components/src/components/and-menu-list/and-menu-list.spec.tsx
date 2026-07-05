import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-menu-list';

describe('and-menu-list', () => {
  const items = [
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'delete', label: 'Delete', disabled: true },
  ];

  it('renders menu with default aria-label', async () => {
    const { root } = await render(<and-menu-list items={items}></and-menu-list>);

    const menu = root.shadowRoot.querySelector('ul');
    expect(menu).toBeTruthy();
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-label')).toBe('Menu');
  });

  it('uses custom aria label', async () => {
    const { root } = await render(<and-menu-list items={items} aria-menu-label="Options"></and-menu-list>);

    const menu = root.shadowRoot.querySelector('ul');
    expect(menu.getAttribute('aria-label')).toBe('Options');
  });

  it('renders items as menuitem rows', async () => {
    const { root } = await render(<and-menu-list items={items}></and-menu-list>);

    const menuItems = root.shadowRoot.querySelectorAll('[role="menuitem"]');
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].textContent).toBe('Edit');
  });

  it('emits andMenuItemSelect when an item is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-menu-list items={items}></and-menu-list>);

    const selectSpy = spyOnEvent('andMenuItemSelect');
    const item = root.shadowRoot.querySelector('[role="menuitem"]') as HTMLElement;
    item.click();
    await waitForChanges();

    expect(selectSpy).toHaveReceivedEventTimes(1);
    expect(selectSpy).toHaveReceivedEventDetail('edit');
  });

  it('does not emit select for disabled items', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-menu-list items={items}></and-menu-list>);

    const selectSpy = spyOnEvent('andMenuItemSelect');
    const disabledItem = root.shadowRoot.querySelectorAll('[role="menuitem"]')[2] as HTMLElement;
    disabledItem.click();
    await waitForChanges();

    expect(selectSpy).not.toHaveReceivedEvent();
  });

  it('falls back to slot when no items are provided', async () => {
    const { root } = await render(<and-menu-list>Slotted item</and-menu-list>);

    expect(root.textContent).toContain('Slotted item');
  });
});
