export { FadeAnimations } from "./fade.js";
export { ScaleAnimations } from "./scale.js";
export { BounceAnimations } from "./bounce.js";
export { RotateAnimations } from "./rotate.js";
export { SlideAnimations } from "./slide.js";
import { FadeAnimations } from "./fade.js";
import { ScaleAnimations } from "./scale.js";
import { BounceAnimations } from "./bounce.js";
import { RotateAnimations } from "./rotate.js";
import { SlideAnimations } from "./slide.js";
/**
 * Pre-defined animation constants for use with the `Motion` class.
 * Aggregated from all animation modules for backward compatibility.
 *
 * @example
 * ```ts
 * Motion.enter(element, MotionAnimations.FadeIn);
 * Motion.leave(element, MotionAnimations.FadeOut);
 * ```
 */
export const MotionAnimations = {
    ...FadeAnimations,
    ...ScaleAnimations,
    ...BounceAnimations,
    ...RotateAnimations,
    ...SlideAnimations,
};
