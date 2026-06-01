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
});
