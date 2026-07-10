import { listen, setStyles, type ListenerCleanup } from '../utils/dom';
import { startDrag, endDrag, getDragState } from './drag-state';
import type { DragDropConfig, AndDragInfo, AndDragEndInfo } from './types';

export interface DraggableInstance {
  readonly element: HTMLElement;
  updateConfig(config: DragDropConfig): void;
  destroy(): void;
}

const DRAGGABLE_CLASS = 'and-draggable';
const DRAGGING_CLASS = 'and-dragging';
const DISABLED_CLASS = 'and-disabled';

export function createDraggable(element: HTMLElement, config: DragDropConfig = {}): DraggableInstance {
  let currentConfig: DragDropConfig = { ...config };
  let dragImage: HTMLElement | null = null;
  let cleanups: ListenerCleanup[] = [];

  function applyAttributes(): void {
    const disabled = !!currentConfig.disabled;
    element.setAttribute('draggable', String(!disabled));
    element.classList.add(DRAGGABLE_CLASS);
    element.classList.toggle(DISABLED_CLASS, disabled);

    setStyles(element, {
      cursor: disabled ? 'not-allowed' : 'grab',
    });

    element.setAttribute('aria-grabbed', 'false');
  }

  function createDragImage(original: HTMLElement): HTMLElement {
    if (dragImage) {
      dragImage.remove();
    }

    dragImage = original.cloneNode(true) as HTMLElement;
    dragImage.removeAttribute('id');
    dragImage.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

    setStyles(dragImage, {
      position: 'fixed',
      top: '-1000px',
      opacity: '0.9',
      transform: 'rotate(3deg)',
      pointerEvents: 'none',
      zIndex: '9999',
      width: `${original.offsetWidth}px`,
    });

    document.body.appendChild(dragImage);
    return dragImage;
  }

  function removeDragImage(): void {
    if (dragImage) {
      dragImage.remove();
      dragImage = null;
    }
  }

  function isAllowedHandle(event: DragEvent): boolean {
    const selector = currentConfig.handle;
    if (!selector) {
      return true;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return false;
    }

    const handle = target.closest(selector);
    return !!handle && element.contains(handle);
  }

  function onDragStart(event: DragEvent): void {
    if (currentConfig.disabled || !isAllowedHandle(event)) {
      event.preventDefault();
      return;
    }

    element.classList.add(DRAGGING_CLASS);
    element.setAttribute('aria-grabbed', 'true');

    const dragData = currentConfig.data;
    const dragType = element.getAttribute('and-draggable-type') || 'default';
    startDrag(dragData, element, dragType);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: dragType }));

      const image = createDragImage(element);
      event.dataTransfer.setDragImage(image, 0, 0);
    }

    element.dispatchEvent(
      new CustomEvent<AndDragInfo>('and-dragstart', {
        detail: { data: dragData, element, event },
        bubbles: true,
      }),
    );
  }

  function onDragEnd(event: DragEvent): void {
    element.classList.remove(DRAGGING_CLASS);
    element.setAttribute('aria-grabbed', 'false');
    removeDragImage();

    const dropped = event.dataTransfer?.dropEffect !== 'none';
    const state = getDragState();

    element.dispatchEvent(
      new CustomEvent<AndDragEndInfo>('and-dragend', {
        detail: {
          data: state.data,
          element,
          event,
          dropped,
        },
        bubbles: true,
      }),
    );

    endDrag();
  }

  cleanups.push(listen(element, 'dragstart', onDragStart), listen(element, 'dragend', onDragEnd));

  applyAttributes();

  return {
    element,
    updateConfig(config: DragDropConfig): void {
      currentConfig = { ...currentConfig, ...config };
      applyAttributes();
    },
    destroy(): void {
      cleanups.forEach(cleanup => cleanup());
      cleanups = [];
      removeDragImage();
      element.classList.remove(DRAGGABLE_CLASS, DRAGGING_CLASS, DISABLED_CLASS);
      element.removeAttribute('draggable');
      element.removeAttribute('aria-grabbed');
      element.style.cursor = '';
    },
  };
}
