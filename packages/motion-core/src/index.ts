export { Motion } from "./motion.js";
export { MotionDirective } from "./directive.js";
export { MotionAnimations } from "./animations/index.js";
export type { MotionAnimation, MotionOptions } from "./types.js";

// Re-export individual animation modules for granular imports
export { FadeAnimations } from "./animations/fade.js";
export { ScaleAnimations } from "./animations/scale.js";
export { BounceAnimations } from "./animations/bounce.js";
export { RotateAnimations } from "./animations/rotate.js";
export { SlideAnimations } from "./animations/slide.js";
