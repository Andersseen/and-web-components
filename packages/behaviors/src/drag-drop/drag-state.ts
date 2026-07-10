interface DragState {
  isDragging: boolean;
  data: unknown | null;
  sourceElement: HTMLElement | null;
  dragType: string | null;
}

const state: DragState = {
  isDragging: false,
  data: null,
  sourceElement: null,
  dragType: null,
};

export function startDrag(data: unknown, sourceElement: HTMLElement, dragType?: string): void {
  state.isDragging = true;
  state.data = data;
  state.sourceElement = sourceElement;
  state.dragType = dragType || null;
}

export function endDrag(): void {
  state.isDragging = false;
  state.data = null;
  state.sourceElement = null;
  state.dragType = null;
}

export function getDragState(): Readonly<DragState> {
  return state;
}
