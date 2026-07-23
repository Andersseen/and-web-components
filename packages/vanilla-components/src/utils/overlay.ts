/**
 * Minimal focus-trap and body-scroll-lock helpers for the vanilla overlays.
 *
 * Deliberately local and dependency-free: this package's hard rule is zero
 * production dependencies, so it cannot reach for `@andersseen/behaviors`.
 * These components render in light DOM only, so no shadow-tree traversal is
 * needed — the far more involved composed-tree walk lives in
 * `@andersseen/web-components`.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex^="-"])',
].join(',');

export function getFocusable(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    el => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/** Focus the first focusable descendant, preferring `[autofocus]`. */
export function focusFirst(root: HTMLElement): boolean {
  const focusable = getFocusable(root);
  if (focusable.length === 0) {
    root.focus();
    return false;
  }
  (focusable.find(el => el.hasAttribute('autofocus')) ?? focusable[0]).focus();
  return true;
}

/** Keep Tab / Shift+Tab cycling inside `root`. */
export function trapTab(event: KeyboardEvent, root: HTMLElement): void {
  if (event.key !== 'Tab') {
    return;
  }
  const focusable = getFocusable(root);
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (!active || !root.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return;
  }
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ── Body scroll lock (reference-counted) ───────────────────────────── */

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

export function lockBodyScroll(): void {
  if (typeof document === 'undefined' || !document.body || lockCount++ > 0) {
    return;
  }
  const body = document.body;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
  }
  body.style.overflow = 'hidden';
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined' || !document.body || lockCount === 0) {
    return;
  }
  if (--lockCount > 0) {
    return;
  }
  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
}
