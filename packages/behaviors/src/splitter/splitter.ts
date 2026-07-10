import { clamp } from '../utils/dom';
import { type SplitterOptions, type SplitterOrientation, type SplitterState, DEFAULT_SPLITTER_OPTIONS } from './types';

export class SplitterController {
  private options: SplitterOptions;
  private state: SplitterState;
  private listeners: Set<(state: SplitterState) => void> = new Set();
  private containerRect: DOMRect | null = null;

  constructor(options: Partial<SplitterOptions> = {}) {
    this.options = { ...DEFAULT_SPLITTER_OPTIONS, ...options };
    this.state = {
      position: this.options.defaultPosition,
      orientation: this.options.orientation,
      isDragging: false,
    };
  }

  getState(): SplitterState {
    return { ...this.state };
  }

  get optionsSnapshot(): Readonly<SplitterOptions> {
    return { ...this.options };
  }

  subscribe(listener: (state: SplitterState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  updateOptions(options: Partial<SplitterOptions>): void {
    this.options = { ...this.options, ...options };
    if (options.orientation !== undefined) {
      this.state = { ...this.state, orientation: options.orientation };
    }
    if (options.defaultPosition !== undefined && !this.state.isDragging) {
      this.setPosition(options.defaultPosition);
    }
    this.emit();
  }

  setOrientation(orientation: SplitterOrientation): void {
    this.updateOptions({ orientation });
  }

  setContainerRect(rect: DOMRect): void {
    this.containerRect = rect;
  }

  setPosition(position: number): void {
    const { minSize, maxSize, step } = this.options;
    const clamped = clamp(position, minSize, maxSize);
    const resolvedStep = step > 0 ? step : 1;
    const stepped = Math.round(clamped / resolvedStep) * resolvedStep;
    const final = clamp(stepped, minSize, maxSize);

    if (this.state.position !== final) {
      this.state = { ...this.state, position: final };
      this.emit();
    }
  }

  startDragging(): void {
    if (this.state.isDragging) {
      return;
    }
    this.state = { ...this.state, isDragging: true };
    this.emit();
  }

  stopDragging(): void {
    if (!this.state.isDragging) {
      return;
    }
    this.state = { ...this.state, isDragging: false };
    this.emit();
  }

  calculatePositionFromEvent(clientX: number, clientY: number): number {
    const rect = this.containerRect;
    if (!rect) {
      return this.state.position;
    }

    if (this.state.orientation === 'horizontal') {
      return ((clientX - rect.left) / rect.width) * 100;
    }
    return ((clientY - rect.top) / rect.height) * 100;
  }

  private emit(): void {
    const snapshot = this.getState();
    this.listeners.forEach(listener => listener(snapshot));
  }
}
