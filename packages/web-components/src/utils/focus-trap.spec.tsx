import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import { getFocusableElements } from './focus-trap';
import '../components/and-modal/and-modal';
import '../components/and-button/and-button';

/**
 * Regression guard for the focus trap.
 *
 * The original implementation was a single `shadowRoot.querySelectorAll()`,
 * which sees neither slotted light-DOM content nor focusables nested in
 * another component's shadow root. In an open dialog that silently reduced
 * the trap to "the close button", and Shift+Tab from the first field
 * escaped the dialog into the page behind it.
 */
describe('getFocusableElements', () => {
  it('finds focusables slotted into a dialog, not just its own shadow chrome', async () => {
    const { root } = await render(
      <and-modal open>
        <h2>Title</h2>
        <input id="first" />
        <input id="second" />
        <button id="confirm">Confirm</button>
      </and-modal>,
    );

    const found = getFocusableElements(root.shadowRoot);
    const ids = found.map(el => el.id).filter(Boolean);

    expect(ids).toEqual(expect.arrayContaining(['first', 'second', 'confirm']));
    // ...and still includes the dialog's own close button.
    expect(found.some(el => el.getAttribute('aria-label') === 'Close')).toBe(true);
  });

  it('descends into a nested component shadow root', async () => {
    const { root } = await render(
      <and-modal open>
        <and-button>Nested</and-button>
      </and-modal>,
    );

    const found = getFocusableElements(root.shadowRoot);
    // `and-button` keeps its real <button> inside its own shadow root, so a
    // flat query over the dialog would find nothing focusable for it.
    const nested = found.filter(el => el.localName === 'button');
    expect(nested.length).toBeGreaterThanOrEqual(2);
  });

  it('skips disabled controls and tabindex="-1"', async () => {
    const { root } = await render(
      <and-modal open>
        <input id="ok" />
        <input id="nope" disabled />
        <button id="unreachable" tabindex="-1">
          No
        </button>
      </and-modal>,
    );

    const ids = getFocusableElements(root.shadowRoot).map(el => el.id);
    expect(ids).toContain('ok');
    expect(ids).not.toContain('nope');
    expect(ids).not.toContain('unreachable');
  });

  it('skips subtrees hidden from assistive tech', async () => {
    const { root } = await render(
      <and-modal open>
        <div aria-hidden="true">
          <input id="hidden-field" />
        </div>
        <input id="visible-field" />
      </and-modal>,
    );

    const ids = getFocusableElements(root.shadowRoot).map(el => el.id);
    expect(ids).toContain('visible-field');
    expect(ids).not.toContain('hidden-field');
  });

  it('returns elements in document order so Tab wrapping picks real edges', async () => {
    const { root } = await render(
      <and-modal open>
        <input id="a" />
        <input id="b" />
      </and-modal>,
    );

    const ids = getFocusableElements(root.shadowRoot)
      .map(el => el.id)
      .filter(Boolean);
    expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('b'));
  });
});
