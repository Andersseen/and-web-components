/**
 * Lightweight reactive store with framework-agnostic pub/sub.
 *
 * Works in browsers, Node, and test environments (including Stencil's
 * mock-doc).  React, Vue, Svelte, Angular, or vanilla JS can all
 * subscribe without adapters.
 *
 * @example
 * const store = new StateStore({ count: 0, name: 'and' });
 *
 * const unsubscribe = store.subscribe((state, prev) => {
 *   console.log('changed from', prev, 'to', state);
 * });
 *
 * store.setState({ count: 1 }); // triggers subscriber
 * unsubscribe();
 */

export class StateStore<T extends Record<string, any>> {
  private _state: T;
  private _listeners = new Set<(state: Readonly<T>, prev: Readonly<T>) => void>();

  constructor(initial: T) {
    this._state = initial;
  }

  /** Current frozen state snapshot */
  get state(): Readonly<T> {
    return Object.freeze({ ...this._state });
  }

  /** Merge partial updates and notify all subscribers */
  setState(partial: Partial<T>): void {
    const prev = { ...this._state };
    let changed = false;

    for (const key of Object.keys(partial)) {
      if ((prev as any)[key] !== (partial as any)[key]) {
        changed = true;
        break;
      }
    }

    if (!changed) {
      return;
    }

    this._state = { ...this._state, ...partial };
    const frozenState = this.state;
    const frozenPrev = Object.freeze(prev);

    // Notify all subscribers
    this._listeners.forEach(cb => cb(frozenState, frozenPrev));
  }

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   */
  subscribe(callback: (state: Readonly<T>, prev: Readonly<T>) => void): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }
}

/**
 * Create a store from an initial state object.
 * Shorthand for `new StateStore(initial)`.
 */
export function createStore<T extends Record<string, any>>(initial: T): StateStore<T> {
  return new StateStore(initial);
}
