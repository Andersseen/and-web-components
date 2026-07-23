/**
 * Focus-trap utilities for modal/dialog/drawer components.
 *
 * These walk the **composed** tree, not just one shadow root. That matters:
 * an overlay's own chrome (close button) lives in its shadow root, but the
 * content the consumer actually cares about arrives through a `<slot>` and
 * lives in the light DOM — and any `<and-button>`/`<and-input>` in there
 * keeps its focusable element inside *its own* shadow root. A plain
 * `shadowRoot.querySelectorAll()` sees none of that, which silently reduces
 * the trap to "the close button" and lets Shift+Tab escape the dialog.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

/**
 * Hidden-ness check that deliberately avoids geometry (`offsetParent`,
 * `getClientRects`): `offsetParent` is null for `position: fixed` elements —
 * which is exactly what an overlay's content is — and no geometry is
 * available at all under Stencil's mock-doc, where the spec tests run.
 */
function isHidden(el: HTMLElement): boolean {
  if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') {
    return true;
  }
  if (el.hasAttribute('inert')) {
    return true;
  }
  if (typeof getComputedStyle !== 'function') {
    return false;
  }
  const style = getComputedStyle(el);
  return style.display === 'none' || style.visibility === 'hidden';
}

function isFocusable(el: HTMLElement): boolean {
  if (!el.matches?.(FOCUSABLE_SELECTOR)) {
    return false;
  }
  if (el.hasAttribute('disabled')) {
    return false;
  }
  // tabindex="-1" is focusable programmatically but must not be a Tab stop.
  const tabindex = el.getAttribute('tabindex');
  if (tabindex !== null && Number(tabindex) < 0) {
    return false;
  }
  return true;
}

function walk(node: ParentNode, out: HTMLElement[], seen: Set<Node>): void {
  for (const child of Array.from(node.children) as HTMLElement[]) {
    if (seen.has(child)) {
      continue;
    }
    seen.add(child);

    if (child.localName === 'slot') {
      // Follow the slot to whatever light-DOM content was assigned to it,
      // so slotted dialog content participates in the trap.
      const assigned = (child as HTMLSlotElement).assignedElements?.({ flatten: true }) ?? [];
      for (const el of assigned as HTMLElement[]) {
        if (seen.has(el)) {
          continue;
        }
        seen.add(el);
        visit(el, out, seen);
      }
      continue;
    }

    visit(child, out, seen);
  }
}

function visit(el: HTMLElement, out: HTMLElement[], seen: Set<Node>): void {
  // A hidden subtree contains nothing tabbable, so don't descend into it.
  if (isHidden(el)) {
    return;
  }
  if (isFocusable(el)) {
    out.push(el);
  }
  if (el.shadowRoot) {
    // Shadow host: its light children are only reachable through the slots
    // inside the shadow root, so walking the shadow root alone is correct.
    walk(el.shadowRoot, out, seen);
    return;
  }
  walk(el, out, seen);
}

/**
 * Return all visible, tabbable elements inside the given root, descending
 * through nested shadow roots and slotted light-DOM content.
 */
export function getFocusableElements(root: HTMLElement | ShadowRoot): HTMLElement[] {
  const out: HTMLElement[] = [];
  walk(root, out, new Set());
  return out;
}

/**
 * The innermost active element, drilling through shadow roots.
 *
 * `document.activeElement` only ever reports the outermost host, so a
 * component using `delegatesFocus` (like `and-button`) would otherwise never
 * compare equal to the inner element the trap is tracking.
 */
export function getDeepActiveElement(): Element | null {
  let active: Element | null = typeof document !== 'undefined' ? document.activeElement : null;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/**
 * Focus the first focusable element inside the root, preferring an element
 * marked `autofocus`. Returns whether anything was focused.
 */
export function focusFirst(root: HTMLElement | ShadowRoot): boolean {
  const focusable = getFocusableElements(root);
  if (focusable.length === 0) {
    return false;
  }
  const target = focusable.find(el => el.hasAttribute('autofocus')) ?? focusable[0];
  target.focus();
  return true;
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
  const active = getDeepActiveElement();
  const index = active ? focusable.indexOf(active as HTMLElement) : -1;

  if (index === -1) {
    // Focus is somewhere outside the trap (or on the dialog container
    // itself) — pull it back to the appropriate edge.
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
