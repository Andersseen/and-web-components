/**
 * Overlay primitives — the reusable half of the dialog and tooltip
 * behaviors, exposed as a public subpath (`@andersseen/behaviors/overlay`).
 *
 * These solve two problems that every floating/overlay UI hits, and that
 * were previously re-implemented (worse, or not at all) elsewhere in this
 * repo:
 *
 * - **Clipping.** A popover rendered inside its trigger's subtree is cut off
 *   by any ancestor with `overflow: hidden` — a card, a table cell, a
 *   scrolling sidebar. `calculatePosition` computes viewport coordinates for
 *   a `position: fixed` element appended to `<body>`, with flip-on-collision.
 * - **Modal semantics.** A dialog needs a focus trap, Escape, focus
 *   restoration and a body scroll lock, all of which have to survive
 *   *stacking* — two dialogs open at once must not clobber each other's
 *   cleanup.
 *
 * Zero dependencies, no DOM touched at import time.
 */

export {
  calculatePosition,
  type OverlayPosition,
  type OverlaySize,
  type TooltipPlacement as OverlayPlacement,
} from '../utils/position';

export { clamp, listen, setStyles, type ListenerCleanup } from '../utils/dom';
