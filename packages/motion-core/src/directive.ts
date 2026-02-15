import { Motion } from "./motion.js";
import type { MotionOptions } from "./types.js";

/** Attribute names used by the declarative API. */
const ATTR = {
  MOTION: "my-motion",
  TRIGGER: "my-motion-trigger",
  LEAVE: "my-motion-leave",
  DURATION: "my-motion-duration",
  EASING: "my-motion-easing",
  DELAY: "my-motion-delay",
  STAGGER: "my-motion-stagger",
} as const;

/** Supported trigger modes. */
type MotionTrigger = "enter" | "hover" | "tap";

/** Selector for all elements with [my-motion]. */
const SELECTOR = `[${ATTR.MOTION}]`;

/**
 * Maps a short animation name (e.g. `"fade-in"`) to the full CSS class name
 * (e.g. `"motion-fade-in"`). Returns the full class if already prefixed.
 */
function resolveAnimation(name: string): string {
  return name.startsWith("motion-") ? name : `motion-${name}`;
}

/**
 * Reads `my-motion-*` attributes from an element and returns `MotionOptions`.
 */
function parseOptions(el: HTMLElement): MotionOptions {
  const opts: MotionOptions = {};

  const duration = el.getAttribute(ATTR.DURATION);
  if (duration) opts.duration = Number(duration);

  const easing = el.getAttribute(ATTR.EASING);
  if (easing) opts.easing = easing;

  const delay = el.getAttribute(ATTR.DELAY);
  if (delay) opts.delay = Number(delay);

  return opts;
}

/**
 * Declarative attribute-based animation controller.
 *
 * Scans the DOM for elements with `[my-motion]` and automatically applies
 * animations based on HTML attributes — zero TypeScript required.
 *
 * @example
 * ```html
 * <!-- Animate on enter (scroll into view) -->
 * <div my-motion="fade-in">Hello</div>
 *
 * <!-- Hover trigger with enter/leave -->
 * <div my-motion="scale-in" my-motion-trigger="hover" my-motion-leave="scale-out">
 *   Card
 * </div>
 *
 * <!-- Tap trigger -->
 * <button my-motion="bounce-in" my-motion-trigger="tap">Click me</button>
 *
 * <!-- Custom options -->
 * <div my-motion="slide-in-left" my-motion-duration="800" my-motion-delay="200">
 *   Delayed slide
 * </div>
 *
 * <!-- Stagger children -->
 * <ul my-motion-stagger="80">
 *   <li my-motion="slide-in-left">Item 1</li>
 *   <li my-motion="slide-in-left">Item 2</li>
 * </ul>
 * ```
 *
 * @example
 * ```ts
 * // Initialize (usually once on app start)
 * MotionDirective.init();
 *
 * // Cleanup when app unmounts (SPA)
 * MotionDirective.destroy();
 * ```
 */
export class MotionDirective {
  /** IntersectionObserver instance for `enter` trigger. */
  private static intersectionObserver: IntersectionObserver | null = null;

  /** MutationObserver instance for dynamic DOM changes. */
  private static mutationObserver: MutationObserver | null = null;

  /** Cleanup functions for bound elements (hover/tap). */
  private static cleanups = new Map<HTMLElement, () => void>();

  /** Track elements already processed to avoid duplicate bindings. */
  private static processed = new WeakSet<HTMLElement>();

  /**
   * Initializes the directive system.
   * Scans all current `[my-motion]` elements and watches for new ones.
   *
   * @param root - Optional root element to observe. Defaults to `document.body`.
   */
  static init(root: HTMLElement = document.body): void {
    // Cleanup any previous instance
    MotionDirective.destroy();

    // 1. Set up IntersectionObserver for `enter` trigger
    MotionDirective.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            MotionDirective.intersectionObserver?.unobserve(el);
            MotionDirective.animateEnter(el);
          }
        });
      },
      { threshold: 0.1 },
    );

    // 2. Process existing elements
    const elements = root.querySelectorAll<HTMLElement>(SELECTOR);
    elements.forEach((el) => MotionDirective.processElement(el));

    // 3. Watch for dynamically added elements
    MotionDirective.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check the node itself
            if (node.hasAttribute(ATTR.MOTION)) {
              MotionDirective.processElement(node);
            }
            // Check descendants
            const children = node.querySelectorAll<HTMLElement>(SELECTOR);
            children.forEach((el) => MotionDirective.processElement(el));
          }
        });
      });
    });

    MotionDirective.mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Destroys all observers and cleans up event listeners.
   */
  static destroy(): void {
    MotionDirective.intersectionObserver?.disconnect();
    MotionDirective.intersectionObserver = null;

    MotionDirective.mutationObserver?.disconnect();
    MotionDirective.mutationObserver = null;

    MotionDirective.cleanups.forEach((cleanup) => cleanup());
    MotionDirective.cleanups.clear();

    MotionDirective.processed = new WeakSet();
  }

  /**
   * Re-scans the DOM for new `[my-motion]` elements.
   * Useful after dynamic content changes in frameworks that don't trigger
   * MutationObserver (e.g. some virtual DOM implementations).
   *
   * @param root - Optional root element to scan from.
   */
  static refresh(root: HTMLElement = document.body): void {
    const elements = root.querySelectorAll<HTMLElement>(SELECTOR);
    elements.forEach((el) => MotionDirective.processElement(el));
  }

  /**
   * Processes a single `[my-motion]` element based on its trigger.
   */
  private static processElement(el: HTMLElement): void {
    // Skip if already processed
    if (MotionDirective.processed.has(el)) return;
    MotionDirective.processed.add(el);

    const trigger = (el.getAttribute(ATTR.TRIGGER) || "enter") as MotionTrigger;

    switch (trigger) {
      case "enter":
        MotionDirective.setupEnterTrigger(el);
        break;
      case "hover":
        MotionDirective.setupHoverTrigger(el);
        break;
      case "tap":
        MotionDirective.setupTapTrigger(el);
        break;
    }
  }

  /**
   * Sets up an `enter` trigger using IntersectionObserver.
   * The element starts hidden and animates in when it scrolls into view.
   */
  private static setupEnterTrigger(el: HTMLElement): void {
    // Hide element initially
    el.style.opacity = "0";

    MotionDirective.intersectionObserver?.observe(el);
  }

  /**
   * Animates an element when it enters the viewport.
   * Handles stagger if the parent has `[my-motion-stagger]`.
   */
  private static animateEnter(el: HTMLElement): void {
    const animationName = el.getAttribute(ATTR.MOTION);
    if (!animationName) return;

    const animation = resolveAnimation(animationName);
    const opts = parseOptions(el);

    // Check for stagger on parent
    const parent = el.parentElement;
    if (parent?.hasAttribute(ATTR.STAGGER)) {
      const staggerDelay = Number(parent.getAttribute(ATTR.STAGGER) || 80);
      const siblings = Array.from(
        parent.querySelectorAll<HTMLElement>(SELECTOR),
      );
      const index = siblings.indexOf(el);
      if (index > 0) {
        opts.delay =
          (opts.delay ? Number(opts.delay) : 0) + index * staggerDelay;
      }
    }

    // Restore opacity
    el.style.opacity = "";

    Motion.enter(el, animation, { showBefore: false, ...opts });
  }

  /**
   * Sets up hover trigger with enter/leave animations.
   */
  private static setupHoverTrigger(el: HTMLElement): void {
    const enterName = el.getAttribute(ATTR.MOTION);
    const leaveName = el.getAttribute(ATTR.LEAVE);
    if (!enterName) return;

    const enterAnim = resolveAnimation(enterName);
    const leaveAnim = leaveName
      ? resolveAnimation(leaveName)
      : resolveAnimation(enterName); // Reverse same animation if no leave specified
    const opts = parseOptions(el);

    const cleanup = Motion.bindHover(el, enterAnim, leaveAnim, opts);
    MotionDirective.cleanups.set(el, cleanup);
  }

  /**
   * Sets up tap/click trigger.
   */
  private static setupTapTrigger(el: HTMLElement): void {
    const animationName = el.getAttribute(ATTR.MOTION);
    if (!animationName) return;

    const animation = resolveAnimation(animationName);
    const opts = parseOptions(el);

    const cleanup = Motion.bindTap(el, animation, opts);
    MotionDirective.cleanups.set(el, cleanup);
  }
}
