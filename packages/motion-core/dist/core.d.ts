export type MotionAnimation = 'motion-fade-in' | 'motion-fade-out' | 'motion-scale-in' | 'motion-slide-in-top' | 'motion-slide-in-bottom' | 'motion-slide-in-left' | 'motion-slide-in-right' | string;
export declare const MotionAnimations: {
    readonly FadeIn: "motion-fade-in";
    readonly FadeOut: "motion-fade-out";
    readonly ScaleIn: "motion-scale-in";
    readonly SlideInTop: "motion-slide-in-top";
    readonly SlideInBottom: "motion-slide-in-bottom";
    readonly SlideInLeft: "motion-slide-in-left";
    readonly SlideInRight: "motion-slide-in-right";
};
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
export declare class Motion {
    /**
     * Animates an element entering the view.
     * Removes `display: none` before animating.
     */
    static enter(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void>;
    /**
     * Animates an element leaving the view.
     * Sets `display: none` after animating.
     */
    static leave(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void>;
    static animate(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): Promise<void>;
    static bindTap(element: HTMLElement, animation: MotionAnimation, options?: MotionOptions): void;
    static bindHover(element: HTMLElement, enterAnimation: MotionAnimation, leaveAnimation: MotionAnimation, options?: MotionOptions): void;
    private static cleanup;
    private static applyOptions;
}
//# sourceMappingURL=core.d.ts.map