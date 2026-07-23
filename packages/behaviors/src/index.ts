// Behaviors
export { defineBehaviors, type DefineBehaviorsOptions } from './define-behaviors';

// Splitter
export { createSplitter, type SplitterInstance } from './splitter/create-splitter';
export { SplitterController } from './splitter/splitter';
export type { SplitterOrientation, SplitterOptions, SplitterState } from './splitter/types';
export { DEFAULT_SPLITTER_OPTIONS } from './splitter/types';

// Drag & Drop
export { createDraggable, type DraggableInstance } from './drag-drop/create-draggable';
export { createDropZone, type DropZoneInstance } from './drag-drop/create-drop-zone';
export { startDrag, endDrag, getDragState } from './drag-drop/drag-state';
export type {
  DragDropConfig,
  DropZoneConfig,
  AndDragInfo,
  AndDragEndInfo,
  AndDropInfo,
  AndDragOverInfo,
  DragDropOrientation,
} from './drag-drop/types';

// Tooltip
export { createTooltip, type TooltipInstance } from './tooltip/create-tooltip';
export type { TooltipConfig, TooltipPlacement } from './tooltip/types';
export { DEFAULT_TOOLTIP_CONFIG } from './tooltip/types';

// Dialog
export { createDialog, type DialogRef } from './dialog/create-dialog';
export type { DialogConfig, DialogPosition } from './dialog/types';
export { DEFAULT_DIALOG_CONFIG } from './dialog/types';

// Overlay primitives (also available as `@andersseen/behaviors/overlay`)
export { calculatePosition, type OverlayPosition, type OverlaySize } from './utils/position';
export { clamp, listen, setStyles, type ListenerCleanup } from './utils/dom';
