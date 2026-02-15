"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motion = void 0;
const index_js_1 = require("./animations/index.js");
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
class Motion {
    /**
     * Animates an element entering the view.
     * Shows the element (removes `display: none`) before animating by default.
     *
     * @param element  - The DOM element to animate.
     * @param animation - The animation class name to apply.
     * @param options  - Optional animation customization.
     * @returns A Promise that resolves when the animation ends.
     */
    static enter(element, animation, options) {
        return new Promise((resolve) => {
            Motion.cleanup(element);
            const show = options?.showBefore ?? true;
            if (show) {
                element.style.display = "";
            }
            Motion.applyOptions(element, options);
            element.classList.add(animation);
            element.addEventListener("animationend", function handler() {
                element.removeEventListener("animationend", handler);
                resolve();
            }, { once: true });
        });
    }
    /**
     * Animates an element leaving the view.
     * Hides the element (`display: none`) after the animation by default.
     *
     * @param element  - The DOM element to animate.
     * @param animation - The animation class name to apply.
     * @param options  - Optional animation customization.
     * @returns A Promise that resolves when the animation ends.
     */
    static leave(element, animation, options) {
        return new Promise((resolve) => {
            Motion.cleanup(element);
            Motion.applyOptions(element, options);
            element.classList.add(animation);
            element.addEventListener("animationend", function handler() {
                element.removeEventListener("animationend", handler);
                element.classList.remove(animation);
                const hide = options?.hideAfter ?? true;
                if (hide) {
                    element.style.display = "none";
                }
                resolve();
            }, { once: true });
        });
    }
    /**
     * Plays an animation on an element without showing/hiding it.
     * Useful for emphasis effects (pulse, shake, etc.).
     *
     * @param element  - The DOM element to animate.
     * @param animation - The animation class name to apply.
     * @param options  - Optional animation customization.
     * @returns A Promise that resolves when the animation ends.
     */
    static animate(element, animation, options) {
        return Motion.enter(element, animation, { showBefore: false, ...options });
    }
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
    static bindTap(element, animation, options) {
        const handler = () => {
            Motion.cleanup(element);
            Motion.applyOptions(element, options);
            element.classList.add(animation);
            element.addEventListener("animationend", function remove() {
                element.classList.remove(animation);
                element.removeEventListener("animationend", remove);
            }, { once: true });
        };
        element.addEventListener("click", handler);
        return () => element.removeEventListener("click", handler);
    }
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
    static bindHover(element, enterAnimation, leaveAnimation, options) {
        const onEnter = () => {
            Motion.cleanup(element);
            element.classList.remove(leaveAnimation);
            Motion.applyOptions(element, options);
            element.classList.add(enterAnimation);
        };
        const onLeave = () => {
            Motion.cleanup(element);
            element.classList.remove(enterAnimation);
            Motion.applyOptions(element, options);
            element.classList.add(leaveAnimation);
        };
        element.addEventListener("mouseenter", onEnter);
        element.addEventListener("mouseleave", onLeave);
        return () => {
            element.removeEventListener("mouseenter", onEnter);
            element.removeEventListener("mouseleave", onLeave);
        };
    }
    /**
     * Removes all known motion classes and inline animation styles from an element.
     * Called internally before each new animation to ensure a clean state.
     */
    static cleanup(element) {
        // Remove all known motion classes
        Object.values(index_js_1.MotionAnimations).forEach((cls) => {
            element.classList.remove(cls);
        });
        // Also remove any custom motion-* classes
        const toRemove = [];
        element.classList.forEach((cls) => {
            if (cls.startsWith("motion-")) {
                toRemove.push(cls);
            }
        });
        toRemove.forEach((cls) => element.classList.remove(cls));
        element.style.animationDuration = "";
        element.style.animationTimingFunction = "";
        element.style.animationDelay = "";
    }
    /**
     * Applies custom animation options as inline styles.
     */
    static applyOptions(element, options) {
        if (!options)
            return;
        if (options.duration) {
            element.style.animationDuration =
                typeof options.duration === "number"
                    ? `${options.duration}ms`
                    : options.duration;
        }
        if (options.easing) {
            element.style.animationTimingFunction = options.easing;
        }
        if (options.delay) {
            element.style.animationDelay =
                typeof options.delay === "number"
                    ? `${options.delay}ms`
                    : options.delay;
        }
    }
}
exports.Motion = Motion;
