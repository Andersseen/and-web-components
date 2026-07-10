import { listen, type ListenerCleanup } from '../utils/dom';
import { getDragState } from './drag-state';
import type { DropZoneConfig, AndDropInfo, AndDragOverInfo } from './types';

export interface DropZoneInstance {
  readonly element: HTMLElement;
  updateConfig(config: DropZoneConfig): void;
  destroy(): void;
}

const DROP_ZONE_CLASS = 'and-drop-zone';
const DRAG_OVER_CLASS = 'and-drag-over';
const DROP_DISABLED_CLASS = 'and-drop-disabled';
const CAN_DROP_CLASS = 'and-can-drop';

export function createDropZone(element: HTMLElement, config: DropZoneConfig = {}): DropZoneInstance {
  let currentConfig: DropZoneConfig = { ...config };
  let dragCounter = 0;
  let cleanups: ListenerCleanup[] = [];

  function getAcceptedTypes(): string[] | undefined {
    return currentConfig.accept && currentConfig.accept.length > 0 ? currentConfig.accept : undefined;
  }

  function canDrop(): boolean {
    if (currentConfig.disabled) {
      return false;
    }

    const state = getDragState();
    if (!state.isDragging) {
      return false;
    }

    const acceptedTypes = getAcceptedTypes();
    if (!acceptedTypes || acceptedTypes.length === 0) {
      return true;
    }
    if (!state.dragType) {
      return true;
    }

    return acceptedTypes.includes(state.dragType);
  }

  function updateVisualState(): void {
    const dropping = canDrop();
    element.classList.add(DROP_ZONE_CLASS);
    element.classList.toggle(DROP_DISABLED_CLASS, !!currentConfig.disabled);
    element.classList.toggle(CAN_DROP_CLASS, dropping);
  }

  function calculatePosition(event: DragEvent): 'before' | 'after' | 'inside' {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (rect.width > rect.height) {
      return event.clientX < centerX ? 'before' : 'after';
    }
    return event.clientY < centerY ? 'before' : 'after';
  }

  function calculateDropIndex(event: DragEvent): number | undefined {
    if (!currentConfig.sortable) {
      return undefined;
    }

    const children = Array.from(element.children);
    if (children.length === 0) {
      return 0;
    }

    const rect = element.getBoundingClientRect();
    const isHorizontal = rect.width > rect.height;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childRect = child.getBoundingClientRect();

      if (isHorizontal) {
        if (event.clientX < childRect.left + childRect.width / 2) {
          return i;
        }
      } else {
        if (event.clientY < childRect.top + childRect.height / 2) {
          return i;
        }
      }
    }

    return children.length;
  }

  function onDragEnter(event: DragEvent): void {
    if (currentConfig.disabled || !canDrop()) {
      return;
    }

    event.preventDefault();
    dragCounter++;

    if (dragCounter === 1) {
      element.classList.add(DRAG_OVER_CLASS);
      const state = getDragState();
      element.dispatchEvent(
        new CustomEvent<AndDragOverInfo>('and-dragenter', {
          detail: {
            data: state.data,
            element,
            event,
            position: calculatePosition(event),
          },
          bubbles: true,
        }),
      );
    }
  }

  function onDragLeave(_event: DragEvent): void {
    if (currentConfig.disabled) {
      return;
    }

    dragCounter--;

    if (dragCounter === 0) {
      element.classList.remove(DRAG_OVER_CLASS);
      element.dispatchEvent(new CustomEvent('and-dragleave', { bubbles: true }));
    }
  }

  function onDragOver(event: DragEvent): void {
    if (currentConfig.disabled || !canDrop()) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    const state = getDragState();
    element.dispatchEvent(
      new CustomEvent<AndDragOverInfo>('and-dragover', {
        detail: {
          data: state.data,
          element,
          event,
          position: calculatePosition(event),
        },
        bubbles: true,
      }),
    );
  }

  function onDrop(event: DragEvent): void {
    if (currentConfig.disabled || !canDrop()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    dragCounter = 0;
    element.classList.remove(DRAG_OVER_CLASS);

    const state = getDragState();
    if (!state.sourceElement) {
      return;
    }

    element.dispatchEvent(
      new CustomEvent<AndDropInfo>('and-drop', {
        detail: {
          data: state.data,
          source: state.sourceElement,
          target: element,
          event,
          index: calculateDropIndex(event),
        },
        bubbles: true,
      }),
    );
  }

  cleanups.push(
    listen(element, 'dragenter', onDragEnter),
    listen(element, 'dragleave', onDragLeave),
    listen(element, 'dragover', onDragOver),
    listen(element, 'drop', onDrop),
  );

  updateVisualState();

  return {
    element,
    updateConfig(config: DropZoneConfig): void {
      currentConfig = { ...currentConfig, ...config };
      updateVisualState();
    },
    destroy(): void {
      cleanups.forEach(cleanup => cleanup());
      cleanups = [];
      element.classList.remove(DROP_ZONE_CLASS, DRAG_OVER_CLASS, DROP_DISABLED_CLASS, CAN_DROP_CLASS);
    },
  };
}
