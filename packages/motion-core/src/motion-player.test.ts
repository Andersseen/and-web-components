import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMotionPlayer } from './motion-player';

describe('createMotionPlayer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('sets motion attributes and inline animation styles when playing', () => {
    const el = document.createElement('div');
    container.appendChild(el);

    const player = createMotionPlayer(el);
    void player.play('fade-zoom-in');

    expect(el.getAttribute('and-motion')).toBe('fade-zoom-in');
    expect(el.getAttribute('and-motion-state')).toBe('active');
    expect(el.style.animationName).toContain('and-fade-zoom-in');
    expect(el.style.animationDuration).toBeTruthy();

    player.destroy();
  });

  it('clears state and removes attributes on destroy', () => {
    const el = document.createElement('div');
    container.appendChild(el);

    const player = createMotionPlayer(el);
    void player.play('fade-zoom-in');
    player.destroy();

    expect(el.hasAttribute('and-motion')).toBe(false);
    expect(el.hasAttribute('and-motion-state')).toBe(false);
    expect(el.style.animationName).toBe('');
  });

  it('resolves immediately when reduced motion is preferred', async () => {
    const el = document.createElement('div');
    container.appendChild(el);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const player = createMotionPlayer(el);
    await player.play('fade-zoom-in');

    expect(el.hasAttribute('and-motion')).toBe(false);
    expect(el.hasAttribute('and-motion-state')).toBe(false);
    expect(el.style.animationName).toBe('');
  });
});
