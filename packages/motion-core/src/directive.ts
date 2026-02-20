import { Motion } from "./motion.js";
import type { MotionOptions } from "./types.js";

/** Attribute names used by the declarative API. */
const ATTR = {
  MOTION: "and-motion",
  TRIGGER: "and-motion-trigger",
  LEAVE: "and-motion-leave",
  DURATION: "and-motion-duration",
  EASING: "and-motion-easing",
  DELAY: "and-motion-delay",
  STAGGER: "and-motion-stagger",
  REPEAT: "and-motion-repeat",
} as const;

/** Supported trigger modes. */
type MotionTrigger = "enter" | "hover" | "tap";

/** Selector for all elements with [and-motion]. */
const SELECTOR = `[${ATTR.MOTION}]`;

/**
 * Maps a short animation name (e.g. `"fade-in"`) to the full CSS class name
 * (e.g. `"motion-fade-in"`). Returns the full class if already prefixed.
 */
function resolveAnimation(name: string): string {
  return name.startsWith("motion-") ? name : `motion-${name}`;
}

/**
 * Reads `and-motion-*` attributes from an element and returns `MotionOptions`.
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
 * Scans the DOM for elements with `[and-motion]` and automatically applies
 * animations based on HTML attributes — zero TypeScript required.
 *
 * @example
 * ```html
 * <!-- Animate on enter (scroll into view) -->
 * <div and-motion="fade-in">Hello</div>
 *
 * <!-- Hover trigger with enter/leave -->
 * <div and-motion="scale-in" and-motion-trigger="hover" and-motion-leave="scale-out">
 *   Card
 * </div>
 *
 * <!-- Tap trigger -->
 * <button and-motion="bounce-in" and-motion-trigger="tap">Click me</button>
 *
 * <!-- Custom options -->
 * <div and-motion="slide-in-left" and-motion-duration="800" and-motion-delay="200">
 *   Delayed slide
 * </div>
 *
 * <!-- Stagger children -->
 * <ul and-motion-stagger="80">
 *   <li and-motion="slide-in-left">Item 1</li>
 *   <li and-motion="slide-in-left">Item 2</li>
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
   * Scans all current `[and-motion]` elements and watches for new ones.
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
          const el = entry.target as HTMLElement;
          const repeat = el.hasAttribute(ATTR.REPEAT);

          if (entry.isIntersecting) {
            if (!repeat) {
              MotionDirective.intersectionObserver?.unobserve(el);
            }
            MotionDirective.animateEnter(el);
          } else if (repeat) {
            // Reset for next entry
            el.style.opacity = "0";
            const animation = resolveAnimation(
              el.getAttribute(ATTR.MOTION) || "",
            );
            if (animation) el.classList.remove(animation);
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
   * Re-scans the DOM for new `[and-motion]` elements.
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
   * Processes a single `[and-motion]` element based on its trigger.
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
   * Handles stagger if the parent has `[and-motion-stagger]`.
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
