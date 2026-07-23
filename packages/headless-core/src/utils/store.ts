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

export class StateStore<T extends object> {
  private _state: T;
  private _snapshot: Readonly<T> | null = null;
  private _listeners = new Set<(state: Readonly<T>, prev: Readonly<T>) => void>();

  constructor(initial: T) {
    this._state = initial;
  }

  /**
   * Current frozen state snapshot.
   *
   * The same object identity is returned until `setState` actually changes
   * something. That stability is a hard requirement, not an optimisation:
   * React's `useSyncExternalStore` compares snapshots with `Object.is` and
   * throws "The result of getSnapshot should be cached to avoid an infinite
   * loop" if a fresh object comes back every read. The same applies to
   * `===`-based memoisation in Vue, Svelte and Angular OnPush — i.e. to
   * every framework this package claims to support without an adapter.
   */
  get state(): Readonly<T> {
    if (this._snapshot === null) {
      this._snapshot = Object.freeze({ ...this._state });
    }
    return this._snapshot;
  }

  /** Merge partial updates and notify all subscribers */
  setState(partial: Partial<T>): void {
    const current = this._state as Record<string, unknown>;
    let changed = false;

    for (const key of Object.keys(partial)) {
      if (current[key] !== (partial as Record<string, unknown>)[key]) {
        changed = true;
        break;
      }
    }

    if (!changed) {
      return;
    }

    const frozenPrev = this.state;
    this._state = { ...this._state, ...partial };
    this._snapshot = null; // invalidate; the next read rebuilds it
    const frozenState = this.state;

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
export function createStore<T extends object>(initial: T): StateStore<T> {
  return new StateStore(initial);
}
