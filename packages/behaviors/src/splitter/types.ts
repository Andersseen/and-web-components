export type SplitterOrientation = 'horizontal' | 'vertical';

export interface SplitterOptions {
  orientation: SplitterOrientation;
  minSize: number;
  maxSize: number;
  step: number;
  defaultPosition: number;
}

export interface SplitterState {
  position: number;
  orientation: SplitterOrientation;
  isDragging: boolean;
}

export const DEFAULT_SPLITTER_OPTIONS: SplitterOptions = {
  orientation: 'horizontal',
  minSize: 0,
  maxSize: 100,
  step: 1,
  defaultPosition: 50,
};
