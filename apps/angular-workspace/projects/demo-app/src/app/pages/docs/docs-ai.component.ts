import { Component, computed, signal } from '@angular/core';
import {
  AndTabs,
  AndTabsList,
  AndTabsTrigger,
} from '@angular-components/stencil-generated/components';
import { DemoCodeBlockComponent } from '../../shared/demo-code-block.component';
import { DemoHeaderComponent } from '../../shared/demo-header.component';
import { DemoPanelComponent } from '../../shared/demo-panel.component';
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
  imports: [
    AndTabs,
    AndTabsList,
    AndTabsTrigger,
    DemoHeaderComponent,
    DemoSectionComponent,
    DemoCodeBlockComponent,
    DemoPanelComponent,
  ],
  template: `
    <div
      class="mx-auto w-full min-w-0 max-w-5xl overflow-x-clip px-4 pb-10 sm:px-6 sm:pb-12"
    >
      <demo-header
        title="Docs for AI-Driven Development"
        description="Use this page as a copy-paste baseline when you start a new project and want an LLM to generate code with Andersseen libraries correctly."
      />

      <demo-section title="Install all core libraries">
        <demo-panel
          title="Single command install"
          description="Select your package manager and copy one command for the full ecosystem."
        >
          <and-tabs
            [value]="selectedPm()"
            (andTabChange)="onPackageManagerTabChange($event)"
            class="block w-full"
          >
            <and-tabs-list
              class="grid w-full grid-cols-3 rounded-xl border border-border bg-muted/60 p-1"
            >
              @for (pm of packageManagers; track pm) {
                <and-tabs-trigger
                  [value]="pm"
                  class="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                >
                  {{ pm.toUpperCase() }}
                </and-tabs-trigger>
              }
            </and-tabs-list>
          </and-tabs>

          <div
            class="mt-4 overflow-hidden rounded-xl border border-border bg-muted/20"
          >
            <div
              class="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span
                class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Install Command
              </span>
              <button
                type="button"
                class="h-8 w-full rounded-md border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                (click)="copyInstallCommand()"
              >
                {{ copiedInstall() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre
              class="m-0 max-w-full overflow-x-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap break-all sm:p-5 sm:whitespace-pre sm:break-normal"
            ><code>{{ installCommand() }}</code></pre>
          </div>
        </demo-panel>
      </demo-section>

      <demo-section title="Angular setup (standalone app)">
        <div class="grid min-w-0 gap-4">
          <demo-code-block label="styles.css" [code]="stylesImport" />
          <demo-code-block label="main.ts" [code]="mainTsSetup" />
          <demo-code-block label="example component" [code]="componentUsage" />
        </div>
      </demo-section>

      <demo-section title="Prompt Context by Library">
        <demo-panel
          tone="muted"
          padding="md"
          title="Reusable context snippets"
          description="Each tab contains a framework-agnostic library contract. Use it as context and prepend your own task prompt."
        />

        <and-tabs
          [value]="selectedPromptLibrary()"
          (andTabChange)="onPromptLibraryTabChange($event)"
          class="mb-3 block w-full"
        >
          <and-tabs-list class="flex w-full flex-wrap gap-2">
            @for (lib of promptLibraries; track lib) {
              <and-tabs-trigger
                [value]="lib"
                class="px-3 py-1.5 text-xs font-semibold capitalize"
              >
                {{ promptLibraryLabel(lib) }}
              </and-tabs-trigger>
            }
          </and-tabs-list>
        </and-tabs>

        <div class="mb-3">
          <span class="text-xs leading-relaxed text-muted-foreground">
            Context snippet only. Each tab is framework-agnostic and focused on
            one library contract.
          </span>
        </div>

        <demo-code-block
          [label]="selectedPromptLabel()"
          [code]="selectedPromptContext()"
          [copyable]="true"
        />
      </demo-section>
    </div>
  `,
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

  onPackageManagerTabChange(event: CustomEvent<string>) {
    const value = event.detail;
    if (this.packageManagers.includes(value as PackageManager)) {
      this.selectedPm.set(value as PackageManager);
    }
  }

  onPromptLibraryTabChange(event: CustomEvent<string>) {
    const value = event.detail;
    if (this.promptLibraries.includes(value as PromptLibrary)) {
      this.selectedPromptLibrary.set(value as PromptLibrary);
    }
  }
}
