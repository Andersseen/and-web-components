import { describe, it, expect, vi } from 'vitest';
import { createMenuSelection } from '../menu';

describe('createMenuSelection', () => {
  it('returns selectItem method', () => {
    const close = vi.fn();
    const selection = createMenuSelection({}, close);
    expect(selection.selectItem).toBeDefined();
  });

  it('calls onSelect with item id when selecting', () => {
    const close = vi.fn();
    const onSelect = vi.fn();
    const selection = createMenuSelection({ onSelect }, close);

    selection.selectItem('item-1');
    expect(onSelect).toHaveBeenCalledWith({ itemId: 'item-1' });
  });

  it('calls onSelect without item id when selecting empty', () => {
    const close = vi.fn();
    const onSelect = vi.fn();
    const selection = createMenuSelection({ onSelect }, close);

    selection.selectItem();
    expect(onSelect).toHaveBeenCalledWith({ itemId: undefined });
  });

  it('closes by default after selecting', () => {
    const close = vi.fn();
    const selection = createMenuSelection({}, close);

    selection.selectItem('item-1');
    expect(close).toHaveBeenCalled();
  });

  it('does not close when closeOnSelect is false', () => {
    const close = vi.fn();
    const selection = createMenuSelection({ closeOnSelect: false }, close);

    selection.selectItem('item-1');
    expect(close).not.toHaveBeenCalled();
  });

  it('still calls onSelect when closeOnSelect is false', () => {
    const close = vi.fn();
    const onSelect = vi.fn();
    const selection = createMenuSelection({ closeOnSelect: false, onSelect }, close);

    selection.selectItem('item-1');
    expect(onSelect).toHaveBeenCalledWith({ itemId: 'item-1' });
    expect(close).not.toHaveBeenCalled();
  });
});
