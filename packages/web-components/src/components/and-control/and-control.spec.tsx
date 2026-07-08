import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-control';

const nextTick = () => new Promise<void>(resolve => setTimeout(resolve, 0));

/** Polls until `check()` returns truthy, or throws after `timeoutMs`. Sidesteps guessing at the exact microtask/macrotask ordering between the test harness and the component's internal deferral. */
async function waitUntil(check: () => boolean, timeoutMs = 500): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('waitUntil: condition not met within timeout');
    }
    await nextTick();
  }
}

describe('and-control', () => {
  it('renders the label text', async () => {
    const { root } = await render(
      <and-control label="Bio">
        <textarea></textarea>
      </and-control>,
    );

    expect(root.shadowRoot?.querySelector('label')?.textContent).toContain('Bio');
  });

  it('shows a required marker when required is true', async () => {
    const { root } = await render(
      <and-control label="Bio" required>
        <textarea></textarea>
      </and-control>,
    );

    expect(root.shadowRoot?.querySelector('label')?.textContent).toContain('*');
  });

  it('does not render a message paragraph when neither hint nor error is set', async () => {
    const { root } = await render(
      <and-control label="Bio">
        <textarea></textarea>
      </and-control>,
    );

    expect(root.shadowRoot?.querySelector('p')).toBeNull();
  });

  it('renders the hint message', async () => {
    const { root } = await render(
      <and-control label="Bio" hint="Max 200 characters">
        <textarea></textarea>
      </and-control>,
    );

    expect(root.shadowRoot?.querySelector('p')?.textContent).toBe('Max 200 characters');
  });

  it('renders the error message with role="alert" instead of the hint', async () => {
    const { root } = await render(
      <and-control label="Bio" hint="Max 200 characters" error="Too long">
        <textarea></textarea>
      </and-control>,
    );

    const message = root.shadowRoot?.querySelector('p');
    expect(message?.textContent).toBe('Too long');
    expect(message?.getAttribute('role')).toBe('alert');
  });

  it('wires the slotted control to the label (for/id) and message (aria-describedby)', async () => {
    const { root, waitForChanges } = await render(
      <and-control label="Bio" hint="Max 200 characters">
        <textarea></textarea>
      </and-control>,
    );

    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    await waitUntil(() => !!textarea.id);
    await waitForChanges();

    const label = root.shadowRoot?.querySelector('label') as HTMLLabelElement;
    const message = root.shadowRoot?.querySelector('p') as HTMLParagraphElement;

    expect(textarea.id).toBeTruthy();
    expect(label.getAttribute('for')).toBe(textarea.id);
    expect(textarea.getAttribute('aria-describedby')).toContain(message.id);
  });

  it('sets aria-invalid on the slotted control when error is set', async () => {
    const { root } = await render(
      <and-control label="Bio" error="Too long">
        <textarea></textarea>
      </and-control>,
    );

    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    await waitUntil(() => textarea.getAttribute('aria-invalid') === 'true');

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('does not create a Shadow DOM boundary around the slotted control', async () => {
    const { root } = await render(
      <and-control label="Bio">
        <textarea></textarea>
      </and-control>,
    );

    const textarea = root.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea?.getRootNode()).toBe(root.ownerDocument);
  });
});
