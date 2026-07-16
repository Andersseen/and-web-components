import { Component, Prop, h, Host, Event, EventEmitter, Element, Watch } from '@stencil/core';
import { createSwitch, type SwitchReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { switchRootVariants, switchTrackClass, switchThumbClass } from './and-switch-variants';

/**
 * Boolean on/off toggle. Since it renders a plain `<input type="checkbox"
 * role="switch">` with no associated `<label>`, always set `label` (used as
 * `aria-label`).
 *
 * Renders in light DOM (`scoped` styles, not Shadow DOM) on purpose: the
 * checkbox this component renders is a real descendant of whatever `<form>`
 * wraps it, so `FormData`, native `required` validation, and
 * `<fieldset disabled>` all work without any extra wiring — the visible
 * track/thumb are styled purely off the checkbox's own `:checked`/`:disabled`
 * state via Tailwind `peer-*` variants (see and-switch-variants.ts), and
 * wrapping everything in a `<label>` gives click-to-toggle for free. A
 * `reset` listener on the wrapping `<form>` restores the original default on
 * native `form.reset()` (see `connectedCallback`) — the same gap `and-input`
 * and `and-select` had.
 *
 * @example
 * ```html
 * <and-switch label="Enable notifications" name="notifications" checked></and-switch>
 * ```
 */
@Component({
  tag: 'and-switch',
  styleUrls: ['and-switch.css', '../../global/component-base.css'],
  scoped: true,
})
export class AndSwitch {
  @Element() el!: HTMLElement;

  /** Whether the switch is on. */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** Name attribute forwarded to the native checkbox — required for it to show up in `FormData`. */
  @Prop({ reflect: true }) name: string = '';

  /** Value submitted in `FormData` when checked. Defaults to the native checkbox default ("on") when unset. */
  @Prop({ reflect: true }) value: string = '';

  /** Disables interaction when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Marks the switch as required (must be checked to submit). */
  @Prop({ reflect: true }) required: boolean = false;

  /** Accessible label for the switch (used when no visible label exists). */
  @Prop() label: string = '';

  /** ID of the element that describes this switch (e.g. hint or error message). */
  @Prop() describedBy: string = '';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** Emitted when the checked state changes. */
  @Event({ bubbles: true, composed: true }) andSwitchChange!: EventEmitter<boolean>;

  private switchLogic!: SwitchReturn;
  private unsubscribe?: () => void;
  private defaultChecked: boolean = false;
  private formEl: HTMLFormElement | null = null;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.defaultChecked = this.checked;
    this.switchLogic = createSwitch({
      checked: this.checked,
      disabled: this.disabled,
      required: this.required,
      onCheckedChange: checked => {
        this.checked = checked;
        this.andSwitchChange.emit(checked);
      },
    });
    this.unsubscribe = this.switchLogic.subscribe(() => {
      // trigger re-render on state change from headless
      this.checked = this.switchLogic.state.checked;
    });
  }

  // connectedCallback (unlike componentWillLoad) re-fires whenever the
  // element is (re)inserted into the DOM, so it also catches the element
  // being moved into a <form> after its first mount.
  connectedCallback() {
    this.formEl = this.el.closest('form');
    this.formEl?.addEventListener('reset', this.handleFormReset);
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.formEl?.removeEventListener('reset', this.handleFormReset);
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('checked')
  checkedChanged(newValue: boolean) {
    if (this.switchLogic && newValue !== this.switchLogic.state.checked) {
      this.switchLogic.actions.setChecked(newValue);
    }
  }

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    this.switchLogic?.actions.setDisabled(newValue);
  }

  @Watch('required')
  requiredChanged(newValue: boolean) {
    this.switchLogic?.actions.setRequired(newValue);
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleFormReset = () => {
    this.switchLogic?.actions.setChecked(this.defaultChecked);
  };

  private handleChange = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    this.switchLogic.actions.setChecked(target.checked);
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const props = this.switchLogic?.getInputProps() || {};

    return (
      <Host>
        <label class={cn(switchRootVariants({ disabled: this.disabled }), this.customClass)}>
          <input
            {...props}
            class="peer sr-only"
            name={this.name || undefined}
            value={this.value || undefined}
            aria-label={this.label}
            aria-describedby={this.describedBy || undefined}
            onChange={this.handleChange}
          />
          <span class={switchTrackClass} aria-hidden="true" />
          <span class={switchThumbClass} aria-hidden="true" />
        </label>
      </Host>
    );
  }
}
