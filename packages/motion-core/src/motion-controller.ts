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
  MOTION: 'and-motion',
  TRIGGER: 'and-motion-trigger',
  DURATION: 'and-motion-duration',
  DELAY: 'and-motion-delay',
  EASING: 'and-motion-easing',
  STATE: 'and-motion-state',
  ONCE: 'and-motion-once',
} as const;

const STATE_ACTIVE = 'active';

// ─── Types ─────────────────────────────────────────────────────────────────

/** Supported trigger modes. */
export type TriggerType = 'enter' | 'hover' | 'tap';

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
  private readonly root: HTMLElement | null;
  private readonly once: boolean;
  private prefersReducedMotion: boolean;

  private observer: IntersectionObserver | null = null;
  private listeners: ListenerRecord[] = [];
  private observedElements: Set<HTMLElement> = new Set();
  private destroyed = false;
  private motionQuery: MediaQueryList | null = null;
  private motionQueryListener: ((event: MediaQueryListEvent) => void) | null = null;

  constructor(options: MotionControllerOptions = {}) {
    const { threshold = 0.1, rootMargin = '0px', once = true } = options;

    this.once = once;

    // ── Server-safe bail-out ──
    // `document.body` and `IntersectionObserver` don't exist during SSR
    // (Astro, Next, an Angular server build). Construct inert rather than
    // throwing, so calling code doesn't have to branch on the environment.
    if (typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') {
      this.root = null;
      this.prefersReducedMotion = true;
      this.destroyed = true;
      return;
    }

    this.root = options.root ?? document.body;

    // ── Reduced-motion detection (JS layer, mirrors CSS @media) ──
    // Tracked live: the CSS layer reacts to the user flipping the OS setting
    // mid-session, and this one used to be read once in the constructor and
    // never updated, so the two layers could disagree.
    this.motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    this.prefersReducedMotion = this.motionQuery?.matches ?? false;
    if (this.motionQuery) {
      this.motionQueryListener = event => {
        this.prefersReducedMotion = event.matches;
      };
      this.motionQuery.addEventListener('change', this.motionQueryListener);
    }

    // ── Create shared IntersectionObserver ──
    this.observer = new IntersectionObserver(entries => this.handleIntersections(entries), { threshold, rootMargin });

    // ── Scan & wire ──
    this.scan();
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /**
   * Re-scan the root for any newly added `[and-motion]` elements.
   * Safe to call multiple times (idempotent per element).
   */
  scan(): void {
    if (this.destroyed || !this.root) {
      return;
    }

    const elements = this.root.querySelectorAll<HTMLElement>(`[${ATTR.MOTION}]`);

    elements.forEach(el => this.setupElement(el));
  }

  /**
   * Tear down every observer and event listener.
   * Call this when the host component / page unmounts.
   */
  destroy(): void {
    if (this.destroyed) {
      return;
    }
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

    // Stop tracking the reduced-motion media query
    if (this.motionQuery && this.motionQueryListener) {
      this.motionQuery.removeEventListener('change', this.motionQueryListener);
    }
    this.motionQuery = null;
    this.motionQueryListener = null;
  }

  // ─── Private — Element Setup ─────────────────────────────────────────────

  private setupElement(el: HTMLElement): void {
    // Skip elements already wired
    if (this.observedElements.has(el)) {
      return;
    }
    this.observedElements.add(el);

    const trigger = this.resolveTrigger(el);

    // Forward attribute-level token overrides into CSS custom properties
    this.applyTokenOverrides(el);

    switch (trigger) {
      case 'enter':
        this.setupEnterTrigger(el);
        break;
      case 'hover':
        this.setupHoverTrigger(el);
        break;
      case 'tap':
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
    if (duration) {
      el.style.setProperty('--and-motion-duration', duration);
    }

    const delay = el.getAttribute(ATTR.DELAY);
    if (delay) {
      el.style.setProperty('--and-motion-delay', delay);
    }

    const easing = el.getAttribute(ATTR.EASING);
    if (easing) {
      el.style.setProperty('--and-motion-easing', easing);
    }
  }

  private resolveTrigger(el: HTMLElement): TriggerType {
    const raw = el.getAttribute(ATTR.TRIGGER);
    if (raw === 'hover' || raw === 'tap') {
      return raw;
    }
    if (raw === 'enter') {
      return 'enter';
    }

    // Shortcut inference: names with "-in" default to enter trigger
    const name = el.getAttribute(ATTR.MOTION) ?? '';
    if (/-in(?:-|$)/.test(name)) {
      return 'enter';
    }

    return 'enter'; // default
  }

  /**
   * Should this element animate only once?
   * Per-element `and-motion-once` overrides the controller-level default.
   */
  private isOnce(el: HTMLElement): boolean {
    const attr = el.getAttribute(ATTR.ONCE);
    if (attr === 'false') {
      return false;
    }
    if (attr === 'true' || attr === '') {
      return true;
    }
    return this.once;
  }

  // ─── Private — Enter (IntersectionObserver) ──────────────────────────────

  private setupEnterTrigger(el: HTMLElement): void {
    // Set initial hidden state so CSS animation can reveal
    if (!this.prefersReducedMotion) {
      el.style.opacity = '0';
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

    this.addListener(el, 'mouseenter', onEnter);
    this.addListener(el, 'mouseleave', onLeave);
  }

  // ─── Private — Tap ──────────────────────────────────────────────────────

  private setupTapTrigger(el: HTMLElement): void {
    const onDown = () => this.activate(el);
    const onUp = () => this.deactivate(el);

    this.addListener(el, 'pointerdown', onDown);
    this.addListener(el, 'pointerup', onUp);
    this.addListener(el, 'pointercancel', onUp);
    this.addListener(el, 'pointerleave', onUp);
  }

  // ─── Private — State Management ──────────────────────────────────────────

  private activate(el: HTMLElement): void {
    el.style.opacity = '';
    el.setAttribute(ATTR.STATE, STATE_ACTIVE);
  }

  private deactivate(el: HTMLElement): void {
    el.removeAttribute(ATTR.STATE);
  }

  // ─── Private — Listener bookkeeping ──────────────────────────────────────

  private addListener(el: HTMLElement, type: string, handler: EventListener): void {
    el.addEventListener(type, handler);
    this.listeners.push({ el, type, handler });
  }
}
