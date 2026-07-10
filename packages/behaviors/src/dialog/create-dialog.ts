import { listen, setStyles, type ListenerCleanup } from '../utils/dom';
import { type DialogConfig, type DialogPosition, DEFAULT_DIALOG_CONFIG } from './types';

export interface DialogRef {
  close(): void;
  readonly closed: Promise<void>;
}

// Focusable selector that excludes disabled and explicitly-hidden controls.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
]
  .map(s => `${s}:not([aria-hidden="true"])`)
  .join(', ');

// Track active dialogs globally to handle body scroll locking and Escape key stacking
const openDialogs = new Set<DialogRef>();

export function createDialog(
  content: HTMLElement | HTMLTemplateElement | string,
  options: Partial<DialogConfig> = {},
): DialogRef {
  const resolvedConfig: DialogConfig = { ...DEFAULT_DIALOG_CONFIG, ...options };

  let isClosed = false;
  let resolveClosedPromise: () => void;
  const closed = new Promise<void>(resolve => {
    resolveClosedPromise = resolve;
  });

  const previousActiveElement = document.activeElement as HTMLElement | null;

  // -- Backdrop ----------------------------------------------------------------
  let backdropEl: HTMLElement | null = null;
  if (resolvedConfig.backdrop) {
    backdropEl = document.createElement('div');
    backdropEl.setAttribute('data-and-dialog-backdrop', '');
    setStyles(backdropEl, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.55)',
      zIndex: '9998',
      pointerEvents: 'auto',
    });
    if (resolvedConfig.backdropClass) {
      backdropEl.classList.add(...toClassList(resolvedConfig.backdropClass));
    }
    document.body.appendChild(backdropEl);
  }

  // -- Panel wrapper -----------------------------------------------------------
  const wrapperEl = document.createElement('div');
  wrapperEl.setAttribute('data-and-dialog-wrapper', '');
  setStyles(wrapperEl, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    display: 'flex',
  });
  applyPositionStyles(wrapperEl, resolvedConfig.position);
  document.body.appendChild(wrapperEl);

  // -- Panel element -----------------------------------------------------------
  const panelEl = document.createElement('div');
  panelEl.setAttribute('role', 'dialog');
  panelEl.setAttribute('aria-modal', 'true');
  setStyles(panelEl, {
    pointerEvents: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'auto',
  });
  if (resolvedConfig.width) {
    panelEl.style.width = resolvedConfig.width;
  }
  if (resolvedConfig.height) {
    panelEl.style.height = resolvedConfig.height;
  }
  if (resolvedConfig.panelClass) {
    panelEl.classList.add(...toClassList(resolvedConfig.panelClass));
  }

  // -- Append Content -----------------------------------------------------------
  let originalPlaceholder: Comment | null = null;
  let elementToRestore: HTMLElement | null = null;
  let originalHiddenClass = false;

  if (content instanceof HTMLTemplateElement) {
    const clone = document.importNode(content.content, true);
    panelEl.appendChild(clone);
  } else if (content instanceof HTMLElement) {
    originalPlaceholder = document.createComment('and-dialog-placeholder');
    content.parentNode?.replaceChild(originalPlaceholder, content);
    elementToRestore = content;
    const originalDisplay = content.style.display;
    if (originalDisplay === 'none') {
      content.style.display = '';
    }
    // Tailwind/common utility classes hide the source element in the page.
    originalHiddenClass = content.classList.contains('hidden');
    if (originalHiddenClass) {
      content.classList.remove('hidden');
    }
    panelEl.appendChild(content);
  } else if (typeof content === 'string') {
    panelEl.innerHTML = content;
  }

  wrapperEl.appendChild(panelEl);

  // -- Focus Management -------------------------------------------------------
  focusFirstFocusable(panelEl);

  // -- Scroll Lock -------------------------------------------------------------
  if (openDialogs.size === 0) {
    document.body.style.overflow = 'hidden';
  }

  // -- Event Listeners --------------------------------------------------------
  let cleanups: ListenerCleanup[] = [];

  const ref: DialogRef = {
    close() {
      if (isClosed) {
        return;
      }
      isClosed = true;

      // Remove from stack
      openDialogs.delete(ref);

      // Cleanup event listeners
      cleanups.forEach(cleanup => cleanup());
      cleanups = [];

      // Remove DOM elements
      backdropEl?.remove();
      wrapperEl.remove();

      // Restore element if it was temporarily reparented
      if (elementToRestore && originalPlaceholder) {
        if (originalHiddenClass) {
          elementToRestore.classList.add('hidden');
        }
        originalPlaceholder.parentNode?.replaceChild(elementToRestore, originalPlaceholder);
      }

      // Restore body overflow if no dialogs left
      if (openDialogs.size === 0) {
        document.body.style.overflow = '';
      }

      // Restore focus
      previousActiveElement?.focus();

      // Resolve closed Promise
      resolveClosedPromise();
    },
    closed,
  };

  openDialogs.add(ref);

  // Auto-wire any close buttons
  panelEl.querySelectorAll('[and-dialog-close]').forEach(closeBtn => {
    cleanups.push(listen(closeBtn, 'click', () => ref.close()));
  });

  if (resolvedConfig.closeOnBackdropClick && backdropEl) {
    cleanups.push(listen(backdropEl, 'click', () => ref.close(), { once: true }));
  }

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      if (!resolvedConfig.closeOnEscape) {
        return;
      }
      // Close top-most dialog only
      const dialogs = Array.from(openDialogs);
      if (dialogs[dialogs.length - 1] === ref) {
        ref.close();
      }
      return;
    }
    if (event.key === 'Tab') {
      trapFocus(panelEl, event);
    }
  };

  cleanups.push(listen(document, 'keydown', onKeyDown));

  return ref;
}

function applyPositionStyles(el: HTMLElement, position: DialogPosition): void {
  const s = el.style;
  switch (position) {
    case 'center':
      s.alignItems = 'center';
      s.justifyContent = 'center';
      break;
    case 'left':
      s.alignItems = 'stretch';
      s.justifyContent = 'flex-start';
      break;
    case 'right':
      s.alignItems = 'stretch';
      s.justifyContent = 'flex-end';
      break;
    case 'top':
      s.flexDirection = 'column';
      s.alignItems = 'stretch';
      s.justifyContent = 'flex-start';
      break;
    case 'bottom':
      s.flexDirection = 'column';
      s.alignItems = 'stretch';
      s.justifyContent = 'flex-end';
      break;
  }
}

function toClassList(value: string | string[]): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(c => c.split(/\s+/).filter(Boolean));
  }
  return value.split(/\s+/).filter(Boolean);
}

function focusFirstFocusable(panel: HTMLElement): void {
  const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  first?.focus();
}

function trapFocus(panel: HTMLElement, event: KeyboardEvent): void {
  const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  if (focusable.length === 0) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }
}
