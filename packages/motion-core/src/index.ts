/* ═══════════════════════════════════════════════════════════════════════════
 * @andersseen/motion — Public API
 *
 * Re-exports the class-based MotionController and provides a convenience
 * `initMotion()` function for drop-in backwards compatibility.
 * ═══════════════════════════════════════════════════════════════════════════ */

export {
  MotionController,
  type MotionControllerOptions,
  type TriggerType,
} from "./motion-controller";

import { MotionController } from "./motion-controller";
import type { MotionControllerOptions } from "./motion-controller";

/**
 * One-liner convenience function.
 *
 * Scans the given root (defaults to `document.body`) for `[and-motion]`
 * elements, wires up every trigger, and returns a cleanup function
 * identical to `MotionController.destroy()`.
 *
 * @example
 * ```ts
 * const cleanup = initMotion();
 * // …later, on unmount:
 * cleanup();
 * ```
 */
export function initMotion(
  options?: MotionControllerOptions,
): () => void {
  const controller = new MotionController(options);
  return () => controller.destroy();
}

