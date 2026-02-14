export type MotionAnimation =
  | 'motion-fade-in'
  | 'motion-fade-out'
  | 'motion-scale-in'
  | 'motion-slide-in-top'
  | 'motion-slide-in-bottom'
  | 'motion-slide-in-left'
  | 'motion-slide-in-right'
  | string;

export const MotionAnimations = {
  FadeIn: 'motion-fade-in',
  FadeOut: 'motion-fade-out',
  ScaleIn: 'motion-scale-in',
  SlideInTop: 'motion-slide-in-top',
  SlideInBottom: 'motion-slide-in-bottom',
  SlideInLeft: 'motion-slide-in-left',
  SlideInRight: 'motion-slide-in-right',
} as const;

export interface MotionOptions {
  duration?: number | string;
  easing?: string;
  delay?: number | string;
  /**
   * If true, the element will be hidden (display: none) after the animation ends (for leave).
   * Default is true for leave, false for enter.
   */
  hideAfter?: boolean;
  /**
   * If true, the element will be shown (display: '') before the animation starts (for enter).
   * Default is true for enter, false for leave.
   */
  showBefore?: boolean;
}

export class Motion {
  /**
   * Animates an element entering the view.
   * Removes `display: none` before animating.
   */
  static enter(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void> {
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
  static leave(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void> {
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

  static animate(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void> {
      return Motion.enter(element, animation, { showBefore: false, ...options });
  }

  static bindTap(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): void {
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

  static bindHover(
    element: HTMLElement,
    enterAnimation: MotionAnimation,
    leaveAnimation: MotionAnimation,
    options?: MotionOptions
  ): void {
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

  private static cleanup(element: HTMLElement) {
    // Remove all known motion classes to ensure clean slate
    Object.values(MotionAnimations).forEach(cls => {
        element.classList.remove(cls);
    });

    element.style.animationDuration = '';
    element.style.animationTimingFunction = '';
    element.style.animationDelay = '';
  }

  private static applyOptions(element: HTMLElement, options?: MotionOptions) {
    if (!options) return;

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
