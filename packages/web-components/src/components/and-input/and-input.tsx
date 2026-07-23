import { Component, Prop, h, Host, Event, EventEmitter, Element, Watch } from '@stencil/core';
import { createInput, type InputReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { inputVariants } from './and-input-variants';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Single-line text input. Since it renders a plain `<input>` with no
 * associated `<label>`, always set `label` (used as `aria-label`) — and
 * when `hasError` is true, also set `describedBy` to point at the id of
 * your visible error message, otherwise screen readers announce the
 * field as invalid without saying why.
 *
 * Renders in light DOM (`scoped` styles, not Shadow DOM) on purpose: the
 * `<input>` this component renders is a real descendant of whatever
 * `<form>` wraps it, so `FormData`, native `required`/`pattern`
 * validation, autofill, and password managers all work without any
 * extra wiring.
 *
 * @example
 * ```html
 * <and-input label="Email" type="email" required="true"></and-input>
 * ```
 */
@Component({
  tag: 'and-input',
  styleUrls: ['and-input.css', '../../global/component-base.css'],
  scoped: true,
})
export class AndInput {
  @Element() el!: HTMLElement;

  /** Placeholder text for the input. */
  @Prop({ reflect: true }) placeholder: string = '';

  /** Current value of the input. */
  @Prop({ reflect: true, mutable: true }) value: string = '';

  /** HTML input type. */
  @Prop({ reflect: true }) type: InputType = 'text';

  /** Name attribute forwarded to the native input — required for it to show up in `FormData`. */
  @Prop({ reflect: true }) name: string = '';

  /** Disables interaction when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Marks the input as required. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Whether the input is in an error state. */
  @Prop({ reflect: true }) hasError: boolean = false;

  /** Accessible label for the input (used when no visible label exists). */
  @Prop() label: string = '';

  /** ID of the element that describes this input (e.g. error message). */
  @Prop() describedBy: string = '';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** Emitted when the input value changes. */
  @Event({ bubbles: true, composed: true }) andInputChange!: EventEmitter<string>;

  /** Emitted when the input loses focus. */
  @Event({ bubbles: true, composed: true }) andInputBlur!: EventEmitter<void>;

  private inputLogic!: InputReturn;
  private unsubscribe!: () => void;
  private defaultValue: string = '';
  private formEl: HTMLFormElement | null = null;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.defaultValue = this.value;
    this.inputLogic = createInput({
      defaultValue: this.value,
      disabled: this.disabled,
      required: this.required,
      onValueChange: (value: string) => {
        this.value = value;
        this.andInputChange.emit(value);
      },
    });
    this.unsubscribe = this.inputLogic.subscribe(() => {
      // trigger re-render on state change from headless
      this.value = this.inputLogic.state.value;
    });
  }

  // connectedCallback (unlike componentWillLoad) re-fires whenever the
  // element is (re)inserted into the DOM, so it also catches the element
  // being moved into a <form> after its first mount.
  connectedCallback() {
    // The inner <input> is a real light-DOM descendant of any wrapping
    // <form> (see class doc comment), so FormData/required/Enter-to-submit
    // already work natively with zero extra wiring. The one thing the
    // browser's native form-reset algorithm can't do for us is notify this
    // component: it resets the real <input>'s displayed value directly,
    // bypassing our controlled render, which would otherwise re-stamp the
    // stale value back in on the next state change.
    this.formEl = this.el.closest('form');
    this.formEl?.addEventListener('reset', this.handleFormReset);
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.formEl?.removeEventListener('reset', this.handleFormReset);
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    this.inputLogic?.actions.setDisabled(newValue);
  }

  @Watch('required')
  requiredChanged(newValue: boolean) {
    this.inputLogic?.actions.setRequired(newValue);
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleFormReset = () => {
    this.inputLogic?.actions.setValue(this.defaultValue);
  };

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    this.inputLogic.actions.setValue(target.value);
  };

  private handleBlur = () => {
    this.inputLogic.actions.blur();
    this.andInputBlur.emit();
  };

  private handleFocus = () => {
    this.inputLogic.actions.focus();
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const props = this.inputLogic?.getInputProps() || {};

    return (
      <Host class="block">
        <input
          {...props}
          type={this.type}
          name={this.name || undefined}
          class={cn(inputVariants({ hasError: this.hasError }), this.customClass)}
          placeholder={this.placeholder}
          part="input"
          aria-label={this.label || undefined}
          aria-describedby={this.describedBy || undefined}
          aria-invalid={this.hasError ? 'true' : undefined}
          onInput={this.handleInput}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        />
      </Host>
    );
  }
}
