import { describe, it, expect, vi } from 'vitest';
import { createContextMenu } from '../context-menu';

describe('createContextMenu', () => {
  it('returns expected default state and methods', () => {
    const ctx = createContextMenu();
    expect(ctx.state.isOpen).toBe(false);
    expect(ctx.state.position).toEqual({ x: 0, y: 0 });
    expect(ctx.actions).toBeDefined();
  });

  it('can open at a specific position', () => {
    const ctx = createContextMenu();
    ctx.actions.open({ x: 100, y: 200 });
    expect(ctx.state.isOpen).toBe(true);
    expect(ctx.state.position).toEqual({ x: 100, y: 200 });
  });

  it('can close', () => {
    const ctx = createContextMenu();
    ctx.actions.open({ x: 100, y: 200 });
    ctx.actions.close();
    expect(ctx.state.isOpen).toBe(false);
  });

  it('closes on select by default', () => {
    const ctx = createContextMenu();
    ctx.actions.open({ x: 10, y: 10 });
    ctx.actions.selectItem('item-1');
    expect(ctx.state.isOpen).toBe(false);
  });

  it('does not close on select if configured', () => {
    const ctx = createContextMenu({ closeOnSelect: false });
    ctx.actions.open({ x: 10, y: 10 });
    ctx.actions.selectItem('item-1');
    expect(ctx.state.isOpen).toBe(true);
  });

  it('calls onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    const ctx = createContextMenu({ onOpenChange });
    ctx.actions.open({ x: 10, y: 10 });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    ctx.actions.close();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onPosition callback when opened', () => {
    const onPosition = vi.fn();
    const ctx = createContextMenu({ onPosition });
    ctx.actions.open({ x: 50, y: 60 });
    expect(onPosition).toHaveBeenCalledWith({ x: 50, y: 60 });
  });

  it('provides correct trigger props', () => {
    const ctx = createContextMenu();
    expect(ctx.getTriggerProps()['data-state']).toBe('closed');
    ctx.actions.open({ x: 0, y: 0 });
    expect(ctx.getTriggerProps()['data-state']).toBe('open');
  });

  it('provides correct panel props', () => {
    const ctx = createContextMenu();

    let props = ctx.getPanelProps();
    expect(props.role).toBe('menu');
    expect(props['aria-label']).toBe('Context menu');
    expect(props['data-state']).toBe('closed');
    expect(props.hidden).toBe(true);

    ctx.actions.open({ x: 0, y: 0 });
    props = ctx.getPanelProps('Custom Menu');
    expect(props['aria-label']).toBe('Custom Menu');
    expect(props['data-state']).toBe('open');
    expect(props.hidden).toBe(false);
  });

  it('handles contextmenu event and opens correctly without triggerRect', () => {
    const ctx = createContextMenu();
    const preventDefault = vi.fn();
    const event = { preventDefault, clientX: 300, clientY: 400 } as unknown as MouseEvent;

    ctx.handleContextMenu(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(ctx.state.isOpen).toBe(true);
    expect(ctx.state.position).toEqual({ x: 300, y: 400 });
  });

  it('handles contextmenu event and opens correctly with triggerRect', () => {
    const ctx = createContextMenu();
    const preventDefault = vi.fn();
    const event = { preventDefault, clientX: 300, clientY: 400 } as unknown as MouseEvent;
    const triggerRect = { left: 100, top: 150 } as DOMRect;

    ctx.handleContextMenu(event, triggerRect);

    expect(preventDefault).toHaveBeenCalled();
    expect(ctx.state.isOpen).toBe(true);
    expect(ctx.state.position).toEqual({ x: 200, y: 250 });
  });

  it('handles Escape keydown to close', () => {
    const ctx = createContextMenu();
    ctx.actions.open({ x: 0, y: 0 });

    const preventDefault = vi.fn();
    const event = { preventDefault, key: 'Escape' } as unknown as KeyboardEvent;

    ctx.handleKeyDown(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(ctx.state.isOpen).toBe(false);
  });

  it('ignores other keys during keydown', () => {
    const ctx = createContextMenu();
    ctx.actions.open({ x: 0, y: 0 });

    const preventDefault = vi.fn();
    const event = { preventDefault, key: 'Enter' } as unknown as KeyboardEvent;

    ctx.handleKeyDown(event);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(ctx.state.isOpen).toBe(true);
  });

  it('ignores keydown if not open', () => {
    const ctx = createContextMenu();
    const preventDefault = vi.fn();
    const event = { preventDefault, key: 'Escape' } as unknown as KeyboardEvent;

    ctx.handleKeyDown(event);

    expect(preventDefault).not.toHaveBeenCalled();
  });
});
