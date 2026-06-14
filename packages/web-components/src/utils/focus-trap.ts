/**
 * Focus-trap utilities for modal/dialog/drawer components.
 *
 * Works inside Shadow DOM by searching the host's shadow root.
 */

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Return all visible, focusable elements inside the given root.
 */
export function getFocusableElements(root: HTMLElement | ShadowRoot): HTMLElement[] {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el): el is HTMLElement => {
    const htmlEl = el as HTMLElement;
    return (
      htmlEl.offsetParent !== null && !htmlEl.hasAttribute('disabled') && htmlEl.getAttribute('aria-hidden') !== 'true'
    );
  });
}

/**
 * Focus the first focusable element inside the root.
 * Returns whether a focusable element was found.
 */
export function focusFirst(root: HTMLElement | ShadowRoot): boolean {
  const focusable = getFocusableElements(root);
  if (focusable.length > 0) {
    focusable[0].focus();
    return true;
  }
  return false;
}

/**
 * Keep Tab / Shift+Tab inside the focus trap.
 * Call this from the root element's keydown listener.
 */
export function handleTabInFocusTrap(event: KeyboardEvent, root: HTMLElement | ShadowRoot): void {
  if (event.key !== 'Tab') {
    return;
  }

  const focusable = getFocusableElements(root);
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active =
    root.getRootNode() instanceof ShadowRoot
      ? (root.getRootNode() as ShadowRoot).activeElement
      : document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
