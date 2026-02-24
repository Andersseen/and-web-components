/* ═══════════════════════════════════════════════════════════════════════════
 * @andersseen/motion — MotionController
 *
 * Lightweight, framework-agnostic animation engine that drives the
 * attribute-based CSS animation system defined in core.css.
 *
 * Responsibilities:
 *   • Scan a root element for [and-motion] nodes.
 *   • Wire up IntersectionObserver for "enter" triggers.
 *   • Attach pointer / mouse listeners for "hover" and "tap" triggers.
 *   • Respect `prefers-reduced-motion` at the JS layer.
 *   • Provide a deterministic `destroy()` for SPA unmount (Angular / React).
 *
 * Usage:
 *   const mc = new MotionController(document.body);
 *   // … later, when the host component unmounts:
 *   mc.destroy();
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── Attribute Constants ───────────────────────────────────────────────────

const ATTR = {
  MOTION: "and-motion",
  TRIGGER: "and-motion-trigger",
  DURATION: "and-motion-duration",
  DELAY: "and-motion-delay",
  EASING: "and-motion-easing",
  STATE: "and-motion-state",
  ONCE: "and-motion-once",
} as const;

const STATE_ACTIVE = "active";

// ─── Types ─────────────────────────────────────────────────────────────────

/** Supported trigger modes. */
export type TriggerType = "enter" | "hover" | "tap";

export interface MotionControllerOptions {
  /**
   * Root element to scan for `[and-motion]` children.
   * @default document.body
   */
  root?: HTMLElement;

  /**
   * IntersectionObserver threshold (0 – 1).
   * @default 0.1
   */
  threshold?: number;

  /**
   * IntersectionObserver rootMargin.
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * If `true`, every "enter" animation fires only once and is then unobserved.
   * Individual elements can override this with the `and-motion-once` attribute.
   * @default true
   */
  once?: boolean;
}

// ─── Internals ─────────────────────────────────────────────────────────────

interface ListenerRecord {
  el: HTMLElement;
  type: string;
  handler: EventListener;
}

// ─── Controller ────────────────────────────────────────────────────────────

export class MotionController {
  private readonly root: HTMLElement;
  private readonly once: boolean;
  private readonly prefersReducedMotion: boolean;

  private observer: IntersectionObserver | null = null;
  private listeners: ListenerRecord[] = [];
  private observedElements: Set<HTMLElement> = new Set();
  private destroyed = false;

  constructor(options: MotionControllerOptions = {}) {
    const {
      root = document.body,
      threshold = 0.1,
      rootMargin = "0px",
      once = true,
    } = options;

    this.root = root;
    this.once = once;

    // ── Reduced-motion detection (JS layer, mirrors CSS @media) ──
    this.prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // ── Create shared IntersectionObserver ──
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersections(entries),
      { threshold, rootMargin },
    );

    // ── Scan & wire ──
    this.scan();
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /**
   * Re-scan the root for any newly added `[and-motion]` elements.
   * Safe to call multiple times (idempotent per element).
   */
  scan(): void {
    if (this.destroyed) return;

    const elements = this.root.querySelectorAll<HTMLElement>(
      `[${ATTR.MOTION}]`,
    );

    elements.forEach((el) => this.setupElement(el));
  }

  /**
   * Tear down every observer and event listener.
   * Call this when the host component / page unmounts.
   */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    // Disconnect IntersectionObserver
    this.observer?.disconnect();
    this.observer = null;

    // Remove all event listeners
    for (const { el, type, handler } of this.listeners) {
      el.removeEventListener(type, handler);
    }
    this.listeners = [];
    this.observedElements.clear();
  }

  // ─── Private — Element Setup ─────────────────────────────────────────────

  private setupElement(el: HTMLElement): void {
    // Skip elements already wired
    if (this.observedElements.has(el)) return;
    this.observedElements.add(el);

    const trigger = this.resolveTrigger(el);

    // Forward attribute-level token overrides into CSS custom properties
    this.applyTokenOverrides(el);

    switch (trigger) {
      case "enter":
        this.setupEnterTrigger(el);
        break;
      case "hover":
        this.setupHoverTrigger(el);
        break;
      case "tap":
        this.setupTapTrigger(el);
        break;
    }
  }

  /**
   * Map element attribute overrides → CSS custom properties so the
   * stylesheet can consume them without extra specificity hacks.
   */
  private applyTokenOverrides(el: HTMLElement): void {
    const duration = el.getAttribute(ATTR.DURATION);
    if (duration) el.style.setProperty("--and-motion-duration", duration);

    const delay = el.getAttribute(ATTR.DELAY);
    if (delay) el.style.setProperty("--and-motion-delay", delay);

    const easing = el.getAttribute(ATTR.EASING);
    if (easing) el.style.setProperty("--and-motion-easing", easing);
  }

  private resolveTrigger(el: HTMLElement): TriggerType {
    const raw = el.getAttribute(ATTR.TRIGGER);
    if (raw === "hover" || raw === "tap") return raw;
    return "enter"; // default
  }

  /**
   * Should this element animate only once?
   * Per-element `and-motion-once` overrides the controller-level default.
   */
  private isOnce(el: HTMLElement): boolean {
    const attr = el.getAttribute(ATTR.ONCE);
    if (attr === "false") return false;
    if (attr === "true" || attr === "") return true;
    return this.once;
  }

  // ─── Private — Enter (IntersectionObserver) ──────────────────────────────

  private setupEnterTrigger(el: HTMLElement): void {
    // Set initial hidden state so CSS animation can reveal
    if (!this.prefersReducedMotion) {
      el.style.opacity = "0";
    }

    this.observer?.observe(el);
  }

  private handleIntersections(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;

      if (entry.isIntersecting) {
        this.activate(el);

        if (this.isOnce(el)) {
          // Free memory: no need to keep watching
          this.observer?.unobserve(el);
        }
      } else if (!this.isOnce(el)) {
        // Re-entering triggers require deactivation on exit
        this.deactivate(el);
      }
    }
  }

  // ─── Private — Hover ─────────────────────────────────────────────────────

  private setupHoverTrigger(el: HTMLElement): void {
    const onEnter = () => this.activate(el);
    const onLeave = () => this.deactivate(el);

    this.addListener(el, "mouseenter", onEnter);
    this.addListener(el, "mouseleave", onLeave);
  }

  // ─── Private — Tap ──────────────────────────────────────────────────────

  private setupTapTrigger(el: HTMLElement): void {
    const onDown = () => this.activate(el);
    const onUp = () => this.deactivate(el);

    this.addListener(el, "pointerdown", onDown);
    this.addListener(el, "pointerup", onUp);
    this.addListener(el, "pointercancel", onUp);
    this.addListener(el, "pointerleave", onUp);
  }

  // ─── Private — State Management ──────────────────────────────────────────

  private activate(el: HTMLElement): void {
    el.style.opacity = "";
    el.setAttribute(ATTR.STATE, STATE_ACTIVE);
  }

  private deactivate(el: HTMLElement): void {
    el.removeAttribute(ATTR.STATE);
  }

  // ─── Private — Listener bookkeeping ──────────────────────────────────────

  private addListener(
    el: HTMLElement,
    type: string,
    handler: EventListener,
  ): void {
    el.addEventListener(type, handler);
    this.listeners.push({ el, type, handler });
  }
}
