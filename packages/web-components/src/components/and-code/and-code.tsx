import { Component, Prop, h, Host, State, Event, EventEmitter, Watch } from '@stencil/core';
import { cn } from '../../utils/cn';
import { codeBlockVariants, copyButtonVariants, promptVariants } from './and-code-variants';

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

  /** Prompt character shown before each line (e.g. `$`, `>`, `#`). Ignored when `showPrompt` is `false`. */
  @Prop({ reflect: true }) prompt: string = '$';

  /** Whether to show the copy button. */
  @Prop({ reflect: true }) copyable: boolean = true;

  /** Whether to show the `prompt` character before each line. */
  @Prop({ reflect: true }) showPrompt: boolean = true;

  /** Fixed height of the block (CSS length). */
  @Prop({ reflect: true }) height: string = 'auto';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass!: string;

  /** Emitted when the content is copied to the clipboard. */
  @Event({ bubbles: true, composed: true }) andCodeCopy!: EventEmitter<{ value: string; success: boolean }>;

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
    const prompt = this.showPrompt ? this.prompt : '';

    return lines.map((line, index) => (
      <div class="flex items-start gap-t-gap-sm whitespace-pre leading-relaxed" key={index}>
        {prompt && <span class={cn(promptVariants())}>{prompt}</span>}
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
      <Host class={cn(codeBlockVariants(), this.customClass)} style={hostStyle} role="region" aria-label="Code snippet">
        <div class="flex-1 overflow-auto py-t-gap-sm px-t-gap">
          <code class="block min-w-full">{this.renderLines()}</code>
        </div>

        {this.copyable && (
          <button
            type="button"
            class={cn(copyButtonVariants())}
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
