import { describe, it, expect, vi } from 'vitest';
import { createMachine } from '../index';

describe('createMachine', () => {
  it('starts in initial state', () => {
    const machine = createMachine({
      initial: 'idle',
      states: { idle: {} },
    });

    expect(machine.snapshot.value).toBe('idle');
  });

  it('transitions on event', () => {
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { on: { START: { target: 'running' } } },
        running: {},
      },
    });

    machine.send('START');
    expect(machine.snapshot.value).toBe('running');
  });

  it('ignores unhandled events', () => {
    const machine = createMachine({
      initial: 'idle',
      states: { idle: {} },
    });

    machine.send('UNKNOWN');
    expect(machine.snapshot.value).toBe('idle');
  });

  it('blocks transition with guard', () => {
    const machine = createMachine<{ count: number }>({
      initial: 'idle',
      context: { count: 0 },
      states: {
        idle: {
          on: {
            START: {
              target: 'running',
              guard: ctx => ctx.count > 0,
            },
          },
        },
        running: {},
      },
    });

    machine.send('START');
    expect(machine.snapshot.value).toBe('idle'); // blocked by guard

    machine.send({ type: 'START', count: 1 }); // guard still checks context.count (0)
    expect(machine.snapshot.value).toBe('idle');
  });

  it('allows transition when guard passes', () => {
    const machine = createMachine<{ count: number }>({
      initial: 'idle',
      context: { count: 5 },
      states: {
        idle: {
          on: {
            START: {
              target: 'running',
              guard: ctx => ctx.count > 0,
            },
          },
        },
        running: {},
      },
    });

    machine.send('START');
    expect(machine.snapshot.value).toBe('running');
  });

  it('updates context with action', () => {
    const machine = createMachine<{ count: number }>({
      initial: 'idle',
      context: { count: 0 },
      states: {
        idle: {
          on: {
            INCREMENT: {
              target: 'idle',
              action: ctx => ({ count: ctx.count + 1 }),
            },
          },
        },
      },
    });

    machine.send('INCREMENT');
    expect(machine.snapshot.context.count).toBe(1);
  });

  it('runs effect on state enter', () => {
    const effectFn = vi.fn();
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {},
        active: {
          effect: () => {
            effectFn('entered');
          },
        },
      },
    });

    machine.send({ type: 'START' }); // unhandled, stays idle
    expect(effectFn).not.toHaveBeenCalled();

    // Let's add the transition
    const m2 = createMachine({
      initial: 'idle',
      states: {
        idle: { on: { ACTIVATE: { target: 'active' } } },
        active: {
          effect: () => {
            effectFn('entered active');
          },
        },
      },
    });

    m2.send('ACTIVATE');
    expect(effectFn).toHaveBeenCalledWith('entered active');
  });

  it('cleans up previous effect on state change', () => {
    const cleanup = vi.fn();
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: { START: { target: 'running' } },
        },
        running: {
          effect: () => cleanup,
        },
      },
    });

    machine.send('START');
    expect(cleanup).not.toHaveBeenCalled(); // still in running

    machine.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('notifies subscribers on transition', () => {
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { on: { START: { target: 'running' } } },
        running: {},
      },
    });

    const subscriber = vi.fn();
    machine.subscribe(subscriber);

    machine.send('START');

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0][0].value).toBe('running');
    expect(subscriber.mock.calls[0][1].value).toBe('idle');
  });

  it('can checks if event is handled', () => {
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { on: { START: { target: 'running' } } },
        running: {},
      },
    });

    expect(machine.snapshot.can('START')).toBe(true);
    expect(machine.snapshot.can('STOP')).toBe(false);
  });

  it('stops and cleans up', () => {
    const cleanup = vi.fn();
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: { START: { target: 'running' } },
        },
        running: {
          effect: () => cleanup,
        },
      },
    });

    machine.send('START');
    machine.stop();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  describe('snapshot.event contract', () => {
    it('is null on the initial snapshot', () => {
      const machine = createMachine({
        initial: 'idle',
        states: { idle: { on: { START: { target: 'running' } } }, running: {} },
      });

      expect(machine.snapshot.event).toBeNull();
    });

    it('reflects the sent event on direct access and in the subscriber, with the same payload', () => {
      const machine = createMachine({
        initial: 'idle',
        states: { idle: { on: { START: { target: 'running' } } }, running: {} },
      });

      const subscriber = vi.fn();
      machine.subscribe(subscriber);

      machine.send({ type: 'START', reason: 'user-click' });

      expect(machine.snapshot.event).toEqual({ type: 'START', reason: 'user-click' });
      expect(subscriber.mock.calls[0][0].event).toEqual({ type: 'START', reason: 'user-click' });
    });

    it('is unchanged by a guard-blocked send', () => {
      const machine = createMachine<{ count: number }>({
        initial: 'idle',
        context: { count: 0 },
        states: {
          idle: {
            on: {
              START: { target: 'running', guard: ctx => ctx.count > 0 },
              PING: { target: 'idle' },
            },
          },
          running: {},
        },
      });

      machine.send('PING');
      expect(machine.snapshot.event).toEqual({ type: 'PING' });

      machine.send('START'); // blocked: count is 0
      expect(machine.snapshot.value).toBe('idle');
      expect(machine.snapshot.event).toEqual({ type: 'PING' }); // not overwritten by the blocked event
    });

    it('is unchanged by an unhandled event', () => {
      const machine = createMachine({
        initial: 'idle',
        states: { idle: { on: { START: { target: 'running' } } }, running: {} },
      });

      machine.send('START');
      expect(machine.snapshot.event).toEqual({ type: 'START' });

      machine.send('UNKNOWN');
      expect(machine.snapshot.event).toEqual({ type: 'START' });
    });

    it('updates on a self-transition', () => {
      const machine = createMachine({
        initial: 'idle',
        states: { idle: { on: { PING: { target: 'idle' } } } },
      });

      machine.send({ type: 'PING', n: 1 });
      expect(machine.snapshot.event).toEqual({ type: 'PING', n: 1 });

      machine.send({ type: 'PING', n: 2 });
      expect(machine.snapshot.value).toBe('idle');
      expect(machine.snapshot.event).toEqual({ type: 'PING', n: 2 });
    });

    it('reflects an event sent from inside an effect once it causes a transition', () => {
      const machine = createMachine({
        initial: 'idle',
        states: {
          idle: { on: { START: { target: 'loading' } } },
          loading: {
            on: { LOADED: { target: 'done' } },
            effect: ({ send }) => {
              send('LOADED');
            },
          },
          done: {},
        },
      });

      machine.send('START');

      expect(machine.snapshot.value).toBe('done');
      expect(machine.snapshot.event).toEqual({ type: 'LOADED' });
    });
  });
});
