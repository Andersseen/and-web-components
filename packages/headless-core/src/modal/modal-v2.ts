/**
 * @andersseen/headless-components — Modal State Machine
 *
 * Built on createMachine. Framework-agnostic.
 *
 * States: closed → opening → open → closing → closed
 * Events: OPEN, ANIMATION_DONE, CLOSE, ESCAPE, OVERLAY_CLICK, DISABLE
 */

import { createMachine, type Machine, type MachineSnapshot } from '../machine';

export interface ModalContext {
  disabled: boolean;
  label: string;
}

export type ModalStateValue = 'closed' | 'opening' | 'open' | 'closing';

export function createModalMachine(
  config: {
    defaultOpen?: boolean;
    disabled?: boolean;
    label?: string;
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
  } = {},
) {
  const {
    defaultOpen = false,
    disabled = false,
    label = 'Dialog',
    closeOnEscape = true,
    closeOnOverlayClick = true,
    onOpenChange,
  } = config;

  const machine = createMachine<ModalContext>({
    initial: defaultOpen ? 'opening' : 'closed',
    context: { disabled, label },
    states: {
      closed: {
        on: {
          OPEN: {
            target: 'opening',
            guard: ctx => !ctx.disabled,
          },
        },
      },
      opening: {
        effect: ({ send }) => {
          // After animation (or immediately), transition to open
          const timer = setTimeout(() => send('ANIMATION_DONE'), 10);
          onOpenChange?.(true);
          return () => clearTimeout(timer);
        },
        on: {
          ANIMATION_DONE: { target: 'open' },
          CLOSE: { target: 'closed' },
        },
      },
      open: {
        effect: ({ send }) => {
          // Here you would setup focus trap, scroll lock
          // Example: trapFocus(document.activeElement);
          // Example: lockScroll();

          const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEscape) {
              e.preventDefault();
              send('ESCAPE');
            }
          };

          if (typeof window !== 'undefined') {
            window.addEventListener('keydown', onKeyDown);
          }

          return () => {
            // Cleanup: restore focus, unlock scroll
            if (typeof window !== 'undefined') {
              window.removeEventListener('keydown', onKeyDown);
            }
          };
        },
        on: {
          CLOSE: { target: 'closing' },
          ESCAPE: {
            target: 'closing',
            guard: () => closeOnEscape,
          },
          OVERLAY_CLICK: {
            target: 'closing',
            guard: () => closeOnOverlayClick,
          },
        },
      },
      closing: {
        effect: ({ send }) => {
          const timer = setTimeout(() => send('ANIMATION_DONE'), 10);
          onOpenChange?.(false);
          return () => clearTimeout(timer);
        },
        on: {
          ANIMATION_DONE: { target: 'closed' },
        },
      },
    },
  });

  // Backward-compatible API layer over the machine
  return {
    get state() {
      return machine.snapshot;
    },
    subscribe: machine.subscribe,
    stop: machine.stop,
    actions: {
      open: () => machine.send('OPEN'),
      close: () => machine.send('CLOSE'),
      toggle: () => {
        const s = machine.snapshot.value;
        if (s === 'open' || s === 'opening') {
          machine.send('CLOSE');
        } else {
          machine.send('OPEN');
        }
      },
      setDisabled: (disabled: boolean) => {
        // Context update via a special event
        machine.send({ type: '_SET_CONTEXT', disabled } as any);
      },
    },
    queries: {
      isOpen: () => {
        const s = machine.snapshot.value;
        return s === 'open' || s === 'opening';
      },
    },
    getOverlayProps: () => {
      const s = machine.snapshot.value;
      return {
        'data-state': s === 'open' || s === 'opening' ? 'open' : 'closed',
        'aria-hidden': s === 'closed',
      };
    },
    getContentProps: () => {
      const s = machine.snapshot.value;
      return {
        'role': 'dialog',
        'aria-modal': true,
        'aria-hidden': s === 'closed',
        'aria-label': machine.snapshot.context.label,
        'data-state': s,
        'tabindex': -1,
      };
    },
    getCloseButtonProps: () => ({
      'aria-label': 'Close',
      'type': 'button',
    }),
    handleKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        machine.send('ESCAPE');
      }
    },
    handleOverlayClick: () => machine.send('OVERLAY_CLICK'),
  };
}

// ─── Framework Adapters ──────────────────────────────────────────────────

/**
 * Connect a machine snapshot to any reactive system.
 *
 * Usage in React:
 *   const [snapshot, setSnapshot] = useState(machine.snapshot);
 *   useEffect(() => machine.subscribe((s) => setSnapshot(s)), []);
 *
 * Usage in Vue:
 *   const snapshot = ref(machine.snapshot);
 *   machine.subscribe((s) => snapshot.value = s);
 *
 * Usage in Svelte:
 *   const snapshot = writable(machine.snapshot);
 *   machine.subscribe((s) => snapshot.set(s));
 *
 * Usage in Angular:
 *   const snapshot = signal(machine.snapshot);
 *   effect(() => machine.subscribe((s) => snapshot.set(s)));
 *
 * Usage in vanilla:
 *   machine.subscribe((s) => console.log('state:', s.value));
 */

/** React hook adapter */
export function useMachine<C extends Record<string, any>>(machine: Machine<C>): MachineSnapshot<C> {
  // This function body is just documentation.
  // Actual React usage:
  //   const [snap, setSnap] = useState(machine.snapshot);
  //   useEffect(() => machine.subscribe(setSnap), []);
  //   return snap;
  return machine.snapshot;
}

/** Vue ref adapter */
export function refMachine<C extends Record<string, any>>(machine: Machine<C>): { value: MachineSnapshot<C> } {
  // Vue usage:
  //   const snap = ref(machine.snapshot);
  //   machine.subscribe((s) => snap.value = s);
  //   return snap;
  return { value: machine.snapshot };
}

/** Svelte store adapter */
export function svelteMachine<C extends Record<string, any>>(
  machine: Machine<C>,
): { subscribe: (cb: (v: MachineSnapshot<C>) => void) => () => void } {
  // Svelte usage:
  //   const store = writable(machine.snapshot);
  //   machine.subscribe((s) => store.set(s));
  //   return { subscribe: store.subscribe };
  return {
    subscribe: cb => machine.subscribe(s => cb(s)),
  };
}

/** Angular signals adapter */
export function signalMachine<C extends Record<string, any>>(machine: Machine<C>): () => MachineSnapshot<C> {
  // Angular usage:
  //   const snap = signal(machine.snapshot);
  //   machine.subscribe((s) => snap.set(s));
  //   return snap;
  return () => machine.snapshot;
}
