/**
 * Page-level side effects shared by modal overlays (modal, drawer):
 * body scroll lock and making the rest of the page inert.
 *
 * Both are reference-counted / self-restoring so that nested or
 * simultaneously-open overlays don't clobber each other's cleanup —
 * the naive `document.body.style.overflow = ''` on close leaks a
 * scrollable body as soon as a second overlay is involved.
 */

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

/**
 * Prevent the page behind an overlay from scrolling. Compensates for the
 * disappearing scrollbar so the page doesn't shift horizontally.
 */
export function lockBodyScroll(): void {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }
  if (lockCount++ > 0) {
    return;
  }

  const body = document.body;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  if (typeof window !== 'undefined' && typeof getComputedStyle === 'function') {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbarWidth}px`;
    }
  }

  body.style.overflow = 'hidden';
}

/** Release one scroll lock. The body is only restored by the last release. */
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

/**
 * Mark everything outside `el` as `inert`, so the page behind a modal is
 * neither clickable nor reachable by assistive technology — the part
 * `aria-modal="true"` alone does not guarantee.
 *
 * Walks up to `<body>` inerting siblings at each level, rather than only
 * inerting body children, so it still works when the overlay is mounted
 * deep inside an app root.
 *
 * @returns a function that undoes exactly what this call changed.
 */
export function setBackgroundInert(el: Element): () => void {
  if (typeof document === 'undefined' || !document.body) {
    return () => undefined;
  }

  const changed: Element[] = [];
  let node: Element | null = el;

  while (node && node !== document.body && node.parentElement) {
    for (const sibling of Array.from(node.parentElement.children)) {
      // Skip anything already inert — it belongs to another overlay, and
      // clearing it here would resurrect the page behind that one.
      if (sibling === node || sibling.hasAttribute('inert')) {
        continue;
      }
      sibling.setAttribute('inert', '');
      changed.push(sibling);
    }
    node = node.parentElement;
  }

  return () => {
    for (const sibling of changed) {
      sibling.removeAttribute('inert');
    }
    changed.length = 0;
  };
}
