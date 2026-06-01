/**
 * @andersseen/headless-components — State Machine Core
 *
 * Lightweight finite-state-machine engine.
 * Zero dependencies. Framework-agnostic.
 *
 * Concepts:
 *   • State  – a finite value from a known set (e.g. 'closed' | 'open')
 *   • Context – data associated with the current state
 *   • Event   – an action that triggers a transition (e.g. { type: 'OPEN' })
 *   • Guard   – a condition that must pass for a transition to fire
 *   • Effect  – a side-effect tied to entering / leaving / staying in a state
 *
 * @example
 * const machine = createMachine({
 *   initial: 'closed',
 *   states: {
 *     closed: { on: { OPEN: { target: 'opening' } } },
 *     opening: {
 *       on: { MOUNTED: { target: 'open' } },
 *       effect: ({ send }) => { // animation }
 *     },
 *     open: {
 *       on: { CLOSE: { target: 'closing' } },
 *       effect: ({ send }) => { // focus trap }
 *     },
 *     closing: {
 *       on: { UNMOUNTED: { target: 'closed' } },
 *       effect: ({ send }) => { // cleanup }
 *     },
 *   },
 * });
 */

// ─── Types ──────────────────────────────────────────────────────────────

/** An event sent to the machine. */
export interface MachineEvent {
  type: string;
  [key: string]: unknown;
}

/** A guard function. Returns true if the transition is allowed. */
export type GuardFn<C extends Record<string, any>> = (ctx: C, event: MachineEvent) => boolean;

/** An effect callback. Receives a `send` helper and the machine API. */
export interface EffectAPI<C extends Record<string, any>> {
  /** Send another event (useful for async work). */
  send: (event: MachineEvent | string) => void;
  /** Current context snapshot. */
  context: Readonly<C>;
  /** Previous state value (before entering this state). */
  previousState: string | null;
}

export type EffectFn<C extends Record<string, any>> = (api: EffectAPI<C>) => (() => void) | void;

/** Configuration for a single transition. */
export interface TransitionConfig<C extends Record<string, any>> {
  target: string;
  /** Optional guard condition. */
  guard?: GuardFn<C>;
  /** Optional context updater after transition. */
  action?: (ctx: C, event: MachineEvent) => Partial<C>;
}

/** Configuration for a state node. */
export interface StateConfig<C extends Record<string, any>> {
  on?: Record<string, TransitionConfig<C>>;
  /** Effect that runs when entering this state. Return cleanup fn for leave. */
  effect?: EffectFn<C>;
}

/** Machine configuration. */
export interface MachineConfig<C extends Record<string, any>> {
  /** Initial state value. */
  initial: string;
  /** Initial context data. */
  context?: C;
  /** State definitions. */
  states: Record<string, StateConfig<C>>;
}

/** Current snapshot of the machine. */
export interface MachineSnapshot<C extends Record<string, any>> {
  value: string;
  context: Readonly<C>;
  /** The event that caused the current state (null for initial). */
  event: MachineEvent | null;
  /** Whether this state can handle the given event. */
  can: (eventType: string) => boolean;
}

/** Public API returned by createMachine. */
export interface Machine<C extends Record<string, any>> {
  /** Current snapshot. */
  get snapshot(): MachineSnapshot<C>;
  /** Send an event to the machine. */
  send: (event: MachineEvent | string) => void;
  /** Subscribe to snapshot changes. */
  subscribe: (callback: (snapshot: MachineSnapshot<C>, prev: MachineSnapshot<C>) => void) => () => void;
  /** Stop the machine (cleanup all effects). */
  stop: () => void;
}

// ─── Implementation ─────────────────────────────────────────────────────

export function createMachine<C extends Record<string, any>>(config: MachineConfig<C>): Machine<C> {
  let stateValue = config.initial;
  let context: C = { ...(config.context ?? ({} as C)) };
  let previousState: string | null = null;
  let currentEffectCleanup: (() => void) | void = undefined;
  const listeners = new Set<(snapshot: MachineSnapshot<C>, prev: MachineSnapshot<C>) => void>();

  const getSnapshot = (): MachineSnapshot<C> => {
    const stateDef = config.states[stateValue];
    return {
      value: stateValue,
      context: Object.freeze({ ...context }),
      event: null, // populated during transition
      can: (eventType: string) => {
        const transition = stateDef?.on?.[eventType];
        if (!transition) {
          return false;
        }
        if (transition.guard) {
          return transition.guard(context, { type: eventType });
        }
        return true;
      },
    };
  };

  const runEffect = () => {
    // Cleanup previous effect
    if (typeof currentEffectCleanup === 'function') {
      currentEffectCleanup();
      currentEffectCleanup = undefined;
    }

    const stateDef = config.states[stateValue];
    if (stateDef?.effect) {
      const api: EffectAPI<C> = {
        send: ev => send(ev),
        context: Object.freeze({ ...context }),
        previousState,
      };
      currentEffectCleanup = stateDef.effect(api);
    }
  };

  const notify = (prevSnapshot: MachineSnapshot<C>, event: MachineEvent) => {
    const nextSnapshot = getSnapshot();
    nextSnapshot.event = event;
    listeners.forEach(cb => cb(nextSnapshot, prevSnapshot));
  };

  const send = (event: MachineEvent | string) => {
    const ev = typeof event === 'string' ? { type: event } : event;
    const stateDef = config.states[stateValue];
    if (!stateDef?.on?.[ev.type]) {
      return;
    } // unhandled event – silently ignore (or log)

    const transition = stateDef.on[ev.type];

    // Guard check
    if (transition.guard && !transition.guard(context, ev)) {
      return;
    }

    // Build previous snapshot before transition
    const prevSnapshot = getSnapshot();
    prevSnapshot.event = ev;

    // Apply action (context updater)
    if (transition.action) {
      context = { ...context, ...transition.action(context, ev) };
    }

    // Transition
    previousState = stateValue;
    stateValue = transition.target;

    // Run new state's effect
    runEffect();

    // Notify subscribers
    notify(prevSnapshot, ev);
  };

  const subscribe = (callback: (snapshot: MachineSnapshot<C>, prev: MachineSnapshot<C>) => void): (() => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const stop = () => {
    if (typeof currentEffectCleanup === 'function') {
      currentEffectCleanup();
      currentEffectCleanup = undefined;
    }
    listeners.clear();
  };

  // Run initial effect
  runEffect();

  return {
    get snapshot() {
      return getSnapshot();
    },
    send,
    subscribe,
    stop,
  };
}
