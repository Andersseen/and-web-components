import { Component, h, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';

import { cn } from '../../utils/cn';
import { createButton, type ButtonReturn, type ButtonElementProps } from '@andersseen/headless-components';
import { buttonVariants, spinnerClass, type ButtonVariantProps } from './and-button-variants';

/**
 * Interactive button, or an anchor styled as one when `href` is set.
 *
 * `type="submit"` / `type="reset"` are honoured explicitly: the real
 * `<button>` lives inside this component's shadow root, so it has no form
 * owner and the browser's implicit submission never reaches the enclosing
 * `<form>`. The click handler resolves the associated form (the `form`
 * prop by id, else the nearest ancestor `<form>`) and calls
 * `requestSubmit()` / `reset()` on it, which keeps native constraint
 * validation and the `submit` event intact.
 *
 * For `size="icon"` (no visible text), pass `aria-label` on the element —
 * it's forwarded to the inner control since the host itself is never left
 * focusable/labelled (an explicit `role`/`tabindex` on the host is moved
 * to the inner button/anchor on load, so there's only one interactive
 * surface for assistive tech to land on).
 *
 * @example
 * ```html
 * <and-button variant="destructive" size="lg">Delete</and-button>
 * <and-button size="icon" aria-label="Close"><and-icon name="x"></and-icon></and-button>
 * ```
 */
@Component({
  tag: 'and-button',
  styleUrls: ['and-button.css', '../../global/component-base.css'],
  shadow: { delegatesFocus: true },
})
export class AndButton {
  @Element() el!: HTMLElement;

  /** Visual variant of the button. */
  @Prop({ reflect: true }) variant: ButtonVariantProps['variant'] = 'default';

  /** Size of the button. */
  @Prop({ reflect: true }) size: ButtonVariantProps['size'] = 'default';

  /** HTML button type attribute. */
  @Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

  /** Disables the button when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Shows a loading spinner and disables interaction. */
  @Prop({ reflect: true }) loading: boolean = false;

  /** Additional CSS classes to merge with the internal styles. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** When set, renders as an anchor (`<a>`) instead of `<button>`. */
  @Prop({ reflect: true }) href: string = '';

  /** Target for the anchor (e.g. `_blank`). Only used when `href` is set. */
  @Prop({ reflect: true }) target: string = '';

  /** Rel attribute for the anchor. Defaults to `noopener noreferrer` when target is `_blank`. */
  @Prop({ reflect: true }) rel: string = '';

  /**
   * Id of the `<form>` this button submits or resets, mirroring the native
   * `form` attribute. Defaults to the nearest ancestor `<form>`.
   */
  @Prop({ reflect: true }) form: string = '';

  /** Emitted on button click. */
  @Event({ bubbles: true, composed: true }) andButtonClick!: EventEmitter<MouseEvent>;

  @State() private renderTick = 0;
  private buttonLogic!: ButtonReturn;
  private unsubscribe!: () => void;
  private hostRole: string | null = null;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    const ariaLabel = this.el.getAttribute('aria-label') || undefined;

    // Prevent nested interactive elements: if the host has an explicit
    // ARIA role, forward it to the inner button/anchor and remove it
    // from the host so only one interactive surface exists.
    this.hostRole = this.el.getAttribute('role');
    if (this.hostRole) {
      this.el.removeAttribute('role');
    }
    // Also remove any tabindex from the host to avoid duplicate
    // focusable elements (the inner button already manages focus).
    if (this.el.hasAttribute('tabindex')) {
      this.el.removeAttribute('tabindex');
    }

    this.buttonLogic = createButton({
      disabled: this.disabled,
      loading: this.loading,
      type: this.type,
      ariaLabel,
      onClick: (e: MouseEvent) => this.andButtonClick.emit(e),
    });
    this.unsubscribe = this.buttonLogic.subscribe(() => {
      this.renderTick++;
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    this.buttonLogic?.actions.setDisabled(newValue);
  }

  @Watch('loading')
  loadingChanged(newValue: boolean) {
    this.buttonLogic?.actions.setLoading(newValue);
  }

  /* ── Form participation ─────────────────────────────────────────── */

  /**
   * Resolve the form this button acts on. Uses the same root as the host so
   * it works whether the button sits in the document or inside another
   * component's shadow tree.
   */
  private getAssociatedForm(): HTMLFormElement | null {
    if (this.form) {
      const root = this.el.getRootNode() as Document | ShadowRoot;
      const byId = root.getElementById?.(this.form);
      return byId instanceof HTMLFormElement ? byId : null;
    }
    return this.el.closest('form');
  }

  private handleClick = (ev: MouseEvent) => {
    if (this.disabled || this.loading) {
      return;
    }
    this.buttonLogic?.handleClick(ev);

    if (this.type === 'button' || ev.defaultPrevented) {
      return;
    }

    const form = this.getAssociatedForm();
    if (!form) {
      return;
    }

    if (this.type === 'submit') {
      // requestSubmit() (not submit()) so constraint validation runs and a
      // cancellable `submit` event is still dispatched.
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.submit();
      }
    } else if (this.type === 'reset') {
      form.reset();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const props = this.buttonLogic?.getButtonProps() ?? ({} as ButtonElementProps);
    const classes = cn(buttonVariants({ variant: this.variant, size: this.size }), this.customClass);

    const content = [
      <slot name="start" />,
      this.loading && <span class={spinnerClass} aria-hidden="true" />,
      <slot />,
      <slot name="end" />,
    ];

    if (this.href) {
      const relAttr = this.rel || (this.target === '_blank' ? 'noopener noreferrer' : undefined);
      const { 'aria-busy': ariaBusy, 'aria-label': ariaLabel } = props;

      return (
        <a
          href={this.href}
          target={this.target}
          rel={relAttr}
          class={classes}
          aria-disabled={this.disabled || this.loading ? 'true' : undefined}
          aria-busy={ariaBusy}
          aria-label={ariaLabel}
          tabindex={this.disabled || this.loading ? '-1' : undefined}
          role={this.hostRole || undefined}
          part="link"
          onClick={(e: MouseEvent) => this.buttonLogic?.handleClick(e)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...props}
        // Always `button`: implicit submission can't cross the shadow
        // boundary anyway, and submit/reset are dispatched explicitly in
        // handleClick — leaving `type="submit"` here would risk a double
        // submission if that ever changed.
        type="button"
        onClick={this.handleClick}
        class={classes}
        role={this.hostRole || undefined}
        part="button"
      >
        {content}
      </button>
    );
  }
}
