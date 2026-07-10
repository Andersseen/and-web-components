import { describe, it, expect, afterEach } from 'vitest';
import { createDraggable } from './create-draggable';

describe('createDraggable', () => {
  let instance: ReturnType<typeof createDraggable> | null = null;

  afterEach(() => {
    instance?.destroy();
    instance = null;
  });

  it('should create a draggable instance', () => {
    const element = document.createElement('div');
    instance = createDraggable(element);

    expect(instance.element).toBe(element);
    expect(element.getAttribute('draggable')).toBe('true');
    expect(element.classList.contains('and-draggable')).toBe(true);
  });

  it('should respect disabled config', () => {
    const element = document.createElement('div');
    instance = createDraggable(element, { disabled: true });

    expect(element.getAttribute('draggable')).toBe('false');
    expect(element.classList.contains('and-disabled')).toBe(true);
  });

  it('should clean up on destroy', () => {
    const element = document.createElement('div');
    instance = createDraggable(element);
    instance.destroy();

    expect(element.getAttribute('draggable')).toBeNull();
    expect(element.classList.contains('and-draggable')).toBe(false);
  });
});
