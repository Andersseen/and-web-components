import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-button';

describe('and-button', () => {
  it('renders with accessibility attributes', async () => {
    const { root } = await render(<and-button>Click me</and-button>);

    const button = root.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-state')).toBe('active');
    expect(button.getAttribute('tabindex')).toBe('0');
    expect(button.className).toContain('bg-primary');
  });

  it('applies destructive variant', async () => {
    const { root } = await render(<and-button variant="destructive">Delete</and-button>);

    const button = root.shadowRoot.querySelector('button');
    expect(button.className).toContain('bg-destructive');
  });

  it('emits andButtonClick on click', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-button>Click me</and-button>);

    const clickSpy = spyOnEvent('andButtonClick');
    const button = root.shadowRoot.querySelector('button');
    button.click();
    await waitForChanges();

    expect(clickSpy).toHaveReceivedEventTimes(1);
  });
});

describe('and-button — form participation (regression)', () => {
  // The real <button> lives in this component's shadow root, so it has no
  // form owner and implicit submission never reaches the enclosing <form>.
  // Before the fix, `type="submit"` was silently inert.
  it('submits the enclosing form when type="submit"', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <and-button type="submit">Send</and-button>
      </form>,
    );

    const form = root.tagName === 'FORM' ? root : root.querySelector('form');
    const button = root.querySelector('and-button') ?? root;
    let submitted = 0;
    (form as HTMLFormElement).requestSubmit = () => {
      submitted++;
    };

    button.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(submitted).toBe(1);
  });

  it('resets the enclosing form when type="reset"', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <and-button type="reset">Clear</and-button>
      </form>,
    );

    const form = root.tagName === 'FORM' ? root : root.querySelector('form');
    const button = root.querySelector('and-button') ?? root;
    let resets = 0;
    (form as HTMLFormElement).reset = () => {
      resets++;
    };

    button.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(resets).toBe(1);
  });

  it('does not touch the form when type="button" (the default)', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <and-button>Just a button</and-button>
      </form>,
    );

    const form = root.tagName === 'FORM' ? root : root.querySelector('form');
    const button = root.querySelector('and-button') ?? root;
    let submitted = 0;
    (form as HTMLFormElement).requestSubmit = () => {
      submitted++;
    };

    button.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(submitted).toBe(0);
  });

  it('never leaves type="submit" on the inner button, to rule out double submission', async () => {
    const { root } = await render(<and-button type="submit">Send</and-button>);

    expect(root.shadowRoot.querySelector('button').getAttribute('type')).toBe('button');
  });

  it('does not submit while disabled', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <and-button type="submit" disabled>
          Send
        </and-button>
      </form>,
    );

    const form = root.tagName === 'FORM' ? root : root.querySelector('form');
    const button = root.querySelector('and-button') ?? root;
    let submitted = 0;
    (form as HTMLFormElement).requestSubmit = () => {
      submitted++;
    };

    button.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(submitted).toBe(0);
  });
});
