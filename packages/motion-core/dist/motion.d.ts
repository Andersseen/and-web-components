import { MotionAnimation, MotionOptions } from "./types.js";
/**
 * Framework-agnostic animation controller.
 *
 * Applies CSS animation classes to DOM elements and returns Promises
 * that resolve when the animation completes.
 *
 * @example
 * ```ts
 * // Enter animation
 * await Motion.enter(el, MotionAnimations.FadeIn);
 *
 * // Leave animation
 * await Motion.leave(el, MotionAnimations.FadeOut);
 *
 * // Bind tap interaction (returns cleanup fn)
 * const unbind = Motion.bindTap(el, MotionAnimations.ScaleIn);
 * // Later: unbind();
 * ```
 */
export declare class Motion {
    /**
     * Animates an element entering the view.
     * Shows the element (removes `display: none`) before animating by default.
     *
     * @param element  - The DOM element to animate.
     * @param animation - The animation class name to apply.
     * @param options  - Optional animation customization.
     * @returns A Promise that resolves when the animation ends.
     */
    static enter(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void>;
    /**
     * Animates an element leaving the view.
     * Hides the element (`display: none`) after the animation by default.
     *
     * @param element  - The DOM element to animate.
     * @param animation - The animation class name to apply.
     * @param options  - Optional animation customization.
     * @returns A Promise that resolves when the animation ends.
     */
    static leave(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void>;
    /**
     * Plays an animation on an element without showing/hiding it.
     * Useful for emphasis effects (pulse, shake, etc.).
     *
     * @param element  - The DOM element to animate.
     * @param animation - The animation class name to apply.
     * @param options  - Optional animation customization.
     * @returns A Promise that resolves when the animation ends.
     */
    static animate(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void>;
    /**
     * Binds a click/tap interaction to an element that triggers an animation.
     *
     * @param element   - The DOM element to bind the tap to.
     * @param animation - The animation to play on each tap.
     * @param options   - Optional animation customization.
     * @returns A cleanup function that removes the event listener.
     *
     * @example
     * ```ts
     * const unbind = Motion.bindTap(button, MotionAnimations.ScaleIn, { duration: 150 });
     * // Later, to prevent memory leaks:
     * unbind();
     * ```
     */
    static bindTap(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): () => void;
    /**
     * Binds hover interactions to an element with enter/leave animations.
     *
     * @param element        - The DOM element to bind hover to.
     * @param enterAnimation - Animation played on `mouseenter`.
     * @param leaveAnimation - Animation played on `mouseleave`.
     * @param options        - Optional animation customization.
     * @returns A cleanup function that removes both event listeners.
     *
     * @example
     * ```ts
     * const unbind = Motion.bindHover(card, MotionAnimations.ScaleIn, MotionAnimations.ScaleOut);
     * // Later: unbind();
     * ```
     */
    static bindHover(element: HTMLElement, enterAnimation: MotionAnimation, leaveAnimation: MotionAnimation, options?: MotionOptions): () => void;
    /**
     * Removes all known motion classes and inline animation styles from an element.
     * Called internally before each new animation to ensure a clean state.
     */
    private static cleanup;
    /**
     * Applies custom animation options as inline styles.
     */
    private static applyOptions;
}
//# sourceMappingURL=motion.d.ts.map