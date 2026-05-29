import { describe, it, expect, vi } from 'vitest';
import { createModalMachine } from '../modal-v2';

describe('createModalMachine', () => {
  it('starts closed by default', () => {
    const modal = createModalMachine();
    expect(modal.state.value).toBe('closed');
    expect(modal.queries.isOpen()).toBe(false);
  });

  it('can start open', () => {
    const modal = createModalMachine({ defaultOpen: true });
    expect(modal.state.value).toBe('opening');
  });

  it('opens on action.open()', async () => {
    const modal = createModalMachine();
    modal.actions.open();

    // Should transition through opening → open
    await new Promise(r => setTimeout(r, 20));
    expect(modal.state.value).toBe('open');
    expect(modal.queries.isOpen()).toBe(true);
  });

  it('calls onOpenChange callback', async () => {
    const onOpenChange = vi.fn();
    const modal = createModalMachine({ onOpenChange });

    modal.actions.open();
    await new Promise(r => setTimeout(r, 20));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    modal.actions.close();
    await new Promise(r => setTimeout(r, 20));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape', async () => {
    const modal = createModalMachine({ closeOnEscape: true });
    modal.actions.open();
    await new Promise(r => setTimeout(r, 20));

    modal.handleKeyDown({ key: 'Escape' } as KeyboardEvent);
    await new Promise(r => setTimeout(r, 20));
    expect(modal.state.value).toBe('closed');
  });

  it('does not close on Escape if disabled', async () => {
    const modal = createModalMachine({ closeOnEscape: false });
    modal.actions.open();
    await new Promise(r => setTimeout(r, 20));

    modal.handleKeyDown({ key: 'Escape' } as KeyboardEvent);
    await new Promise(r => setTimeout(r, 20));
    expect(modal.state.value).toBe('open');
  });

  it('toggles open/close', async () => {
    const modal = createModalMachine();

    modal.actions.toggle();
    await new Promise(r => setTimeout(r, 20));
    expect(modal.state.value).toBe('open');

    modal.actions.toggle();
    await new Promise(r => setTimeout(r, 20));
    expect(modal.state.value).toBe('closed');
  });

  it('provides correct ARIA props when open', async () => {
    const modal = createModalMachine({ label: 'Custom Dialog' });
    modal.actions.open();
    await new Promise(r => setTimeout(r, 20));

    const overlayProps = modal.getOverlayProps();
    expect(overlayProps['data-state']).toBe('open');
    expect(overlayProps['aria-hidden']).toBe(false);

    const contentProps = modal.getContentProps();
    expect(contentProps.role).toBe('dialog');
    expect(contentProps['aria-modal']).toBe(true);
    expect(contentProps['aria-label']).toBe('Custom Dialog');
  });

  it('provides correct ARIA props when closed', () => {
    const modal = createModalMachine();

    const overlayProps = modal.getOverlayProps();
    expect(overlayProps['data-state']).toBe('closed');
    expect(overlayProps['aria-hidden']).toBe(true);

    const contentProps = modal.getContentProps();
    expect(contentProps['aria-hidden']).toBe(true);
  });

  it('subscribes to state changes', async () => {
    const modal = createModalMachine();
    const subscriber = vi.fn();

    const unsubscribe = modal.subscribe(subscriber);
    modal.actions.open();
    await new Promise(r => setTimeout(r, 50));

    expect(subscriber).toHaveBeenCalled();
    expect(subscriber.mock.calls[subscriber.mock.calls.length - 1][0].value).toBe('open');

    unsubscribe();
  });
});
