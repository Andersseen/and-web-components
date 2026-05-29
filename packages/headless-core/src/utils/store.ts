/**
 * Lightweight reactive store built on native EventTarget.
 *
 * Works in browsers and Node 15+. Framework-agnostic: React, Vue,
 * Svelte, Angular, or vanilla JS can all subscribe without adapters.
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

export class StateStore<T extends Record<string, any>> extends EventTarget {
  private _state: T;

  constructor(initial: T) {
    super();
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

    if (!changed) return;

    this._state = { ...this._state, ...partial };
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { state: this.state, prev: Object.freeze(prev) },
      }),
    );
  }

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   */
  subscribe(callback: (state: Readonly<T>, prev: Readonly<T>) => void): () => void {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      callback(detail.state, detail.prev);
    };
    this.addEventListener('change', handler);
    return () => this.removeEventListener('change', handler);
  }
}

/**
 * Create a store from an initial state object.
 * Shorthand for `new StateStore(initial)`.
 */
export function createStore<T extends Record<string, any>>(initial: T): StateStore<T> {
  return new StateStore(initial);
}
