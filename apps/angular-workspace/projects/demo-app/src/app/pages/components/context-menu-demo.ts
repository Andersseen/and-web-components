import { Component } from '@angular/core';
import {
  AndContextMenu,
  AndMenuList,
  AndMenuItem,
  AndIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-context-menu-demo',
  imports: [AndContextMenu, AndMenuList, AndMenuItem, AndIcon],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Context Menu
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A floating menu that appears on right-click. Wraps a menu list
          with elevation, borders, and smart positioning for contextual
          actions.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-col items-center justify-center gap-6 min-h-[300px]"
          >
            <p class="text-sm text-muted-foreground m-0">
              Right-click on the area below
            </p>
            <and-context-menu>
              <div
                slot="trigger"
                class="w-80 h-40 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center cursor-context-menu select-none"
              >
                <span class="text-sm text-muted-foreground">
                  Right-click here
                </span>
              </div>

              <and-menu-list ariaMenuLabel="Context actions">
                <and-menu-item value="cut">
                  <and-icon slot="start" name="scissors" size="16"></and-icon>
                  Cut
                </and-menu-item>
                <and-menu-item value="copy">
                  <and-icon slot="start" name="copy" size="16"></and-icon>
                  Copy
                </and-menu-item>
                <and-menu-item value="paste">
                  <and-icon slot="start" name="clipboard" size="16"></and-icon>
                  Paste
                </and-menu-item>
                <and-menu-item value="delete" intent="destructive">
                  <and-icon slot="start" name="trash" size="16"></and-icon>
                  Delete
                </and-menu-item>
              </and-menu-list>
            </and-context-menu>
          </div>
        </div>
      </section>

      <!-- File manager example -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          File Manager Pattern
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-col items-center justify-center gap-6 min-h-[300px]"
          >
            <and-context-menu>
              <div
                slot="trigger"
                class="w-full max-w-md rounded-lg border border-border bg-card p-4 flex items-center gap-4 cursor-context-menu hover:bg-accent/40 transition-colors"
              >
                <and-icon name="file-text" size="24" class="text-muted-foreground"></and-icon>
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-foreground">
                    project-report.pdf
                  </span>
                  <span class="text-xs text-muted-foreground">
                    2.4 MB · Modified 2 days ago
                  </span>
                </div>
              </div>

              <and-menu-list ariaMenuLabel="File actions">
                <and-menu-item value="open">
                  <and-icon slot="start" name="external-link" size="16"></and-icon>
                  Open
                </and-menu-item>
                <and-menu-item value="rename">
                  <and-icon slot="start" name="pencil" size="16"></and-icon>
                  Rename
                </and-menu-item>
                <and-menu-item value="move">
                  <and-icon slot="start" name="folder" size="16"></and-icon>
                  Move to…
                </and-menu-item>
                <and-menu-item value="download">
                  <and-icon slot="start" name="download" size="16"></and-icon>
                  Download
                </and-menu-item>
                <and-menu-item value="delete" intent="destructive">
                  <and-icon slot="start" name="trash" size="16"></and-icon>
                  Delete
                </and-menu-item>
              </and-menu-list>
            </and-context-menu>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Template</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-context-menu&gt;
  &lt;div slot="trigger" class="..."&gt;Right-click here&lt;/div&gt;

  &lt;and-menu-list ariaMenuLabel="Actions"&gt;
    &lt;and-menu-item value="cut"&gt;Cut&lt;/and-menu-item&gt;
    &lt;and-menu-item value="copy"&gt;Copy&lt;/and-menu-item&gt;
    &lt;and-menu-item value="paste"&gt;Paste&lt;/and-menu-item&gt;
    &lt;and-menu-item value="delete" intent="destructive"&gt;Delete&lt;/and-menu-item&gt;
  &lt;/and-menu-list&gt;
&lt;/and-context-menu&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class ContextMenuDemo {}
