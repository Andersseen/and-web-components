import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../store';
import { createButton } from '../../button/button';

describe('StateStore snapshot identity', () => {
  /**
   * Regression guard. `state` used to return `Object.freeze({ ...this._state })`
   * on every read, so two consecutive reads were never `Object.is`-equal.
   * React's `useSyncExternalStore` throws "The result of getSnapshot should be
   * cached to avoid an infinite loop" on exactly that, and `===` memoisation
   * in Vue / Svelte / Angular OnPush silently never hits.
   */
  it('returns the same object identity while nothing changes', () => {
    const store = createStore({ count: 0 });

    expect(store.state).toBe(store.state);
    expect(Object.is(store.state, store.state)).toBe(true);
  });

  it('returns a new identity after a real change', () => {
    const store = createStore({ count: 0 });
    const before = store.state;

    store.setState({ count: 1 });

    expect(store.state).not.toBe(before);
    expect(store.state.count).toBe(1);
    // ...and is stable again from there.
    expect(store.state).toBe(store.state);
  });

  it('keeps the identity when setState is a no-op', () => {
    const store = createStore({ count: 0 });
    const before = store.state;

    store.setState({ count: 0 });

    expect(store.state).toBe(before);
  });

  it('satisfies the useSyncExternalStore contract for a headless component', () => {
    const button = createButton({});
    const getSnapshot = () => button.state;

    // What React does between renders: call getSnapshot twice and bail out
    // of re-rendering when the results are Object.is-equal.
    expect(Object.is(getSnapshot(), getSnapshot())).toBe(true);

    button.actions.setDisabled(true);
    const afterChange = getSnapshot();
    expect(afterChange.disabled).toBe(true);
    expect(Object.is(getSnapshot(), afterChange)).toBe(true);
  });

  it('passes the previous snapshot to subscribers', () => {
    const store = createStore({ count: 0 });
    const seen = vi.fn();
    store.subscribe(seen);

    const first = store.state;
    store.setState({ count: 1 });

    expect(seen).toHaveBeenCalledTimes(1);
    const [next, prev] = seen.mock.calls[0];
    expect(prev).toBe(first);
    expect(prev.count).toBe(0);
    expect(next.count).toBe(1);
  });

  it('still freezes the snapshot', () => {
    const store = createStore({ count: 0 });
    expect(Object.isFrozen(store.state)).toBe(true);
  });

  it('unsubscribes cleanly', () => {
    const store = createStore({ count: 0 });
    const seen = vi.fn();
    const off = store.subscribe(seen);

    store.setState({ count: 1 });
    off();
    store.setState({ count: 2 });

    expect(seen).toHaveBeenCalledTimes(1);
  });
});
