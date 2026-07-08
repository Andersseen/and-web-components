import { Component, Prop, h, Host, State, Event, EventEmitter, Watch } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────── */

export type CodeLanguage = 'bash' | 'shell' | 'npm' | 'yarn' | 'pnpm' | 'text';
export type CodeTheme = 'dark' | 'light';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const codeBlockVariants = cva(
  ['relative group overflow-x-auto rounded-lg border font-mono text-sm', 'flex items-start gap-t-gap-sm'].join(' '),
  {
    variants: {
      theme: {
        dark: 'bg-[#0d1117] border-border text-[#e6edf3]',
        light: 'bg-muted border-border text-foreground',
      },
    },
    defaultVariants: {
      theme: 'dark',
    },
  },
);

const copyButtonVariants = cva(
  [
    'absolute right-t-gap-sm top-t-gap-sm rounded p-1 opacity-0 transition-opacity',
    'group-hover:opacity-100 focus:opacity-100',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ].join(' '),
  {
    variants: {
      theme: {
        dark: 'hover:bg-white/10 text-[#e6edf3]',
        light: 'hover:bg-black/10 text-foreground',
      },
    },
    defaultVariants: {
      theme: 'dark',
    },
  },
);

const promptVariants = cva('select-none opacity-60', {
  variants: {
    theme: {
      dark: 'text-[#7d8590]',
      light: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    theme: 'dark',
  },
});

export type CodeBlockVariantProps = VariantProps<typeof codeBlockVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-code',
  styleUrls: ['and-code.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCode {
  /** Code or command to display. */
  @Prop({ reflect: true }) value: string = '';

  /** Language hint used for styling the prompt. */
  @Prop({ reflect: true }) language: CodeLanguage = 'bash';

  /** Visual theme. */
  @Prop({ reflect: true }) theme: CodeTheme = 'dark';

  /** Whether to show the copy button. */
  @Prop({ reflect: true }) copyable: boolean = true;

  /** Whether to show the shell prompt (`$`). */
  @Prop({ reflect: true }) showPrompt: boolean = true;

  /** Fixed height of the block (CSS length). */
  @Prop({ reflect: true }) height: string = 'auto';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when the content is copied to the clipboard. */
  @Event({ bubbles: true, composed: true }) andCodeCopy: EventEmitter<{ value: string; success: boolean }>;

  @State() private copied: boolean = false;
  @State() private codeContent: string = '';

  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.updateCodeContent();
  }

  disconnectedCallback() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('value')
  valueChanged() {
    this.updateCodeContent();
  }

  /* ── Private helpers ────────────────────────────────────────────── */

  private updateCodeContent() {
    this.codeContent = this.value?.trim() ?? '';
  }

  private get displayPrompt(): string {
    if (!this.showPrompt) {
      return '';
    }
    if (this.language === 'bash' || this.language === 'shell') {
      return '$';
    }
    if (this.language === 'npm' || this.language === 'yarn' || this.language === 'pnpm') {
      return '>';
    }
    return '';
  }

  private async copyToClipboard() {
    const text = this.codeContent;
    let success: boolean;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      success = false;
    }

    this.andCodeCopy.emit({ value: text, success });

    if (success) {
      this.copied = true;
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }

  private renderLines() {
    const lines = this.codeContent.split('\n');
    const prompt = this.displayPrompt;

    return lines.map((line, index) => (
      <div class="flex items-start gap-t-gap-sm whitespace-pre leading-relaxed" key={index}>
        {prompt && <span class={cn(promptVariants({ theme: this.theme }))}>{prompt}</span>}
        <span>{line || ' '}</span>
      </div>
    ));
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const hostStyle: Record<string, string> = {};
    if (this.height && this.height !== 'auto') {
      hostStyle['--and-code-height'] = this.height;
    }

    return (
      <Host
        class={cn(codeBlockVariants({ theme: this.theme }), this.customClass)}
        style={hostStyle}
        role="region"
        aria-label="Code snippet"
      >
        <div class="flex-1 overflow-auto py-t-gap-sm px-t-gap">
          <code class="block min-w-full">{this.renderLines()}</code>
        </div>

        {this.copyable && (
          <button
            type="button"
            class={cn(copyButtonVariants({ theme: this.theme }))}
            onClick={() => this.copyToClipboard()}
            aria-label={this.copied ? 'Copied' : 'Copy to clipboard'}
            title={this.copied ? 'Copied' : 'Copy to clipboard'}
          >
            <and-icon name={this.copied ? 'check' : 'copy'} class="h-4 w-4" />
            <span class="sr-only">{this.copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </Host>
    );
  }
}
