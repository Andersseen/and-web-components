/**
 * Union type of all built-in motion animation class names.
 * Also accepts custom `string` values for user-defined animations.
 */
export type MotionAnimation =
  | "motion-fade-in"
  | "motion-fade-out"
  | "motion-scale-in"
  | "motion-scale-out"
  | "motion-bounce-in"
  | "motion-rotate-in"
  | "motion-slide-in-top"
  | "motion-slide-in-bottom"
  | "motion-slide-in-left"
  | "motion-slide-in-right"
  | "motion-slide-out-top"
  | "motion-slide-out-bottom"
  | "motion-slide-out-left"
  | "motion-slide-out-right"
  | string;

/** Options to customize animation behavior. */
export interface MotionOptions {
  /** Animation duration in milliseconds or as a CSS string (e.g. `'0.5s'`). */
  duration?: number | string;
  /** CSS easing function (e.g. `'ease-in-out'`, `'cubic-bezier(…)'`). */
  easing?: string;
  /** Animation delay in milliseconds or as a CSS string. */
  delay?: number | string;
  /**
   * If `true`, hides the element (`display: none`) after the animation ends.
   * Defaults to `true` for `leave()`, `false` for `enter()`.
   */
  hideAfter?: boolean;
  /**
   * If `true`, shows the element (`display: ''`) before the animation starts.
   * Defaults to `true` for `enter()`, `false` for `leave()`.
   */
  showBefore?: boolean;
}
