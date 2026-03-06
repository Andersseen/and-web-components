import { describe, it, expect, vi } from 'vitest';
import { createModal } from '../modal';

describe('createModal', () => {
  it('returns expected default state and methods', () => {
    const modal = createModal();
    expect(modal.state.isOpen).toBe(false);
    expect(modal.state.disabled).toBe(false);
    expect(modal.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const modal = createModal({ defaultOpen: true, disabled: true });
    expect(modal.state.isOpen).toBe(true);
    expect(modal.state.disabled).toBe(true);
  });

  it('can open and close', () => {
    const modal = createModal();
    modal.actions.open();
    expect(modal.state.isOpen).toBe(true);
    modal.actions.close();
    expect(modal.state.isOpen).toBe(false);
  });

  it('can toggle', () => {
    const modal = createModal();
    modal.actions.toggle();
    expect(modal.state.isOpen).toBe(true);
    modal.actions.toggle();
    expect(modal.state.isOpen).toBe(false);
  });

  it('calls onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    const modal = createModal({ onOpenChange });
    modal.actions.open();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    modal.actions.close();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does nothing when disabled', () => {
    const modal = createModal({ disabled: true });
    modal.actions.open();
    expect(modal.state.isOpen).toBe(false);
    modal.actions.toggle();
    expect(modal.state.isOpen).toBe(false);
  });

  it('can change disabled state and closes if disabled while open', () => {
    const modal = createModal();
    modal.actions.open();
    expect(modal.state.isOpen).toBe(true);

    modal.actions.setDisabled(true);
    expect(modal.state.disabled).toBe(true);
    expect(modal.state.isOpen).toBe(false);
  });

  it('provides correct overlay props', () => {
    const modal = createModal();
    let props = modal.getOverlayProps();
    expect(props['data-state']).toBe('closed');
    expect(props['aria-hidden']).toBe(true);

    modal.actions.open();
    props = modal.getOverlayProps();
    expect(props['data-state']).toBe('open');
    expect(props['aria-hidden']).toBe(false);
  });

  it('provides correct content props', () => {
    const modal = createModal();
    let props = modal.getContentProps();
    expect(props.role).toBe('dialog');
    expect(props['aria-modal']).toBe(true);
    expect(props['aria-hidden']).toBe(true);
    expect(props['data-state']).toBe('closed');
    expect(props.tabindex).toBe(-1);

    modal.actions.open();
    props = modal.getContentProps();
    expect(props['aria-hidden']).toBe(false);
    expect(props['data-state']).toBe('open');
  });

  it('provides correct close button props', () => {
    const modal = createModal();
    const props = modal.getCloseButtonProps();
    expect(props['aria-label']).toBe('Close');
    expect(props.type).toBe('button');
  });

  it('handles Escape key to close by default', () => {
    const modal = createModal();
    modal.actions.open();
    const preventDefault = vi.fn();
    modal.handleKeyDown({ key: 'Escape', preventDefault } as any);
    expect(preventDefault).toHaveBeenCalled();
    expect(modal.state.isOpen).toBe(false);
  });

  it('does not close on Escape if configured false', () => {
    const modal = createModal({ closeOnEscape: false });
    modal.actions.open();
    const preventDefault = vi.fn();
    modal.handleKeyDown({ key: 'Escape', preventDefault } as any);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(modal.state.isOpen).toBe(true);
  });

  it('handles overlay click to close by default', () => {
    const modal = createModal();
    modal.actions.open();
    modal.handleOverlayClick();
    expect(modal.state.isOpen).toBe(false);
  });

  it('does not close on overlay click if configured false', () => {
    const modal = createModal({ closeOnOverlayClick: false });
    modal.actions.open();
    modal.handleOverlayClick();
    expect(modal.state.isOpen).toBe(true);
  });
});
