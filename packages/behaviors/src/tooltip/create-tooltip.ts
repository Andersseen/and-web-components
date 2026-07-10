import { listen, setStyles, type ListenerCleanup } from '../utils/dom';
import { calculatePosition } from '../utils/position';
import { type TooltipConfig, DEFAULT_TOOLTIP_CONFIG } from './types';

export interface TooltipInstance {
  readonly element: HTMLElement;
  show(): void;
  hide(): void;
  updateOptions(options: Partial<TooltipConfig>): void;
  destroy(): void;
}

let tooltipIdCounter = 0;

export function createTooltip(element: HTMLElement, options: Partial<TooltipConfig> = {}): TooltipInstance {
  let config: TooltipConfig = { ...DEFAULT_TOOLTIP_CONFIG, ...options };

  let tooltipEl: HTMLElement | null = null;
  let showTimer: number | null = null;
  let hideTimer: number | null = null;
  let isHoveringTooltip = false;

  let elementCleanups: ListenerCleanup[] = [];
  let tooltipCleanups: ListenerCleanup[] = [];
  let scrollCleanups: ListenerCleanup[] = [];

  function isVisible(): boolean {
    return tooltipEl !== null;
  }

  function clearShowTimer(): void {
    if (showTimer !== null) {
      clearTimeout(showTimer);
      showTimer = null;
    }
  }

  function clearHideTimer(): void {
    if (hideTimer !== null) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function generateId(): string {
    tooltipIdCounter += 1;
    return `and-tooltip-${tooltipIdCounter}`;
  }

  function attachScrollListeners(): void {
    detachScrollListeners();
    const onScroll = (): void => {
      destroyTooltip();
    };

    const parents = getScrollParents(element);
    for (const parent of parents) {
      scrollCleanups.push(listen(parent, 'scroll', onScroll, { passive: true }));
    }
  }

  function detachScrollListeners(): void {
    scrollCleanups.forEach(cleanup => cleanup());
    scrollCleanups = [];
  }

  function createTextElement(text: string): HTMLElement {
    const el = document.createElement('div');
    el.textContent = text;
    el.className = 'and-tooltip';
    el.setAttribute('role', 'tooltip');
    setStyles(el, {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '9999',
      pointerEvents: config.interactive ? 'auto' : 'none',
    });
    document.body.appendChild(el);
    return el;
  }

  function render(): void {
    if (!config.content) {
      return;
    }
    destroyTooltip();

    tooltipEl = createTextElement(config.content);
    const id = generateId();
    tooltipEl.id = id;
    element.setAttribute('aria-describedby', id);

    // Position the element in a requestAnimationFrame to allow layout pass to complete
    requestAnimationFrame(() => {
      if (!tooltipEl) {
        return;
      }
      const anchorRect = element.getBoundingClientRect();
      const pos = calculatePosition(anchorRect, tooltipEl, config.placement, config.offset, true);
      setStyles(tooltipEl, {
        transform: `translate(${pos.left}px, ${pos.top}px)`,
      });
    });

    attachScrollListeners();

    if (config.interactive) {
      tooltipCleanups.push(
        listen(tooltipEl, 'mouseenter', () => {
          isHoveringTooltip = true;
          clearHideTimer();
        }),
        listen(tooltipEl, 'mouseleave', () => {
          isHoveringTooltip = false;
          hide();
        }),
      );
    }
  }

  function destroyTooltip(): void {
    tooltipCleanups.forEach(cleanup => cleanup());
    tooltipCleanups = [];
    detachScrollListeners();

    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }

    element.removeAttribute('aria-describedby');
    isHoveringTooltip = false;
  }

  function show(): void {
    if (config.disabled) {
      return;
    }
    clearHideTimer();
    if (isVisible()) {
      return;
    }

    showTimer = window.setTimeout(() => {
      render();
    }, config.showDelay);
  }

  function hide(): void {
    clearShowTimer();
    if (!isVisible()) {
      return;
    }

    const delay = config.interactive && isHoveringTooltip ? 200 : config.hideDelay;

    hideTimer = window.setTimeout(() => {
      if (config.interactive && isHoveringTooltip) {
        return;
      }
      destroyTooltip();
    }, delay);
  }

  // Dismiss on Escape without moving the pointer (WCAG 1.4.13 Content on Hover or Focus).
  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && (isVisible() || showTimer !== null)) {
      clearShowTimer();
      clearHideTimer();
      destroyTooltip();
    }
  }

  // Setup DOM event listeners on the trigger element
  elementCleanups.push(
    listen(element, 'mouseenter', show),
    listen(element, 'mouseleave', hide),
    listen(element, 'focus', show),
    listen(element, 'blur', hide),
    listen(element, 'keydown', onKeyDown),
  );

  return {
    element,
    show,
    hide,
    updateOptions(options: Partial<TooltipConfig>): void {
      config = { ...config, ...options };
      if (config.disabled) {
        destroyTooltip();
      } else if (isVisible()) {
        render();
      }
    },
    destroy(): void {
      clearShowTimer();
      clearHideTimer();
      destroyTooltip();
      elementCleanups.forEach(cleanup => cleanup());
      elementCleanups = [];
    },
  };
}

function getScrollParents(el: HTMLElement): (Element | Document)[] {
  const parents: (Element | Document)[] = [];
  let current: Element | null = el.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (!style) {
      break;
    }

    const { overflow, overflowX, overflowY } = style;
    if (/auto|scroll|overlay/.test(overflow + overflowX + overflowY)) {
      parents.push(current);
    }
    current = current.parentElement;
  }

  parents.push(document);
  return parents;
}
