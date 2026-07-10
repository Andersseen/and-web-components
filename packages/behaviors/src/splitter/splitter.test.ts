import { describe, it, expect, vi } from 'vitest';
import { SplitterController } from './splitter';

describe('SplitterController', () => {
  it('should initialize with default options', () => {
    const controller = new SplitterController();
    expect(controller.getState().position).toBe(50);
    expect(controller.getState().orientation).toBe('horizontal');
    expect(controller.getState().isDragging).toBe(false);
  });

  it('should clamp position between min and max', () => {
    const controller = new SplitterController({ minSize: 20, maxSize: 80 });
    controller.setPosition(10);
    expect(controller.getState().position).toBe(20);

    controller.setPosition(90);
    expect(controller.getState().position).toBe(80);
  });

  it('should apply step rounding', () => {
    const controller = new SplitterController({ step: 10, defaultPosition: 0 });
    controller.setPosition(23);
    expect(controller.getState().position).toBe(20);

    controller.setPosition(27);
    expect(controller.getState().position).toBe(30);
  });

  it('should notify subscribers on changes', () => {
    const controller = new SplitterController({ defaultPosition: 0 });
    const listener = vi.fn();
    controller.subscribe(listener);

    controller.setPosition(30);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ position: 30 }));
  });

  it('should track dragging state', () => {
    const controller = new SplitterController();
    controller.startDragging();
    expect(controller.getState().isDragging).toBe(true);

    controller.stopDragging();
    expect(controller.getState().isDragging).toBe(false);
  });
});
