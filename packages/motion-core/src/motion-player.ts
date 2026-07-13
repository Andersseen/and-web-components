/* ═══════════════════════════════════════════════════════════════════════════
 * @andersseen/motion — MotionPlayer
 *
 * Imperative, promise-based helper for playing a single CSS keyframe
 * animation defined in core.css on a given element. Useful for
 * component-level open/close animations (modal, drawer, toast, etc.)
 * where the lifecycle is controlled programmatically rather than by
 * scroll, hover, or tap.
 *
 * Usage:
 *   const player = createMotionPlayer(element);
 *   await player.play('fade-zoom-in');
 *   // … later …
 *   await player.play('fade-zoom-out');
 *   player.destroy();
 * ═══════════════════════════════════════════════════════════════════════════ */

const ATTR_MOTION = 'and-motion';
const ATTR_STATE = 'and-motion-state';

export interface MotionPlayerOptions {
  /**
   * If `true`, respects `prefers-reduced-motion` by resolving play()
   * immediately without running the animation.
   * @default true
   */
  respectReducedMotion?: boolean;

  /**
   * Default fill mode forwarded to the element via inline style if not
   * already set by the consumer stylesheet.
   * @default 'both'
   */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface MotionPlayer {
  /** Play an animation by its core.css keyframe name. Resolves on animationend. */
  play(name: string): Promise<void>;

  /** Cancel the current animation and clear motion attributes. */
  stop(): void;

  /** Cancel any pending animation and remove listeners / attributes. */
  destroy(): void;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Create a disposable, imperative animation player for a DOM element.
 * Animations are driven by the existing `@andersseen/motion` CSS engine,
 * so any keyframe name exported in core.css can be played.
 */
export function createMotionPlayer(element: HTMLElement, options: MotionPlayerOptions = {}): MotionPlayer {
  const { respectReducedMotion: respectReducedMotionOption = true, fillMode = 'both' } = options;
  let pendingEndResolver: (() => void) | null = null;
  let animationEndHandler: (() => void) | null = null;

  const clearState = (): void => {
    if (animationEndHandler) {
      element.removeEventListener('animationend', animationEndHandler);
      animationEndHandler = null;
    }
    if (pendingEndResolver) {
      pendingEndResolver();
      pendingEndResolver = null;
    }
    element.removeAttribute(ATTR_MOTION);
    element.removeAttribute(ATTR_STATE);
    element.style.removeProperty('animation-name');
    element.style.removeProperty('animation-duration');
    element.style.removeProperty('animation-delay');
    element.style.removeProperty('animation-timing-function');
    element.style.removeProperty('animation-fill-mode');
  };

  return {
    play(name: string): Promise<void> {
      clearState();

      return new Promise(resolve => {
        pendingEndResolver = resolve;

        element.setAttribute(ATTR_MOTION, name);
        element.setAttribute(ATTR_STATE, 'active');

        if (respectReducedMotionOption && prefersReducedMotion()) {
          clearState();
          return;
        }

        const computed = getComputedStyle(element);
        const duration = computed.getPropertyValue('--and-motion-duration').trim() || '500ms';
        const delay = computed.getPropertyValue('--and-motion-delay').trim() || '0ms';
        const easing = computed.getPropertyValue('--and-motion-easing').trim() || 'ease';

        element.style.animationName = `and-${name}`;
        element.style.animationDuration = duration;
        element.style.animationDelay = delay;
        element.style.animationTimingFunction = easing;
        element.style.animationFillMode = fillMode;

        // Force a style recalc so the browser starts the new animation.
        void element.offsetWidth;

        animationEndHandler = (): void => {
          clearState();
        };
        element.addEventListener('animationend', animationEndHandler);
      });
    },

    stop(): void {
      clearState();
    },

    destroy(): void {
      clearState();
      element.removeAttribute(ATTR_MOTION);
    },
  };
}
