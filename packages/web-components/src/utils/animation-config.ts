/**
 * Global animation configuration for @andersseen/web-components.
 *
 * Call `enableAnimations()` once at app bootstrap to opt-in to
 * entrance / exit / transition animations across *all* components.
 *
 * @example
 * ```ts
 * import { enableAnimations } from '@andersseen/web-components';
 *
 * enableAnimations();     // all components will animate
 * ```
 */

const getGlobalObject = (): any =>
  typeof window !== 'undefined' ? window : globalThis;

/**
 * Enable animations globally for every @andersseen component.
 * Call once at application startup.
 */
export const enableAnimations = (): void => {
  getGlobalObject().__AND_ANIMATED__ = true;
};

/**
 * Disable animations globally.
 */
export const disableAnimations = (): void => {
  getGlobalObject().__AND_ANIMATED__ = false;
};

/**
 * Returns `true` when animations have been enabled via `enableAnimations()`.
 */
export const isAnimationsEnabled = (): boolean => {
  return getGlobalObject().__AND_ANIMATED__ === true;
};

/**
 * Helper intended for internal use by components.
 * Sets the `animated` host attribute when the global flag is on.
 */
export const applyGlobalAnimationFlag = (el: HTMLElement): void => {
  if (isAnimationsEnabled()) {
    el.setAttribute('animated', '');
  }
};
