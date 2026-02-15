export { FadeAnimations } from "./fade.js";
export { ScaleAnimations } from "./scale.js";
export { BounceAnimations } from "./bounce.js";
export { RotateAnimations } from "./rotate.js";
export { SlideAnimations } from "./slide.js";
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
export declare const MotionAnimations: {
    readonly SlideInTop: "motion-slide-in-top";
    readonly SlideInBottom: "motion-slide-in-bottom";
    readonly SlideInLeft: "motion-slide-in-left";
    readonly SlideInRight: "motion-slide-in-right";
    readonly SlideOutTop: "motion-slide-out-top";
    readonly SlideOutBottom: "motion-slide-out-bottom";
    readonly SlideOutLeft: "motion-slide-out-left";
    readonly SlideOutRight: "motion-slide-out-right";
    readonly RotateIn: "motion-rotate-in";
    readonly BounceIn: "motion-bounce-in";
    readonly ScaleIn: "motion-scale-in";
    readonly ScaleOut: "motion-scale-out";
    readonly FadeIn: "motion-fade-in";
    readonly FadeOut: "motion-fade-out";
};
//# sourceMappingURL=index.d.ts.map