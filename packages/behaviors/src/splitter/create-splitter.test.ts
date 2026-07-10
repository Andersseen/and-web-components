import { describe, it, expect, afterEach } from 'vitest';
import { createSplitter } from './create-splitter';

describe('createSplitter', () => {
  let instance: ReturnType<typeof createSplitter> | null = null;

  afterEach(() => {
    instance?.destroy();
    instance = null;
  });

  function createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = `
      <div and-splitter-panel="primary">Primary</div>
      <div and-splitter-handle></div>
      <div and-splitter-panel="secondary">Secondary</div>
    `;
    document.body.appendChild(container);
    return container;
  }

  it('should create a splitter instance', () => {
    const container = createContainer();
    instance = createSplitter(container);

    expect(instance.container).toBe(container);
    expect(container.classList.contains('and-splitter-container')).toBe(true);
  });

  it('should throw if required children are missing', () => {
    const container = document.createElement('div');
    expect(() => createSplitter(container)).toThrow();
  });

  it('should apply initial panel sizes', () => {
    const container = createContainer();
    instance = createSplitter(container, { defaultPosition: 40, orientation: 'horizontal' });

    const primary = container.querySelector<HTMLElement>('[and-splitter-panel="primary"]');
    expect(primary?.style.width).toBe('40%');
  });

  it('should update position imperatively', () => {
    const container = createContainer();
    instance = createSplitter(container, { defaultPosition: 50 });
    instance.setPosition(75);

    const primary = container.querySelector<HTMLElement>('[and-splitter-panel="primary"]');
    expect(primary?.style.width).toBe('75%');
  });

  it('should give the handle an accessible name and separator role', () => {
    const container = createContainer();
    instance = createSplitter(container);

    const handle = container.querySelector<HTMLElement>('[and-splitter-handle]');
    expect(handle?.getAttribute('role')).toBe('separator');
    expect(handle?.getAttribute('aria-label')).toBe('Resize panels');
  });

  it('should not override an author-provided aria-label', () => {
    const container = createContainer();
    const handle = container.querySelector<HTMLElement>('[and-splitter-handle]');
    handle?.setAttribute('aria-label', 'Resize sidebar');

    instance = createSplitter(container);
    expect(handle?.getAttribute('aria-label')).toBe('Resize sidebar');
  });
});
