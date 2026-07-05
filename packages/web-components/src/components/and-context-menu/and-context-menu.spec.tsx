import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-context-menu';

describe('and-context-menu', () => {
  const items = [
    { text: 'Copy', value: 'copy' },
    { text: 'Paste', value: 'paste' },
    { text: 'Delete', value: 'delete', disabled: true },
  ];

  it('renders with a hidden panel by default', async () => {
    const { root } = await render(<and-context-menu items={items}></and-context-menu>);

    const panel = root.shadowRoot.querySelector('[role="menu"]') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.className).toContain('invisible');
    expect(panel.className).toContain('opacity-0');
  });

  it('opens panel when open prop is true', async () => {
    const { root } = await render(<and-context-menu items={items} open={true}></and-context-menu>);

    const panel = root.shadowRoot.querySelector('[role="menu"]') as HTMLElement;
    expect(panel.className).toContain('visible');
    expect(panel.className).toContain('opacity-100');
    expect(panel.getAttribute('aria-label')).toBe('Context menu');
  });

  it('uses custom menu label', async () => {
    const { root } = await render(<and-context-menu items={items} open={true} menu-label="Actions"></and-context-menu>);

    const panel = root.shadowRoot.querySelector('[role="menu"]') as HTMLElement;
    expect(panel.getAttribute('aria-label')).toBe('Actions');
  });

  it('renders menu items', async () => {
    const { root } = await render(<and-context-menu items={items} open={true}></and-context-menu>);

    const menuItems = root.shadowRoot.querySelectorAll('[role="menuitem"]');
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].textContent).toBe('Copy');
  });

  it('emits andContextMenuSelect when an item is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-context-menu items={items} open={true}></and-context-menu>,
    );

    const selectSpy = spyOnEvent('andContextMenuSelect');
    const item = root.shadowRoot.querySelector('[role="menuitem"]') as HTMLElement;
    item.click();
    await waitForChanges();

    expect(selectSpy).toHaveReceivedEventTimes(1);
    expect(selectSpy).toHaveReceivedEventDetail('copy');
  });

  it('does not emit select for disabled items', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-context-menu items={items} open={true}></and-context-menu>,
    );

    const selectSpy = spyOnEvent('andContextMenuSelect');
    const disabledItem = root.shadowRoot.querySelector('[aria-disabled="true"]') as HTMLElement;
    disabledItem.click();
    await waitForChanges();

    expect(selectSpy).not.toHaveReceivedEvent();
  });

  it('opens via contextmenu event on trigger and closes on window click', async () => {
    const { root, waitForChanges } = await render(
      <and-context-menu items={items}>
        <div slot="trigger">Right click</div>
      </and-context-menu>,
    );
    await waitForChanges();

    const trigger = root.querySelector('[slot="trigger"]') as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    await waitForChanges();

    let panel = root.shadowRoot.querySelector('[role="menu"]') as HTMLElement;
    expect(panel.className).toContain('visible');
    expect(panel.getAttribute('data-state')).toBe('open');

    window.dispatchEvent(new MouseEvent('click'));
    await waitForChanges();

    panel = root.shadowRoot.querySelector('[role="menu"]') as HTMLElement;
    expect(panel.className).toContain('invisible');
  });

  it('closes on Escape key after opening', async () => {
    const { root, waitForChanges } = await render(
      <and-context-menu items={items}>
        <div slot="trigger">Right click</div>
      </and-context-menu>,
    );
    await waitForChanges();

    const trigger = root.querySelector('[slot="trigger"]') as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    await waitForChanges();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await waitForChanges();

    const panel = root.shadowRoot.querySelector('[role="menu"]') as HTMLElement;
    expect(panel.className).toContain('invisible');
  });
});
