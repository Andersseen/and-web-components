import { Component, computed, signal } from '@angular/core';
import { DemoCodeBlockComponent } from '../../shared/demo-code-block.component';
import { DemoHeaderComponent } from '../../shared/demo-header.component';
import { DemoSectionComponent } from '../../shared/demo-section.component';
import {
  HEADLESS_CORE_PROMPT,
  ICON_PROMPT,
  LAYOUT_PROMPT,
  MOTION_PROMPT,
  WEB_COMPONENTS_PROMPT,
} from './prompts';

type PackageManager = 'pnpm' | 'npm' | 'yarn';
type PromptLibrary =
  | 'web-components'
  | 'headless-core'
  | 'icon'
  | 'motion'
  | 'layout';

@Component({
  selector: 'app-docs-ai',
  imports: [DemoHeaderComponent, DemoSectionComponent, DemoCodeBlockComponent],
  template: `
    <div class="max-w-5xl mx-auto pb-12">
      <demo-header
        title="Docs for AI-Driven Development"
        description="Use this page as a copy-paste baseline when you start a new project and want an LLM to generate code with Andersseen libraries correctly."
      />

      <demo-section title="Install all core libraries">
        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p class="text-sm text-muted-foreground m-0 leading-relaxed">
            Select your package manager and copy one command for the full
            ecosystem.
          </p>

          <div
            class="mt-4 install-toolbar"
            role="tablist"
            aria-label="Package manager selector"
          >
            @for (pm of packageManagers; track pm) {
              <button
                type="button"
                role="tab"
                class="install-tab"
                [attr.aria-selected]="selectedPm() === pm"
                [class.install-tab--active]="selectedPm() === pm"
                (click)="selectedPm.set(pm)"
              >
                {{ pm.toUpperCase() }}
              </button>
            }
          </div>

          <div
            class="mt-4 rounded-xl border border-border bg-muted/20 overflow-hidden"
          >
            <div class="install-command-row">
              <span
                class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Install Command
              </span>
              <button
                type="button"
                class="copy-btn"
                (click)="copyInstallCommand()"
              >
                {{ copiedInstall() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre
              class="install-command"
            ><code>{{ installCommand() }}</code></pre>
          </div>
        </div>
      </demo-section>

      <demo-section title="Angular setup (standalone app)">
        <div class="grid gap-4">
          <demo-code-block label="styles.css" [code]="stylesImport" />
          <demo-code-block label="main.ts" [code]="mainTsSetup" />
          <demo-code-block label="example component" [code]="componentUsage" />
        </div>
      </demo-section>

      <demo-section title="Prompt Context by Library">
        <div class="rounded-xl border border-border bg-muted/30 p-4 mb-4">
          <p class="text-sm text-muted-foreground m-0 leading-relaxed">
            These are reusable context snippets, one per library. They are not
            task prompts. Copy the one you need and prepend it to your own
            request in any framework.
          </p>
        </div>

        <div
          class="context-toolbar"
          role="tablist"
          aria-label="Prompt library selector"
        >
          @for (lib of promptLibraries; track lib) {
            <button
              type="button"
              role="tab"
              class="context-tab"
              [attr.aria-selected]="selectedPromptLibrary() === lib"
              [class.context-tab--active]="selectedPromptLibrary() === lib"
              (click)="selectedPromptLibrary.set(lib)"
            >
              {{ promptLibraryLabel(lib) }}
            </button>
          }
        </div>

        <div class="context-meta">
          <span class="text-xs text-muted-foreground">
            Context snippet only. Each tab is framework-agnostic and focused on
            one library contract.
          </span>
          <button
            type="button"
            class="context-copy-btn"
            (click)="copyPromptContext()"
          >
            {{ copiedPrompt() ? 'Copied' : 'Copy context' }}
          </button>
        </div>

        <demo-code-block
          [label]="selectedPromptLabel()"
          [code]="selectedPromptContext()"
        />
      </demo-section>
    </div>
  `,
  styles: [
    `
      .install-toolbar {
        display: inline-flex;
        gap: 0.5rem;
        padding: 0.25rem;
        border: 1px solid hsl(var(--border));
        border-radius: 0.75rem;
        background: hsl(var(--muted) / 0.55);
      }

      .install-tab {
        border: 0;
        border-radius: 0.5rem;
        padding: 0.45rem 0.8rem;
        background: transparent;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: hsl(var(--muted-foreground));
        cursor: pointer;
      }

      .install-tab--active {
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        box-shadow: 0 1px 2px hsl(var(--foreground) / 0.12);
      }

      .install-command-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid hsl(var(--border));
      }

      .copy-btn {
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.35rem 0.65rem;
        cursor: pointer;
      }

      .copy-btn:hover {
        background: hsl(var(--accent));
      }

      .install-command {
        margin: 0;
        padding: 1rem;
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        font-size: 0.9rem;
        color: hsl(var(--foreground));
        overflow-x: auto;
      }

      .context-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 0.85rem;
      }

      .context-tab {
        border: 1px solid hsl(var(--border));
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        background: hsl(var(--background));
        color: hsl(var(--muted-foreground));
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
      }

      .context-tab--active {
        color: hsl(var(--foreground));
        border-color: hsl(var(--foreground) / 0.45);
        background: hsl(var(--accent));
      }

      .context-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .context-copy-btn {
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.35rem 0.65rem;
        cursor: pointer;
        white-space: nowrap;
      }

      .context-copy-btn:hover {
        background: hsl(var(--accent));
      }

      @media (max-width: 640px) {
        .context-meta {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export default class DocsAiComponent {
  readonly packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn'];
  readonly selectedPm = signal<PackageManager>('pnpm');
  readonly copiedInstall = signal(false);
  readonly promptLibraries: PromptLibrary[] = [
    'web-components',
    'headless-core',
    'icon',
    'motion',
    'layout',
  ];
  readonly selectedPromptLibrary = signal<PromptLibrary>('web-components');
  readonly copiedPrompt = signal(false);

  private readonly installByPm: Record<PackageManager, string> = {
    pnpm: 'pnpm add @andersseen/web-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
    npm: 'npm install @andersseen/web-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
    yarn: 'yarn add @andersseen/web-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
  };

  readonly installCommand = computed(() => this.installByPm[this.selectedPm()]);

  readonly stylesImport = `@import '@andersseen/web-components/dist/web-components/web-components.css';
@import '@andersseen/motion/style.css';
@import '@andersseen/layout/dist/layout.css';`;

  readonly mainTsSetup = `import { bootstrapApplication } from '@angular/platform-browser';
import { registerAllIcons } from '@andersseen/icon';
import { enableAnimations } from '@andersseen/web-components';
import { initMotion } from '@andersseen/motion';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

registerAllIcons();
enableAnimations();
initMotion();

bootstrapApplication(AppComponent, appConfig);`;

  readonly componentUsage = `import { Component } from '@angular/core';
import { AndButton, AndCard, AndIcon } from '@andersseen/angular-components';

@Component({
  selector: 'app-home',
  imports: [AndButton, AndCard, AndIcon],
  template: '<and-card><and-button><and-icon name="sparkles" size="16"></and-icon>Start</and-button></and-card>',
})
export class HomeComponent {}`;

  private readonly promptLibraryLabels: Record<PromptLibrary, string> = {
    'web-components': 'web-components',
    'headless-core': 'headless-core',
    icon: 'icon',
    motion: 'motion',
    layout: 'layout',
  };

  private readonly promptByLibrary: Record<PromptLibrary, string> = {
    'web-components': WEB_COMPONENTS_PROMPT,
    'headless-core': HEADLESS_CORE_PROMPT,
    icon: ICON_PROMPT,
    motion: MOTION_PROMPT,
    layout: LAYOUT_PROMPT,
  };

  readonly selectedPromptContext = computed(
    () => this.promptByLibrary[this.selectedPromptLibrary()],
  );

  readonly selectedPromptLabel = computed(
    () => `${this.promptLibraryLabel(this.selectedPromptLibrary())}.context.md`,
  );

  copyInstallCommand() {
    navigator.clipboard?.writeText(this.installCommand());
    this.copiedInstall.set(true);
    setTimeout(() => this.copiedInstall.set(false), 1200);
  }

  promptLibraryLabel(lib: PromptLibrary) {
    return this.promptLibraryLabels[lib];
  }

  copyPromptContext() {
    navigator.clipboard?.writeText(this.selectedPromptContext());
    this.copiedPrompt.set(true);
    setTimeout(() => this.copiedPrompt.set(false), 1200);
  }
}
