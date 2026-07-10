import { listen, setStyles, type ListenerCleanup } from '../utils/dom';
import { SplitterController } from './splitter';
import type { SplitterOptions, SplitterOrientation, SplitterState } from './types';

export interface SplitterInstance {
  readonly container: HTMLElement;
  readonly controller: SplitterController;
  setPosition(position: number): void;
  updateOptions(options: Partial<SplitterOptions>): void;
  destroy(): void;
}

const CONTAINER_CLASS = 'and-splitter-container';
const CONTAINER_HORIZONTAL_CLASS = 'and-splitter-container--horizontal';
const CONTAINER_VERTICAL_CLASS = 'and-splitter-container--vertical';
const CONTAINER_DRAGGING_CLASS = 'and-splitter-container--dragging';
const HANDLE_CLASS = 'and-splitter-handle';
const HANDLE_HORIZONTAL_CLASS = 'and-splitter-handle--horizontal';
const HANDLE_VERTICAL_CLASS = 'and-splitter-handle--vertical';
const HANDLE_DRAGGING_CLASS = 'and-splitter-handle--dragging';
const PANEL_CLASS = 'and-splitter-panel';
const PANEL_PRIMARY_CLASS = 'and-splitter-panel--primary';
const PANEL_SECONDARY_CLASS = 'and-splitter-panel--secondary';

export function createSplitter(container: HTMLElement, options: Partial<SplitterOptions> = {}): SplitterInstance {
  const controller = new SplitterController(options);
  const primaryPanel = container.querySelector<HTMLElement>('[and-splitter-panel="primary"]');
  const secondaryPanel = container.querySelector<HTMLElement>('[and-splitter-panel="secondary"]');
  const handle = container.querySelector<HTMLElement>('[and-splitter-handle]');

  if (!primaryPanel || !secondaryPanel || !handle) {
    throw new Error(
      'and-splitter: container must contain [and-splitter-panel="primary"], ' +
        '[and-splitter-panel="secondary"] and [and-splitter-handle].',
    );
  }

  // Capture as non-null const for closures.
  const splitterHandle = handle;
  const splitterPrimaryPanel = primaryPanel;
  const splitterSecondaryPanel = secondaryPanel;

  let handleCleanups: ListenerCleanup[] = [];
  let documentCleanups: ListenerCleanup[] = [];

  function applyContainerStyles(orientation: SplitterOrientation, isDragging: boolean): void {
    container.classList.add(CONTAINER_CLASS);
    container.classList.toggle(CONTAINER_HORIZONTAL_CLASS, orientation === 'horizontal');
    container.classList.toggle(CONTAINER_VERTICAL_CLASS, orientation === 'vertical');
    container.classList.toggle(CONTAINER_DRAGGING_CLASS, isDragging);

    setStyles(container, {
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    });
  }

  function applyHandleStyles(orientation: SplitterOrientation, isDragging: boolean): void {
    splitterHandle.classList.add(HANDLE_CLASS);
    splitterHandle.classList.toggle(HANDLE_HORIZONTAL_CLASS, orientation === 'horizontal');
    splitterHandle.classList.toggle(HANDLE_VERTICAL_CLASS, orientation === 'vertical');
    splitterHandle.classList.toggle(HANDLE_DRAGGING_CLASS, isDragging);

    setStyles(splitterHandle, {
      flexShrink: '0',
      cursor: orientation === 'horizontal' ? 'col-resize' : 'row-resize',
      userSelect: 'none',
      touchAction: 'none',
    });

    splitterHandle.setAttribute('role', 'separator');
    splitterHandle.setAttribute('tabindex', '0');
    splitterHandle.setAttribute('aria-orientation', orientation);
    // Provide an accessible name when the author has not supplied one.
    if (!splitterHandle.hasAttribute('aria-label') && !splitterHandle.hasAttribute('aria-labelledby')) {
      splitterHandle.setAttribute('aria-label', 'Resize panels');
    }
  }

  function applyPanelStyles(panel: HTMLElement, isPrimary: boolean, position: number): void {
    panel.classList.add(PANEL_CLASS);
    panel.classList.toggle(PANEL_PRIMARY_CLASS, isPrimary);
    panel.classList.toggle(PANEL_SECONDARY_CLASS, !isPrimary);

    const size = isPrimary ? position : 100 - position;
    const isHorizontal = controller.getState().orientation === 'horizontal';

    setStyles(panel, {
      overflow: 'auto',
      flex: 'none',
      width: isHorizontal ? `${size}%` : '100%',
      height: isHorizontal ? '100%' : `${size}%`,
      minWidth: '0',
      minHeight: '0',
      maxWidth: 'none',
      maxHeight: 'none',
      boxSizing: 'border-box',
    });
  }

  function updateAria(state: SplitterState): void {
    const opts = controller.optionsSnapshot;
    splitterHandle.setAttribute('aria-valuemin', String(opts.minSize));
    splitterHandle.setAttribute('aria-valuemax', String(opts.maxSize));
    splitterHandle.setAttribute('aria-valuenow', String(state.position));
  }

  function sync(state: SplitterState): void {
    applyContainerStyles(state.orientation, state.isDragging);
    applyHandleStyles(state.orientation, state.isDragging);
    applyPanelStyles(splitterPrimaryPanel, true, state.position);
    applyPanelStyles(splitterSecondaryPanel, false, state.position);
    updateAria(state);

    container.dispatchEvent(
      new CustomEvent<SplitterState>('and-splitter-change', {
        detail: state,
        bubbles: true,
        composed: true,
      }),
    );
  }

  function updateContainerRect(): void {
    controller.setContainerRect(container.getBoundingClientRect());
  }

  function startDrag(): void {
    updateContainerRect();
    controller.startDragging();
    container.dispatchEvent(new CustomEvent('and-splitter-dragstart', { bubbles: true }));
  }

  function stopDrag(): void {
    controller.stopDragging();
    container.dispatchEvent(new CustomEvent('and-splitter-dragend', { bubbles: true }));
  }

  function onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    startDrag();

    documentCleanups.push(
      listen(document, 'mousemove', e => {
        const newPosition = controller.calculatePositionFromEvent(e.clientX, e.clientY);
        controller.setPosition(newPosition);
      }),
      listen(document, 'mouseup', () => stopDrag()),
    );
  }

  function onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    startDrag();

    documentCleanups.push(
      listen(
        document,
        'touchmove',
        e => {
          const touch = e.touches[0];
          if (touch) {
            const newPosition = controller.calculatePositionFromEvent(touch.clientX, touch.clientY);
            controller.setPosition(newPosition);
          }
        },
        { passive: false },
      ),
      listen(document, 'touchend', () => stopDrag()),
      listen(document, 'touchcancel', () => stopDrag()),
    );
  }

  function onKeyDown(event: KeyboardEvent): void {
    const state = controller.getState();
    const opts = controller.optionsSnapshot;
    const step = opts.step;
    let newPosition = state.position;
    const isHorizontal = state.orientation === 'horizontal';

    switch (event.key) {
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        newPosition -= step;
        break;
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        newPosition += step;
        break;
      case 'Home':
        newPosition = opts.minSize;
        break;
      case 'End':
        newPosition = opts.maxSize;
        break;
      default:
        return;
    }

    event.preventDefault();
    updateContainerRect();
    controller.setPosition(newPosition);
  }

  function removeDocumentListeners(): void {
    documentCleanups.forEach(cleanup => cleanup());
    documentCleanups = [];
  }

  const unsubscribe = controller.subscribe(state => {
    sync(state);
    if (!state.isDragging) {
      removeDocumentListeners();
    }
  });

  handleCleanups.push(
    listen(splitterHandle, 'mousedown', onMouseDown),
    listen(splitterHandle, 'touchstart', onTouchStart, { passive: false }),
    listen(splitterHandle, 'keydown', onKeyDown),
  );

  // Initial sync
  updateContainerRect();
  sync(controller.getState());

  return {
    container,
    controller,
    setPosition(position: number): void {
      controller.setPosition(position);
    },
    updateOptions(options: Partial<SplitterOptions>): void {
      controller.updateOptions(options);
    },
    destroy(): void {
      removeDocumentListeners();
      handleCleanups.forEach(cleanup => cleanup());
      handleCleanups = [];
      unsubscribe();
      container.classList.remove(
        CONTAINER_CLASS,
        CONTAINER_HORIZONTAL_CLASS,
        CONTAINER_VERTICAL_CLASS,
        CONTAINER_DRAGGING_CLASS,
      );
      splitterHandle.classList.remove(
        HANDLE_CLASS,
        HANDLE_HORIZONTAL_CLASS,
        HANDLE_VERTICAL_CLASS,
        HANDLE_DRAGGING_CLASS,
      );
      splitterPrimaryPanel.classList.remove(PANEL_CLASS, PANEL_PRIMARY_CLASS, PANEL_SECONDARY_CLASS);
      splitterSecondaryPanel.classList.remove(PANEL_CLASS, PANEL_PRIMARY_CLASS, PANEL_SECONDARY_CLASS);
    },
  };
}
