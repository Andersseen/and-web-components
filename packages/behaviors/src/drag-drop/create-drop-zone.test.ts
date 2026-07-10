import { describe, it, expect, afterEach } from 'vitest';
import { createDropZone } from './create-drop-zone';

describe('createDropZone', () => {
  let instance: ReturnType<typeof createDropZone> | null = null;

  afterEach(() => {
    instance?.destroy();
    instance = null;
  });

  it('should create a drop zone instance', () => {
    const element = document.createElement('div');
    instance = createDropZone(element);

    expect(instance.element).toBe(element);
    expect(element.classList.contains('and-drop-zone')).toBe(true);
  });

  it('should apply disabled class when disabled', () => {
    const element = document.createElement('div');
    instance = createDropZone(element, { disabled: true });

    expect(element.classList.contains('and-drop-disabled')).toBe(true);
  });

  it('should clean up on destroy', () => {
    const element = document.createElement('div');
    instance = createDropZone(element);
    instance.destroy();

    expect(element.classList.contains('and-drop-zone')).toBe(false);
  });
});
