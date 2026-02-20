const ATTR = {
  MOTION: "data-and-motion",
  TRIGGER: "data-and-motion-trigger",
  DURATION: "data-and-motion-duration",
  DELAY: "data-and-motion-delay",
  STATE: "data-and-motion-state",
} as const;

type TriggerType = "enter" | "leave" | "hover" | "tap";

/**
 * Initializes the motion library.
 * Scans for elements with `data-and-motion` and sets up the appropriate triggers.
 *
 * @param root - The root element to scan (defaults to document.body).
 * @returns A cleanup function to disconnect observers and remove event listeners.
 */
export function initMotion(root: HTMLElement = document.body) {
  const elements = root.querySelectorAll<HTMLElement>(`[${ATTR.MOTION}]`);
  const cleanups: (() => void)[] = [];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      const trigger = (el.getAttribute(ATTR.TRIGGER) || "enter") as TriggerType;

      if (trigger === "enter") {
        if (entry.isIntersecting) {
          el.setAttribute(ATTR.STATE, "active");
        } else {
          el.removeAttribute(ATTR.STATE);
        }
      } else if (trigger === "leave") {
         if (!entry.isIntersecting) {
            el.setAttribute(ATTR.STATE, "active");
         } else {
            el.removeAttribute(ATTR.STATE);
         }
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    const trigger = (el.getAttribute(ATTR.TRIGGER) || "enter") as TriggerType;

    // Apply options
    const duration = el.getAttribute(ATTR.DURATION);
    if (duration) el.style.setProperty("--and-motion-duration", duration);

    const delay = el.getAttribute(ATTR.DELAY);
    if (delay) el.style.setProperty("--and-motion-delay", delay);

    // Setup triggers
    if (trigger === "enter") {
      // Hide initially for enter animations
      el.style.opacity = "0";
      observer.observe(el);
    } else if (trigger === "leave") {
      observer.observe(el);
    } else if (trigger === "hover") {
      const onEnter = () => el.setAttribute(ATTR.STATE, "active");
      const onLeave = () => el.removeAttribute(ATTR.STATE);

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    } else if (trigger === "tap") {
      const onDown = () => el.setAttribute(ATTR.STATE, "active");
      const onUp = () => el.removeAttribute(ATTR.STATE);

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      el.addEventListener("pointerleave", onUp);

      cleanups.push(() => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("pointerleave", onUp);
      });
    }
  });

  return () => {
    observer.disconnect();
    cleanups.forEach(fn => fn());
  };
}
