import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-modal';

describe('and-modal', () => {
  it('renders closed by default', async () => {
    const { root } = await render(<and-modal></and-modal>);

    expect(root.shadowRoot.children.length).toBe(0);
  });

  it('renders open when open prop is true', async () => {
    const { root } = await render(<and-modal open></and-modal>);

    const backdrop = root.shadowRoot.querySelector('.and-modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('emits andModalClose when overlay is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-modal open></and-modal>);

    const closeSpy = spyOnEvent('andModalClose');
    const backdrop = root.shadowRoot.querySelector('.and-modal-backdrop') as HTMLElement;
    backdrop.click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});

describe('and-modal — regressions', () => {
  it('emits andModalClose exactly once per close', async () => {
    // The close sequence writes `open`, which re-enters the @Watch and
    // previously started a second close (two events, two exit animations).
    const { root, waitForChanges, spyOnEvent } = await render(<and-modal open></and-modal>);

    const closeSpy = spyOnEvent('andModalClose');
    (root.shadowRoot.querySelector('button[aria-label="Close"]') as HTMLElement).click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
    expect((root as HTMLAndModalElement).open).toBe(false);
  });

  it('adopts a slotted heading as aria-labelledby instead of announcing "Dialog"', async () => {
    const { root, waitForChanges } = await render(
      <and-modal open>
        <h2>Delete account</h2>
      </and-modal>,
    );
    await waitForChanges();

    const dialog = root.shadowRoot.querySelector('[role="dialog"]');
    const heading = root.querySelector('h2');
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBeTruthy();
    expect(dialog.getAttribute('aria-label')).toBeNull();
  });

  it('uses the label prop as the accessible name when set', async () => {
    const { root, waitForChanges } = await render(<and-modal open label="Settings"></and-modal>);
    await waitForChanges();

    const dialog = root.shadowRoot.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-label')).toBe('Settings');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();
  });

  it('honours closeOnOverlayClick=false', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-modal open closeOnOverlayClick={false}></and-modal>);

    const closeSpy = spyOnEvent('andModalClose');
    (root.shadowRoot.querySelector('.and-modal-backdrop') as HTMLElement).click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(0);
    expect((root as HTMLAndModalElement).open).toBe(true);
  });

  it('hides the built-in close button when hideClose is set', async () => {
    const { root } = await render(<and-modal open hideClose></and-modal>);

    expect(root.shadowRoot.querySelector('button[aria-label="Close"]')).toBeNull();
  });

  it('exposes CSS parts so consumers can restyle the dialog', async () => {
    const { root } = await render(<and-modal open></and-modal>);

    const parts = Array.from(root.shadowRoot.querySelectorAll('[part]')).map(el => el.getAttribute('part'));
    expect(parts).toEqual(expect.arrayContaining(['overlay', 'container', 'content', 'close-button']));
  });
});
