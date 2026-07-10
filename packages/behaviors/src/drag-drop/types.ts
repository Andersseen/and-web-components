export interface DragDropConfig {
  /** Data to transfer during drag */
  data?: unknown;
  /** Whether the element is draggable */
  disabled?: boolean;
  /** Drag handle selector */
  handle?: string;
  /** Animation duration in ms */
  animationDuration?: number;
}

export interface DropZoneConfig {
  /** Acceptable drag types */
  accept?: string[];
  /** Whether drop is disabled */
  disabled?: boolean;
  /** Whether to allow sorting/reordering */
  sortable?: boolean;
}

export interface AndDragInfo {
  data: unknown;
  element: HTMLElement;
  event: DragEvent;
}

export interface AndDragEndInfo {
  data: unknown;
  element: HTMLElement;
  event: DragEvent;
  dropped: boolean;
}

export interface AndDropInfo {
  data: unknown;
  source: HTMLElement;
  target: HTMLElement;
  event: DragEvent;
  index?: number;
}

export interface AndDragOverInfo {
  data: unknown;
  element: HTMLElement;
  event: DragEvent;
  position: 'before' | 'after' | 'inside';
}

export type DragDropOrientation = 'horizontal' | 'vertical';
