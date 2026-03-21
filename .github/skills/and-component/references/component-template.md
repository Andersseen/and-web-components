# Component Scaffold — Andersseen Web Components

Full TSX boilerplate. Copy, rename all `[name]`/`[Name]` placeholders, then implement.

## `and-[name].types.ts`

```ts
export type [Name]Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type [Name]Size = 'sm' | 'md' | 'lg';

export interface [Name]SelectDetail {
  value: string;
  label: string;
}

export interface [Name]ChangeDetail {
  value: string;
  previousValue: string;
}
```

## `and-[name].css`

```css
:host {
  /* Structural */
  --[name]-min-width: 180px;
  --[name]-max-height: 320px;
  --[name]-padding: 0.25rem;

  /* Appearance */
  --[name]-bg: hsl(var(--and-surface-elevated));
  --[name]-border: hsl(var(--and-border));
  --[name]-radius: var(--and-radius-md);
  --[name]-shadow: var(--and-shadow);
  --[name]-z: var(--and-z-dropdown);

  /* Item */
  --[name]-item-height: 2.25rem;
  --[name]-item-px: 0.75rem;
  --[name]-item-gap: 0.5rem;
  --[name]-item-radius: var(--and-radius-sm);
  --[name]-item-focus-bg: hsl(var(--and-accent));
  --[name]-item-focus-color: hsl(var(--and-accent-foreground));
  --[name]-item-destructive-color: hsl(var(--and-destructive));
}
```

## `and-[name].tsx`

```tsx
import { Component, Host, h, Prop, State, Event, EventEmitter,
         Watch, Element, Method } from '@stencil/core';
import { cva } from 'class-variance-authority';
import type { [Name]Variant, [Name]Size } from './and-[name].types';

// ─── CVA Variants ──────────────────────────────────────────────────────────
const [name]Variants = cva(
  [
    'inline-flex items-center',
    'transition-all duration-[--and-duration-base]',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[hsl(var(--and-ring))] focus-visible:ring-offset-2',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--and-primary))] text-[hsl(var(--and-primary-foreground))]',
        secondary: 'bg-[hsl(var(--and-secondary))] text-[hsl(var(--and-secondary-foreground))]',
        outline: 'border border-[hsl(var(--and-border))] bg-transparent text-[hsl(var(--and-foreground))]',
        ghost: 'bg-transparent text-[hsl(var(--and-foreground))] hover:bg-[hsl(var(--and-accent))]',
        destructive: 'bg-[hsl(var(--and-destructive))] text-[hsl(var(--and-destructive-foreground))]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

/**
 * @component and-[name]
 * @description [One-line description]
 *
 * @slot - Default slot: main content
 * @slot trigger - Activator element
 * @slot prefix - Leading icon or element
 * @slot suffix - Trailing icon, badge, or shortcut
 *
 * @csspart panel - The main panel container
 *
 * @cssprop --[name]-bg - Background. Default: hsl(var(--and-surface-elevated))
 * @cssprop --[name]-radius - Border radius. Default: var(--and-radius-md)
 * @cssprop --[name]-shadow - Box shadow. Default: var(--and-shadow)
 */
@Component({
  tag: 'and-[name]',
  styleUrl: 'and-[name].css',
  shadow: true,
})
export class And[Name] {

  @Element() el!: HTMLElement;

  // ─── Private refs ─────────────────────────────────────────────────────────
  private triggerId = `and-[name]-trigger-${Math.random().toString(36).slice(2, 7)}`;
  private panelId   = `and-[name]-panel-${Math.random().toString(36).slice(2, 7)}`;
  private triggerEl: HTMLElement | null = null;

  // ─── Props ────────────────────────────────────────────────────────────────

  /** Visual variant */
  @Prop() variant: [Name]Variant = 'default';

  /** Size preset */
  @Prop() size: [Name]Size = 'md';

  /** Open state (controlled mode) */
  @Prop() open: boolean = false;

  /** Disables all interaction */
  @Prop() disabled: boolean = false;

  /** Accessible label when no visible label is present */
  @Prop() label: string = '';

  // ─── State ────────────────────────────────────────────────────────────────

  @State() private isOpen: boolean = false;
  @State() private focusedIndex: number = -1;

  // ─── Computed ─────────────────────────────────────────────────────────────

  /** Supports both controlled (open prop) and uncontrolled (internal state) */
  get _isOpen(): boolean {
    return this.open !== undefined && this.open !== false ? this.open : this.isOpen;
  }

  // ─── Events ───────────────────────────────────────────────────────────────

  /** Fires when the component opens */
  @Event() andOpen: EventEmitter<void>;

  /** Fires when the component closes */
  @Event() andClose: EventEmitter<void>;

  /** Fires when open state toggles */
  @Event() andToggle: EventEmitter<{ open: boolean }>;

  // ─── Watchers ─────────────────────────────────────────────────────────────

  @Watch('open')
  onOpenChange(next: boolean, prev: boolean) {
    if (next === prev) return;
    next ? this.handleOpen() : this.handleClose();
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  componentWillLoad() {
    if (this.open) this.isOpen = true;
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleGlobalKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleGlobalKeyDown);
  }

  // ─── Public Methods ───────────────────────────────────────────────────────

  /** Opens the component */
  @Method() async show() { this.handleOpen(); }

  /** Closes the component */
  @Method() async hide() { this.handleClose(); }

  /** Toggles open state */
  @Method() async toggle() {
    this._isOpen ? this.handleClose() : this.handleOpen();
  }

  // ─── Private Methods ──────────────────────────────────────────────────────

  private handleOpen() {
    if (this.disabled) return;
    this.isOpen = true;
    this.andOpen.emit();
    this.andToggle.emit({ open: true });
  }

  private handleClose() {
    this.isOpen = false;
    this.focusedIndex = -1;
    this.andClose.emit();
    this.andToggle.emit({ open: false });
    this.triggerEl?.focus();
  }

  private handleOutsideClick = (e: MouseEvent) => {
    if (!this.el.contains(e.target as Node)) {
      this.handleClose();
    }
  };

  private handleGlobalKeyDown = (e: KeyboardEvent) => {
    if (!this._isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); this.handleClose(); }
  };

  private getMenuItems(): HTMLElement[] {
    return Array.from(
      this.el.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"]):not([disabled])'
      )
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  render() {
    const panelClasses = [name]Variants({ variant: this.variant, size: this.size });

    return (
      <Host
        class={{ 'is-open': this._isOpen, 'is-disabled': this.disabled }}
        aria-disabled={this.disabled ? 'true' : null}
      >
        {/* Trigger */}
        <div
          id={this.triggerId}
          aria-haspopup="true"
          aria-expanded={String(this._isOpen)}
          aria-controls={this.panelId}
          onClick={() => this.toggle()}
        >
          <slot name="trigger" />
        </div>

        {/* Panel */}
        {this._isOpen && (
          <div
            id={this.panelId}
            part="panel"
            class={panelClasses}
            role="menu"
            aria-labelledby={this.triggerId}
          >
            <slot />
          </div>
        )}
      </Host>
    );
  }
}
```

## `and-[name].stories.ts`

```ts
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/[Name]",
  component: "and-[name]",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { variant: "default", size: "md", disabled: false },
  render: (args) => html`
    <and-[name]
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
    >
      Content
    </and-[name]>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;flex-wrap:wrap">
      <and-[name] variant="default">Default</and-[name]>
      <and-[name] variant="secondary">Secondary</and-[name]>
      <and-[name] variant="outline">Outline</and-[name]>
      <and-[name] variant="ghost">Ghost</and-[name]>
      <and-[name] variant="destructive">Destructive</and-[name]>
    </div>
  `,
};
```
