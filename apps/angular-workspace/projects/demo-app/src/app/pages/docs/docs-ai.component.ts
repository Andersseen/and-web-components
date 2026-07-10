import { Component, computed, signal } from '@angular/core';
import { AndTabs, AndTabsList, AndTabsTrigger, AndIcon } from '@andersseen/angular-components';
import { DemoCodeBlockComponent } from '../../shared/demo-code-block.component';
import { DemoHeaderComponent } from '../../shared/demo-header.component';
import { DemoPanelComponent } from '../../shared/demo-panel.component';
import { DemoSectionComponent } from '../../shared/demo-section.component';
import { HEADLESS_CORE_PROMPT, ICON_PROMPT, LAYOUT_PROMPT, MOTION_PROMPT, WEB_COMPONENTS_PROMPT } from './prompts';

type PackageManager = 'pnpm' | 'npm' | 'yarn';
type PromptLibrary = 'web-components' | 'headless-core' | 'icon' | 'motion' | 'layout';
type SkillTarget = 'all' | 'orchestrator' | 'web-components' | 'headless-core' | 'icon' | 'motion' | 'layout';

@Component({
  selector: 'app-docs-ai',
  imports: [
    AndTabs,
    AndTabsList,
    AndTabsTrigger,
    AndIcon,
    DemoHeaderComponent,
    DemoSectionComponent,
    DemoCodeBlockComponent,
    DemoPanelComponent,
  ],
  template: `
    <div class="mx-auto w-full min-w-0 max-w-5xl overflow-x-clip px-4 pb-10 sm:px-6 sm:pb-12">
      <demo-header
        title="Docs for AI-Driven Development"
        description="A specialized toolkit to help you construct the perfect system prompt. Copy the base instructions and append the architectural context of the specific libraries your project needs to drastically reduce LLM hallucinations."
      />
      <demo-section title="Appendix: Workspace Installation">
        <demo-panel
          tone="muted"
          title="Core dependencies"
          description="If you haven't installed the ecosystem in your repository yet, grab the command below."
        >
          <and-tabs [value]="selectedPm()" (andTabChange)="onPackageManagerTabChange($event)" class="block w-full mt-4">
            <and-tabs-list class="grid w-fit grid-cols-3 rounded-xl border border-border bg-muted/60 p-1">
              @for (pm of packageManagers; track pm) {
                <and-tabs-trigger [value]="pm" class="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
                  {{ pm.toUpperCase() }}
                </and-tabs-trigger>
              }
            </and-tabs-list>
          </and-tabs>

          <div class="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div
              class="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between bg-muted/20"
            >
              <span
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
              >
                <and-icon name="terminal" size="14"></and-icon> Install Command
              </span>
              <button
                type="button"
                class="h-8 w-full rounded-md border border-border bg-background px-4 text-xs font-semibold text-foreground transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto active:scale-95"
                (click)="copyInstallCommand()"
              >
                {{ copiedInstall() ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
            <pre
              class="m-0 max-w-full overflow-x-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap break-all sm:p-5 sm:whitespace-pre sm:break-normal"
            ><code>{{ installCommand() }}</code></pre>
          </div>
        </demo-panel>
      </demo-section>

      <demo-section title="1. Base System Prompt">
        <demo-panel
          title="Core developer persona"
          description="Always start your AI discussion with this baseline prompt. It strictly defines the AI's role and sets the rules of engagement."
        >
          <div class="mt-2">
            <demo-code-block label="system-prompt.txt" [code]="baseSystemPrompt" [copyable]="true" />
          </div>
        </demo-panel>
      </demo-section>

      <demo-section title="2. Library Context Snippets">
        <demo-panel
          title="Append exact XML boundaries"
          description="Select the packages you actually intend to use. Copy their isolated XML context blocks and paste them directly below the Base System Prompt."
        />

        <and-tabs
          [value]="selectedPromptLibrary()"
          (andTabChange)="onPromptLibraryTabChange($event)"
          class="mb-3 block w-full mt-4"
        >
          <and-tabs-list class="flex w-full flex-wrap gap-2">
            @for (lib of promptLibraries; track lib) {
              <and-tabs-trigger [value]="lib" class="px-4 py-2 text-sm font-semibold capitalize transition-all">
                {{ promptLibraryLabel(lib) }}
              </and-tabs-trigger>
            }
          </and-tabs-list>
        </and-tabs>

        <div class="mb-4">
          <span
            class="text-xs leading-relaxed text-foreground/70 bg-muted/40 px-3 py-1.5 rounded-md border border-border/50"
          >
            <strong>Tip:</strong> You can append multiple blocks if using multiple libraries.
          </span>
        </div>

        <demo-code-block [label]="selectedPromptLabel()" [code]="selectedPromptContext()" [copyable]="true" />
      </demo-section>

      <demo-section title="3. Agent Skills (Claude Code, Cursor, …)">
        <demo-panel
          title="Installable, per-library skills"
          description="Prefer skills over pasting prompts when your agent supports them. Each skill teaches one library — pick only what your project uses. Start with the orchestrator: it decides which library fits a task and routes to the focused skill. Commands respect the package manager selected above."
        />

        <and-tabs
          [value]="selectedSkillTarget()"
          (andTabChange)="onSkillTargetTabChange($event)"
          class="mb-3 block w-full mt-4"
        >
          <and-tabs-list class="flex w-full flex-wrap gap-2">
            @for (target of skillTargets; track target) {
              <and-tabs-trigger [value]="target" class="px-4 py-2 text-sm font-semibold capitalize transition-all">
                {{ skillTargetLabel(target) }}
              </and-tabs-trigger>
            }
          </and-tabs-list>
        </and-tabs>

        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div class="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
              <span
                class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <and-icon name="terminal" size="14"></and-icon> Install
              </span>
              <button
                type="button"
                class="h-8 rounded-md border border-border bg-background px-4 text-xs font-semibold text-foreground transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
                (click)="copySkillInstall()"
              >
                {{ copiedSkillInstall() ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
            <pre
              class="m-0 max-w-full overflow-x-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal"
            ><code>{{ skillInstallCommand() }}</code></pre>
            <p class="m-0 border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
              Activates in <code>.claude/skills/</code> — your agent uses it right away.
            </p>
          </div>

          <div class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div class="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
              <span
                class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <and-icon name="download" size="14"></and-icon> Download only
              </span>
              <button
                type="button"
                class="h-8 rounded-md border border-border bg-background px-4 text-xs font-semibold text-foreground transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
                (click)="copySkillDownload()"
              >
                {{ copiedSkillDownload() ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
            <pre
              class="m-0 max-w-full overflow-x-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal"
            ><code>{{ skillDownloadCommand() }}</code></pre>
            <p class="m-0 border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
              Writes to <code>andersseen-skills/</code> to review before activating.
            </p>
          </div>
        </div>

        <div class="mt-3">
          <span
            class="text-xs leading-relaxed text-foreground/70 bg-muted/40 px-3 py-1.5 rounded-md border border-border/50"
          >
            <strong>Tip:</strong> run <code>{{ skillRunner() }} &#64;andersseen/skills</code> with no arguments for an
            interactive picker, or add <code>--all</code> to install every skill at once.
          </span>
        </div>
      </demo-section>
    </div>
  `,
})
export default class DocsAiComponent {
  readonly packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn'];
  readonly selectedPm = signal<PackageManager>('pnpm');
  readonly copiedInstall = signal(false);
  readonly promptLibraries: PromptLibrary[] = ['web-components', 'headless-core', 'icon', 'motion', 'layout'];
  readonly selectedPromptLibrary = signal<PromptLibrary>('web-components');

  readonly baseSystemPrompt = `You are an expert web developer building a modern application.
You will write clean, semantic HTML and TypeScript.
The project uses the strict Andersseen design system.

Below, you will be provided with XML blocks containing the architectural context and API contracts for the specific Andersseen libraries installed in this project.
Read the context carefully before generating any code. 
Do NOT invent element properties, CSS classes, or attributes that are not explicitly defined in the context.

{INSERT_XML_CONTEXT_SNIPPETS_HERE}

Now, implement the user's request based ONLY on the provided system capabilities.`;

  private readonly installByPm: Record<PackageManager, string> = {
    pnpm: 'pnpm add @andersseen/web-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
    npm: 'npm install @andersseen/web-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
    yarn: 'yarn add @andersseen/web-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
  };

  readonly installCommand = computed(() => this.installByPm[this.selectedPm()]);

  private readonly promptLibraryLabels: Record<PromptLibrary, string> = {
    'web-components': 'Web Components (UI)',
    'headless-core': 'Headless Logic',
    'icon': 'Icon System',
    'motion': 'Motion Engine',
    'layout': 'Layout & Typography',
  };

  private readonly promptByLibrary: Record<PromptLibrary, string> = {
    'web-components': WEB_COMPONENTS_PROMPT,
    'headless-core': HEADLESS_CORE_PROMPT,
    'icon': ICON_PROMPT,
    'motion': MOTION_PROMPT,
    'layout': LAYOUT_PROMPT,
  };

  readonly selectedPromptContext = computed(() => this.promptByLibrary[this.selectedPromptLibrary()]);

  readonly selectedPromptLabel = computed(() => `${this.selectedPromptLibrary()}.context.xml`);

  readonly skillTargets: SkillTarget[] = [
    'all',
    'orchestrator',
    'web-components',
    'headless-core',
    'icon',
    'motion',
    'layout',
  ];
  readonly selectedSkillTarget = signal<SkillTarget>('all');
  readonly copiedSkillInstall = signal(false);
  readonly copiedSkillDownload = signal(false);

  private readonly skillTargetLabels: Record<SkillTarget, string> = {
    'all': 'All (recommended)',
    'orchestrator': 'Orchestrator',
    'web-components': 'Web Components',
    'headless-core': 'Headless Logic',
    'icon': 'Icon System',
    'motion': 'Motion Engine',
    'layout': 'Layout & Typography',
  };

  // Maps a picker choice to the argument passed to `@andersseen/skills add`.
  private readonly skillTargetArg: Record<SkillTarget, string> = {
    'all': '--all',
    'orchestrator': 'andersseen',
    'web-components': 'web-components',
    'headless-core': 'headless-core',
    'icon': 'icon',
    'motion': 'motion',
    'layout': 'layout',
  };

  private readonly runnerByPm: Record<PackageManager, string> = {
    pnpm: 'pnpm dlx',
    npm: 'npx',
    yarn: 'yarn dlx',
  };

  readonly skillRunner = computed(() => this.runnerByPm[this.selectedPm()]);

  readonly skillInstallCommand = computed(
    () => `${this.skillRunner()} @andersseen/skills add ${this.skillTargetArg[this.selectedSkillTarget()]}`,
  );

  readonly skillDownloadCommand = computed(() => `${this.skillInstallCommand()} --download`);

  copyInstallCommand() {
    navigator.clipboard?.writeText(this.installCommand());
    this.copiedInstall.set(true);
    setTimeout(() => this.copiedInstall.set(false), 1200);
  }

  promptLibraryLabel(lib: PromptLibrary) {
    return this.promptLibraryLabels[lib];
  }

  skillTargetLabel(target: SkillTarget) {
    return this.skillTargetLabels[target];
  }

  onSkillTargetTabChange(event: CustomEvent<string>) {
    const value = event.detail;
    if (this.skillTargets.includes(value as SkillTarget)) {
      this.selectedSkillTarget.set(value as SkillTarget);
    }
  }

  copySkillInstall() {
    navigator.clipboard?.writeText(this.skillInstallCommand());
    this.copiedSkillInstall.set(true);
    setTimeout(() => this.copiedSkillInstall.set(false), 1200);
  }

  copySkillDownload() {
    navigator.clipboard?.writeText(this.skillDownloadCommand());
    this.copiedSkillDownload.set(true);
    setTimeout(() => this.copiedSkillDownload.set(false), 1200);
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
