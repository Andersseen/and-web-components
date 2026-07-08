import { Component, Prop, h, Host, Element, State, Watch } from '@stencil/core';
import { cn } from '../../utils/cn';
import { controlVariants, labelVariants, requiredMarkVariants, messageVariants } from './and-control-variants';

let idCounter = 0;
const nextId = () => `and-control-${++idCounter}`;

/**
 * Generic form-field wrapper: label + your own native/custom control +
 * hint or error message, wired together with real `for`/`id` and
 * `aria-describedby` — for the cases `and-input`/`and-select` don't
 * cover. Unlike those two, this component never renders the control
 * itself; you slot in whatever you need (`<textarea>`, a native
 * `<select>`, a third-party widget, `and-input`, anything), and
 * `and-control` only owns the label/message layout around it.
 *
 * The slotted control keeps its own encapsulation — `and-control` reads
 * the first slotted element, gives it an `id` if it doesn't have one,
 * and points the label's `for` and the message's `aria-describedby` at
 * it. It re-runs whenever the slot's content changes, so this works
 * with content rendered asynchronously by a framework.
 *
 * @example
 * ```html
 * <and-control label="Bio" hint="Max 200 characters">
 *   <textarea maxlength="200"></textarea>
 * </and-control>
 *
 * <and-control label="Country" error="Required">
 *   <select required>
 *     <option value="">Choose...</option>
 *   </select>
 * </and-control>
 * ```
 */
@Component({
  tag: 'and-control',
  styleUrls: ['and-control.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndControl {
  @Element() el!: HTMLElement;

  /** Label text for the slotted control. */
  @Prop() label: string = '';

  /** Helper text shown below the control. Hidden while `error` is set. */
  @Prop() hint: string = '';

  /** Error message shown below the control instead of `hint`. Also sets `aria-invalid` on the control. */
  @Prop() error: string = '';

  /** Shows a required indicator next to the label. Purely visual — set `required` on your own control too. */
  @Prop({ reflect: true }) required: boolean = false;

  @State() private messageId: string = '';

  private controlId: string = '';

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentDidLoad() {
    const slotEl = this.el.shadowRoot?.querySelector('slot');
    slotEl?.addEventListener('slotchange', this.handleSlotChange);
    // Initial slot assignment isn't always queryable synchronously here
    // (and doesn't reliably fire `slotchange` for content already present
    // at parse time), so defer a tick to catch it.
    setTimeout(() => this.wireSlottedControl(), 0);
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('hint')
  @Watch('error')
  messageChanged() {
    this.wireSlottedControl();
  }

  /* ── Slot wiring ────────────────────────────────────────────────── */

  private handleSlotChange = () => {
    this.wireSlottedControl();
  };

  private getSlottedControl(): HTMLElement | undefined {
    const slotEl = this.el.shadowRoot?.querySelector('slot');
    // `nodeType === 1` (ELEMENT_NODE) rather than `instanceof HTMLElement`:
    // the latter can fail across realms (e.g. a node created against a
    // different `window` than this module's `HTMLElement` reference).
    return slotEl?.assignedElements({ flatten: true }).find((node): node is HTMLElement => node.nodeType === 1);
  }

  private wireSlottedControl() {
    const control = this.getSlottedControl();
    if (!control) {
      return;
    }

    if (!control.id) {
      this.controlId = this.controlId || nextId();
      control.id = this.controlId;
    } else {
      this.controlId = control.id;
    }

    const message = this.error || this.hint;
    if (message) {
      this.messageId = this.messageId || nextId();
      const existing = control.getAttribute('aria-describedby');
      const ids = new Set((existing ?? '').split(/\s+/).filter(Boolean));
      ids.add(this.messageId);
      control.setAttribute('aria-describedby', Array.from(ids).join(' '));
    } else if (this.messageId) {
      const existing = control.getAttribute('aria-describedby');
      const ids = (existing ?? '').split(/\s+/).filter(id => id && id !== this.messageId);
      if (ids.length) {
        control.setAttribute('aria-describedby', ids.join(' '));
      } else {
        control.removeAttribute('aria-describedby');
      }
    }

    if (this.error) {
      control.setAttribute('aria-invalid', 'true');
    } else {
      control.removeAttribute('aria-invalid');
    }
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const message = this.error || this.hint;

    return (
      <Host class={cn(controlVariants())}>
        {this.label && (
          <label class={cn(labelVariants())} htmlFor={this.controlId || undefined}>
            {this.label}
            {this.required && (
              <span class={cn(requiredMarkVariants())} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <slot />

        {message && (
          <p
            id={this.messageId || undefined}
            class={cn(messageVariants({ error: !!this.error }))}
            role={this.error ? 'alert' : undefined}
          >
            {message}
          </p>
        )}
      </Host>
    );
  }
}
