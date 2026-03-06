import { describe, it, expect, vi } from 'vitest';
import { createDrawer } from '../drawer';

describe('createDrawer', () => {
  it('returns expected default state and methods', () => {
    const drawer = createDrawer();
    expect(drawer.state.isOpen).toBe(false);
    expect(drawer.state.placement).toBe('left');
    expect(drawer.state.disabled).toBe(false);
    expect(drawer.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const drawer = createDrawer({ defaultOpen: true, placement: 'right', disabled: true });
    expect(drawer.state.isOpen).toBe(true);
    expect(drawer.state.placement).toBe('right');
    expect(drawer.state.disabled).toBe(true);
  });

  it('can open and close', () => {
    const drawer = createDrawer();
    drawer.actions.open();
    expect(drawer.state.isOpen).toBe(true);
    drawer.actions.close();
    expect(drawer.state.isOpen).toBe(false);
  });

  it('can toggle', () => {
    const drawer = createDrawer();
    drawer.actions.toggle();
    expect(drawer.state.isOpen).toBe(true);
    drawer.actions.toggle();
    expect(drawer.state.isOpen).toBe(false);
  });

  it('calls onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    const drawer = createDrawer({ onOpenChange });
    drawer.actions.open();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    drawer.actions.close();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('can set placement', () => {
    const drawer = createDrawer();
    drawer.actions.setPlacement('top');
    expect(drawer.state.placement).toBe('top');
  });

  it('does nothing when disabled', () => {
    const drawer = createDrawer({ disabled: true });
    drawer.actions.open();
    expect(drawer.state.isOpen).toBe(false);
    drawer.actions.toggle();
    expect(drawer.state.isOpen).toBe(false);
  });

  it('can change disabled state and closes if disabled while open', () => {
    const drawer = createDrawer();
    drawer.actions.open();
    expect(drawer.state.isOpen).toBe(true);

    drawer.actions.setDisabled(true);
    expect(drawer.state.disabled).toBe(true);
    expect(drawer.state.isOpen).toBe(false);
  });

  it('provides correct overlay props', () => {
    const drawer = createDrawer();
    let props = drawer.getOverlayProps();
    expect(props['data-state']).toBe('closed');
    expect(props['aria-hidden']).toBe(true);

    drawer.actions.open();
    props = drawer.getOverlayProps();
    expect(props['data-state']).toBe('open');
    expect(props['aria-hidden']).toBe(false);
  });

  it('provides correct content props', () => {
    const drawer = createDrawer();
    let props = drawer.getContentProps();
    expect(props.role).toBe('dialog');
    expect(props['aria-modal']).toBe(true);
    expect(props['aria-hidden']).toBe(true);
    expect(props['data-state']).toBe('closed');
    expect(props['data-side']).toBe('left');
    expect(props.tabindex).toBe(-1);

    drawer.actions.open();
    props = drawer.getContentProps();
    expect(props['aria-hidden']).toBe(false);
    expect(props['data-state']).toBe('open');
  });

  it('provides correct close button props', () => {
    const drawer = createDrawer();
    const props = drawer.getCloseButtonProps();
    expect(props['aria-label']).toBe('Close');
    expect(props.type).toBe('button');
  });

  it('handles Escape key to close by default', () => {
    const drawer = createDrawer();
    drawer.actions.open();
    const preventDefault = vi.fn();
    drawer.handleKeyDown({ key: 'Escape', preventDefault } as any);
    expect(preventDefault).toHaveBeenCalled();
    expect(drawer.state.isOpen).toBe(false);
  });

  it('does not close on Escape if configured false', () => {
    const drawer = createDrawer({ closeOnEscape: false });
    drawer.actions.open();
    const preventDefault = vi.fn();
    drawer.handleKeyDown({ key: 'Escape', preventDefault } as any);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(drawer.state.isOpen).toBe(true);
  });

  it('handles overlay click to close by default', () => {
    const drawer = createDrawer();
    drawer.actions.open();
    drawer.handleOverlayClick();
    expect(drawer.state.isOpen).toBe(false);
  });

  it('does not close on overlay click if configured false', () => {
    const drawer = createDrawer({ closeOnOverlayClick: false });
    drawer.actions.open();
    drawer.handleOverlayClick();
    expect(drawer.state.isOpen).toBe(true);
  });
});
