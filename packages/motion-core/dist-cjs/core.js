"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motion = exports.MotionAnimations = void 0;
exports.MotionAnimations = {
    FadeIn: 'motion-fade-in',
    FadeOut: 'motion-fade-out',
    ScaleIn: 'motion-scale-in',
    SlideInTop: 'motion-slide-in-top',
    SlideInBottom: 'motion-slide-in-bottom',
    SlideInLeft: 'motion-slide-in-left',
    SlideInRight: 'motion-slide-in-right',
};
class Motion {
    /**
     * Animates an element entering the view.
     * Removes `display: none` before animating.
     */
    static enter(element, animation, options) {
        return new Promise((resolve) => {
            Motion.cleanup(element);
            const show = options?.showBefore ?? true;
            if (show) {
                element.style.display = '';
            }
            Motion.applyOptions(element, options);
            element.classList.add(animation);
            const handleAnimationEnd = () => {
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            element.addEventListener('animationend', handleAnimationEnd, { once: true });
        });
    }
    /**
     * Animates an element leaving the view.
     * Sets `display: none` after animating.
     */
    static leave(element, animation, options) {
        return new Promise((resolve) => {
            Motion.cleanup(element);
            Motion.applyOptions(element, options);
            element.classList.add(animation);
            const handleAnimationEnd = () => {
                element.removeEventListener('animationend', handleAnimationEnd);
                element.classList.remove(animation);
                const hide = options?.hideAfter ?? true;
                if (hide) {
                    element.style.display = 'none';
                }
                resolve();
            };
            element.addEventListener('animationend', handleAnimationEnd, { once: true });
        });
    }
    static animate(element, animation, options) {
        return Motion.enter(element, animation, { showBefore: false, ...options });
    }
    static bindTap(element, animation, options) {
        element.addEventListener('click', () => {
            Motion.cleanup(element);
            Motion.applyOptions(element, options);
            element.classList.add(animation);
            const remove = () => {
                element.classList.remove(animation);
                element.removeEventListener('animationend', remove);
            };
            element.addEventListener('animationend', remove, { once: true });
        });
    }
    static bindHover(element, enterAnimation, leaveAnimation, options) {
        // We need to keep track of state to avoid flickering
        element.addEventListener('mouseenter', () => {
            Motion.cleanup(element);
            element.classList.remove(leaveAnimation);
            Motion.applyOptions(element, options);
            element.classList.add(enterAnimation);
        });
        element.addEventListener('mouseleave', () => {
            Motion.cleanup(element);
            element.classList.remove(enterAnimation);
            Motion.applyOptions(element, options);
            element.classList.add(leaveAnimation);
        });
    }
    static cleanup(element) {
        // Remove all known motion classes to ensure clean slate
        Object.values(exports.MotionAnimations).forEach(cls => {
            element.classList.remove(cls);
        });
        element.style.animationDuration = '';
        element.style.animationTimingFunction = '';
        element.style.animationDelay = '';
    }
    static applyOptions(element, options) {
        if (!options)
            return;
        if (options.duration) {
            element.style.animationDuration = typeof options.duration === 'number'
                ? `${options.duration}ms`
                : options.duration;
        }
        if (options.easing) {
            element.style.animationTimingFunction = options.easing;
        }
        if (options.delay) {
            element.style.animationDelay = typeof options.delay === 'number'
                ? `${options.delay}ms`
                : options.delay;
        }
    }
}
exports.Motion = Motion;
