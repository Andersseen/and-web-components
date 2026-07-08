import { DemoCodeBlockComponent } from '../../shared';
import { Component, signal } from '@angular/core';
import { AndCode } from '@andersseen/angular-components';

@Component({
  selector: 'app-code-demo',
  imports: [AndCode, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Code</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Lightweight command-snippet component. Displays shell, npm, yarn, or pnpm commands with an optional prompt and
          one-click copy action.
        </p>
      </header>

      <!-- Language Variants -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Language Variants</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8 flex flex-col gap-4 max-w-2xl mx-auto">
            <and-code language="bash" value="git commit -m 'feat: add code component'"></and-code>
            <and-code language="npm" value="npm install @andersseen/web-components"></and-code>
            <and-code language="yarn" value="yarn add @andersseen/web-components"></and-code>
            <and-code language="pnpm" value="pnpm add @andersseen/web-components"></and-code>
          </div>
        </div>
      </section>

      <!-- Themes -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Themes</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8 flex flex-col gap-4 max-w-2xl mx-auto">
            <and-code theme="dark" value="pnpm build:all"></and-code>
            <and-code theme="light" value="pnpm build:all"></and-code>
          </div>
        </div>
      </section>

      <!-- Copy & Events -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Copy & Events</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8 flex flex-col gap-4 max-w-2xl mx-auto">
            <and-code value="npm run storybook" (andCodeCopy)="onCopy($event)"></and-code>
            @if (lastCopied()) {
              <p class="text-sm text-muted-foreground m-0">
                Copied: <span class="font-semibold text-foreground">{{ lastCopied() }}</span>
              </p>
            }
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class CodeDemo {
  lastCopied = signal<string | null>(null);

  onCopy(event: CustomEvent<{ value: string; success: boolean }>) {
    if (event.detail.success) {
      this.lastCopied.set(event.detail.value);
      setTimeout(() => this.lastCopied.set(null), 2000);
    }
  }

  templateCode = `<!-- Bash / Shell -->
<and-code language="bash" value="git commit -m 'feat: add code component'"></and-code>

<!-- Package managers -->
<and-code language="npm" value="npm install @andersseen/web-components"></and-code>
<and-code language="pnpm" value="pnpm add @andersseen/web-components"></and-code>

<!-- Themes -->
<and-code theme="dark" value="pnpm build:all"></and-code>
<and-code theme="light" value="pnpm build:all"></and-code>

<!-- Copy event -->
<and-code value="npm run storybook" (andCodeCopy)="onCopy($event)"></and-code>`;
}
