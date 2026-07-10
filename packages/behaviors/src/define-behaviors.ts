import { createDraggable } from './drag-drop/create-draggable';
import { createDropZone } from './drag-drop/create-drop-zone';
import { createSplitter } from './splitter/create-splitter';
import type { SplitterOrientation } from './splitter/types';
import { createTooltip } from './tooltip/create-tooltip';
import type { TooltipPlacement } from './tooltip/types';
import { createDialog } from './dialog/create-dialog';
import type { DialogPosition } from './dialog/types';
import { listen } from './utils/dom';

export interface DefineBehaviorsOptions {
  /** Root element to scan. Defaults to `document.body`. */
  root?: HTMLElement;
  /** Whether to watch for newly added elements and initialize them automatically. */
  observe?: boolean;
}

interface BehaviorInstance {
  destroy(): void;
}

function parseNumber(value: string | null, fallback: number): number {
  if (value === null) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseList(value: string | null): string[] | undefined {
  if (value === null) {
    return undefined;
  }
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function initSplitters(root: HTMLElement, instances: BehaviorInstance[]): void {
  root.querySelectorAll<HTMLElement>('[and-splitter]').forEach(container => {
    const orientation = (container.getAttribute('and-splitter') as SplitterOrientation) || 'horizontal';

    instances.push(
      createSplitter(container, {
        orientation,
        minSize: parseNumber(container.getAttribute('and-splitter-min'), 0),
        maxSize: parseNumber(container.getAttribute('and-splitter-max'), 100),
        step: parseNumber(container.getAttribute('and-splitter-step'), 1),
        defaultPosition: parseNumber(container.getAttribute('and-splitter-default-position'), 50),
      }),
    );
  });
}

function initDraggables(root: HTMLElement, instances: BehaviorInstance[]): void {
  root.querySelectorAll<HTMLElement>('[and-draggable]').forEach(element => {
    instances.push(
      createDraggable(element, {
        data: element.getAttribute('and-draggable-data') ?? undefined,
        handle: element.getAttribute('and-draggable-handle') ?? undefined,
        disabled: element.hasAttribute('and-draggable-disabled'),
      }),
    );
  });
}

function initDropZones(root: HTMLElement, instances: BehaviorInstance[]): void {
  root.querySelectorAll<HTMLElement>('[and-drop-zone]').forEach(element => {
    const instance = createDropZone(element, {
      accept: parseList(element.getAttribute('and-drop-zone-accept')),
      sortable: element.hasAttribute('and-drop-zone-sortable'),
      disabled: element.hasAttribute('and-drop-zone-disabled'),
    });

    // Auto-reorder sortable drop zones out of the box.
    if (element.hasAttribute('and-drop-zone-sortable')) {
      element.addEventListener('and-drop', event => {
        const detail = (event as CustomEvent).detail;
        if (!detail.source || !detail.target || detail.index === undefined) {
          return;
        }

        const children = Array.from(detail.target.children);
        const before = children[detail.index];
        if (before && before !== detail.source) {
          detail.target.insertBefore(detail.source, before);
        } else if (!before) {
          detail.target.appendChild(detail.source);
        }
      });
    }

    instances.push(instance);
  });
}

function initTooltips(root: HTMLElement, instances: BehaviorInstance[]): void {
  root.querySelectorAll<HTMLElement>('[and-tooltip]').forEach(element => {
    const content = element.getAttribute('and-tooltip') || '';
    const placement = (element.getAttribute('and-tooltip-placement') as TooltipPlacement) || 'top';
    const showDelay = parseNumber(
      element.getAttribute('and-tooltip-delay') || element.getAttribute('and-tooltip-show-delay'),
      200,
    );
    const hideDelay = parseNumber(element.getAttribute('and-tooltip-hide-delay'), 0);
    const offset = parseNumber(element.getAttribute('and-tooltip-offset'), 8);
    const disabled = element.hasAttribute('and-tooltip-disabled');
    const interactive = element.hasAttribute('and-tooltip-interactive');

    instances.push(
      createTooltip(element, {
        content,
        placement,
        showDelay,
        hideDelay,
        offset,
        disabled,
        interactive,
      }),
    );
  });
}

function initDialogs(root: HTMLElement, instances: BehaviorInstance[]): void {
  root.querySelectorAll<HTMLElement>('[and-dialog-trigger]').forEach(trigger => {
    const targetId = trigger.getAttribute('and-dialog-trigger');
    if (!targetId) {
      return;
    }

    const cleanup = listen(trigger, 'click', () => {
      const targetEl = document.getElementById(targetId);
      if (!targetEl) {
        return;
      }

      const position = (trigger.getAttribute('and-dialog-position') ||
        targetEl.getAttribute('and-dialog-position') ||
        'center') as DialogPosition;
      const backdrop =
        trigger.getAttribute('and-dialog-backdrop') !== 'false' &&
        targetEl.getAttribute('and-dialog-backdrop') !== 'false';
      const closeOnBackdropClick =
        trigger.getAttribute('and-dialog-close-on-backdrop') !== 'false' &&
        targetEl.getAttribute('and-dialog-close-on-backdrop') !== 'false';
      const closeOnEscape =
        trigger.getAttribute('and-dialog-close-on-escape') !== 'false' &&
        targetEl.getAttribute('and-dialog-close-on-escape') !== 'false';
      const width = trigger.getAttribute('and-dialog-width') || targetEl.getAttribute('and-dialog-width') || undefined;
      const height =
        trigger.getAttribute('and-dialog-height') || targetEl.getAttribute('and-dialog-height') || undefined;
      const panelClass =
        trigger.getAttribute('and-dialog-panel-class') || targetEl.getAttribute('and-dialog-panel-class') || undefined;
      const backdropClass =
        trigger.getAttribute('and-dialog-backdrop-class') ||
        targetEl.getAttribute('and-dialog-backdrop-class') ||
        undefined;

      createDialog(targetEl, {
        position,
        backdrop,
        closeOnBackdropClick,
        closeOnEscape,
        width,
        height,
        panelClass,
        backdropClass,
      });
    });

    instances.push({ destroy: cleanup });
  });
}

/**
 * Scans the DOM for `[and-*]` attributes and wires up Andersseen behaviors.
 * Returns a cleanup function that destroys all created instances.
 */
export function defineBehaviors(options: DefineBehaviorsOptions = {}): () => void {
  const root = options.root ?? document.body;
  const instances: BehaviorInstance[] = [];

  initSplitters(root, instances);
  initDraggables(root, instances);
  initDropZones(root, instances);
  initTooltips(root, instances);
  initDialogs(root, instances);

  let observer: MutationObserver | null = null;

  if (options.observe) {
    observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            initSplitters(node, instances);
            initDraggables(node, instances);
            initDropZones(node, instances);
            initTooltips(node, instances);
            initDialogs(node, instances);
          }
        }
      }
    });

    observer.observe(root, { childList: true, subtree: true });
  }

  return () => {
    instances.forEach(instance => instance.destroy());
    instances.length = 0;
    observer?.disconnect();
    observer = null;
  };
}
