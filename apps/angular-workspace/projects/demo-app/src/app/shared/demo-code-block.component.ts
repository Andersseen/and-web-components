import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { AndSkeleton } from '@andersseen/angular-components';

function getDocumentTheme(): 'dark' | 'light' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

@Component({
  selector: 'demo-code-block',
  host: { class: 'block w-full min-w-0 max-w-full' },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [AndSkeleton],
  template: `
    <div class="w-full min-w-0 max-w-full overflow-x-hidden rounded-xl border border-border bg-card shadow-sm">
      <div
        class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5"
      >
        <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">{{ label() }}</span>
        @if (copyable()) {
          <button
            type="button"
            class="h-7 shrink-0 rounded-md border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            (click)="copyCode()"
          >
            {{ copied() ? 'Copied' : 'Copy' }}
          </button>
        }
      </div>
      <div class="relative w-full">
        @if (editorDefined()) {
          <vertex-editor-lite
            #editor
            class="block w-full transition-opacity duration-300"
            [class.opacity-0]="!editorReady()"
            [attr.value]="code()"
            [attr.language]="language()"
            [attr.theme]="resolvedTheme()"
            [attr.height]="height()"
            line-numbers="true"
            (ready)="onEditorReady()"
          />
        }
        @if (!editorReady()) {
          <div class="absolute inset-0 p-4 sm:p-5">
            <and-skeleton variant="text" width="100%" height="16px" class="mb-3"></and-skeleton>
            <and-skeleton variant="text" width="92%" height="16px" class="mb-3"></and-skeleton>
            <and-skeleton variant="text" width="96%" height="16px" class="mb-3"></and-skeleton>
            <and-skeleton variant="text" width="88%" height="16px" class="mb-3"></and-skeleton>
            <and-skeleton variant="text" width="95%" height="16px"></and-skeleton>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host + :host {
        margin-top: 1rem;
      }
    `,
  ],
})
export class DemoCodeBlockComponent {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('editor', { read: ElementRef }) editorRef?: ElementRef<HTMLElement>;

  label = input<string>('Template');
  code = input.required<string>();
  language = input<string>('html');
  theme = input<'dark' | 'light' | 'auto'>('auto');
  height = input<string>('300px');
  copyable = input<boolean>(false);
  copyText = input<string | null>(null);
  readonly copied = signal(false);

  readonly editorDefined = signal(customElements.get('vertex-editor-lite') !== undefined);
  readonly editorReady = signal(false);
  readonly resolvedTheme = signal<'dark' | 'light'>(this.resolveTheme());

  constructor() {
    this.waitForEditorDefinition();
    this.observeDocumentTheme();
  }

  private resolveTheme(): 'dark' | 'light' {
    const theme = this.theme();
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    return getDocumentTheme();
  }

  private waitForEditorDefinition() {
    if (this.editorDefined()) {
      return;
    }
    customElements
      .whenDefined('vertex-editor-lite')
      .then(() => this.editorDefined.set(true))
      .catch(() => this.editorDefined.set(false));
  }

  private observeDocumentTheme() {
    const observer = new MutationObserver(() => {
      this.resolvedTheme.set(this.resolveTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  onEditorReady() {
    // Re-apply the latest value/theme in case the editor initialized before
    // Angular had a chance to bind the attributes.
    const el = this.editorRef?.nativeElement;
    if (el) {
      el.setAttribute('value', this.code());
      el.setAttribute('theme', this.resolvedTheme());
    }
    this.editorReady.set(true);
  }

  copyCode() {
    const text = this.copyText() ?? this.code();
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1200);
  }
}
