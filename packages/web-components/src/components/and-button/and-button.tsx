import { Component, h, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';

import { cn } from '../../utils/cn';
import { createButton, type ButtonReturn, type ButtonElementProps } from '@andersseen/headless-components';
import { buttonVariants, spinnerClass, type ButtonVariantProps } from './and-button-variants';

/**
 * Interactive button, or an anchor styled as one when `href` is set.
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
          onClick={(e: MouseEvent) => this.buttonLogic?.handleClick(e)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...props}
        onClick={(e: MouseEvent) => this.buttonLogic?.handleClick(e)}
        class={classes}
        role={this.hostRole || undefined}
      >
        {content}
      </button>
    );
  }
}
