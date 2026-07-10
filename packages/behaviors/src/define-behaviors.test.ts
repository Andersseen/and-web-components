import { describe, it, expect, afterEach } from 'vitest';
import { defineBehaviors } from './define-behaviors';

describe('defineBehaviors', () => {
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    cleanup?.();
    cleanup = null;
  });

  it('should wire up a splitter from attributes', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div and-splitter="horizontal" and-splitter-default-position="40">
        <div and-splitter-panel="primary">Primary</div>
        <div and-splitter-handle></div>
        <div and-splitter-panel="secondary">Secondary</div>
      </div>
    `;
    document.body.appendChild(root);

    cleanup = defineBehaviors({ root });

    const primary = root.querySelector<HTMLElement>('[and-splitter-panel="primary"]');
    expect(primary?.style.width).toBe('40%');
  });

  it('should wire up drag and drop from attributes', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div and-draggable>Drag me</div>
      <div and-drop-zone>Drop here</div>
    `;

    cleanup = defineBehaviors({ root });

    const draggable = root.querySelector<HTMLElement>('[and-draggable]');
    const dropZone = root.querySelector<HTMLElement>('[and-drop-zone]');

    expect(draggable?.getAttribute('draggable')).toBe('true');
    expect(dropZone?.classList.contains('and-drop-zone')).toBe(true);
  });

  it('should clean up all behaviors', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div and-splitter="horizontal">
        <div and-splitter-panel="primary">Primary</div>
        <div and-splitter-handle></div>
        <div and-splitter-panel="secondary">Secondary</div>
      </div>
      <div and-draggable>Drag me</div>
      <div and-drop-zone>Drop here</div>
    `;

    cleanup = defineBehaviors({ root });
    cleanup();
    cleanup = null;

    const container = root.querySelector<HTMLElement>('[and-splitter]');
    const draggable = root.querySelector<HTMLElement>('[and-draggable]');
    const dropZone = root.querySelector<HTMLElement>('[and-drop-zone]');

    expect(container?.classList.contains('and-splitter-container')).toBe(false);
    expect(draggable?.getAttribute('draggable')).toBeNull();
    expect(dropZone?.classList.contains('and-drop-zone')).toBe(false);
  });
});
