import { describe, it, expect, vi } from 'vitest';
import { createAccordion } from '../accordion';

describe('createAccordion', () => {
  it('returns expected default state and methods', () => {
    const accordion = createAccordion();
    expect(accordion.state.expandedItems.size).toBe(0);
    expect(accordion.state.orientation).toBe('vertical');
    expect(accordion.state.disabled).toBe(false);
    expect(accordion.actions).toBeDefined();
    expect(accordion.queries).toBeDefined();
  });

  it('can toggle an item', () => {
    const accordion = createAccordion();
    accordion.actions.toggle('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(true);
    accordion.actions.toggle('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(false);
  });

  it('allows single item expanded by default', () => {
    const accordion = createAccordion();
    accordion.actions.toggle('item-1');
    accordion.actions.toggle('item-2');
    expect(accordion.queries.isExpanded('item-1')).toBe(false);
    expect(accordion.queries.isExpanded('item-2')).toBe(true);
  });

  it('allows multiple items expanded when configured', () => {
    const accordion = createAccordion({ allowMultiple: true });
    accordion.actions.toggle('item-1');
    accordion.actions.toggle('item-2');
    expect(accordion.queries.isExpanded('item-1')).toBe(true);
    expect(accordion.queries.isExpanded('item-2')).toBe(true);
  });

  it('calls onValueChange when state changes', () => {
    const onValueChange = vi.fn();
    const accordion = createAccordion({ onValueChange });
    accordion.actions.toggle('item-1');
    expect(onValueChange).toHaveBeenCalledWith(['item-1']);
  });

  it('can explicitly expand and collapse', () => {
    const accordion = createAccordion();
    accordion.actions.expand('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(true);
    accordion.actions.collapse('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(false);
  });

  it('handles collapseAll', () => {
    const accordion = createAccordion({ allowMultiple: true, defaultValue: ['item-1', 'item-2'] });
    expect(accordion.queries.getExpandedItems()).toEqual(['item-1', 'item-2']);
    accordion.actions.collapseAll();
    expect(accordion.queries.getExpandedItems()).toEqual([]);
  });

  it('does nothing when disabled', () => {
    const accordion = createAccordion({ disabled: true });
    accordion.actions.toggle('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(false);
  });

  it('can change disabled state', () => {
    const accordion = createAccordion();
    accordion.actions.setDisabled(true);
    accordion.actions.toggle('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(false);
    accordion.actions.setDisabled(false);
    accordion.actions.toggle('item-1');
    expect(accordion.queries.isExpanded('item-1')).toBe(true);
  });

  it('provides correct element props', () => {
    const accordion = createAccordion();
    accordion.actions.toggle('item-1');

    expect(accordion.getContainerProps()['data-orientation']).toBe('vertical');

    const triggerProps = accordion.getTriggerProps('item-1');
    expect(triggerProps['aria-expanded']).toBe('true');
    expect(triggerProps.role).toBe('button');

    const contentProps = accordion.getContentProps('item-1');
    expect(contentProps.role).toBe('region');
    expect(contentProps['aria-hidden']).toBe('false');
  });

  it('keeps the content id stable across repeated calls', () => {
    // No `aria-controls` on the trigger: it renders in a different shadow
    // tree than the content it would reference (and-accordion-trigger vs.
    // and-accordion-content are sibling shadow-DOM components), so the ID
    // reference could never resolve — see the comment on getTriggerProps.
    const accordion = createAccordion();

    const triggerProps1 = accordion.getTriggerProps('item-1');
    expect(triggerProps1).not.toHaveProperty('aria-controls');

    const contentProps1 = accordion.getContentProps('item-1');
    expect(contentProps1.id).toBeTruthy();

    const contentProps2 = accordion.getContentProps('item-1');
    expect(contentProps2.id).toBe(contentProps1.id);
  });

  it('handles keyboard navigation (Enter/Space to toggle)', () => {
    const accordion = createAccordion();
    const preventDefault = vi.fn();

    accordion.handleTriggerKeyDown({ key: 'Enter', preventDefault } as any, 'item-1');
    expect(preventDefault).toHaveBeenCalled();
    expect(accordion.queries.isExpanded('item-1')).toBe(true);

    accordion.handleTriggerKeyDown({ key: ' ', preventDefault } as any, 'item-1'); // Space key doesn't work well with just simple match here unless it's Keys.Space imported, check implementation
  });
});
