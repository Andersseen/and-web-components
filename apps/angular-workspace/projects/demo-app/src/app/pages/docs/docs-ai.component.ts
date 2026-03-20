import { Component, computed, signal } from '@angular/core';
import { DemoCodeBlockComponent } from '../../shared/demo-code-block.component';
import { DemoHeaderComponent } from '../../shared/demo-header.component';
import { DemoSectionComponent } from '../../shared/demo-section.component';

type PackageManager = 'pnpm' | 'npm' | 'yarn';

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

      <demo-section title="Prompt template for any LLM">
        <div class="rounded-xl border border-border bg-muted/30 p-4 mb-4">
          <p class="text-sm text-muted-foreground m-0 leading-relaxed">
            Inspired by
            <a
              class="text-primary"
              href="https://angular.dev/ai/develop-with-ai"
              target="_blank"
              rel="noopener noreferrer"
              >Angular AI prompting guidance</a
            >: give the model explicit stack, constraints, coding conventions,
            and a clear task. Replace the placeholders and keep this prompt as
            your base template.
          </p>
        </div>

        <demo-code-block label="generic-prompt.md" [code]="genericPrompt" />
      </demo-section>

      <demo-section title="Extra context to improve AI output quality">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <ul class="m-0 pl-5 text-sm text-muted-foreground space-y-2">
            <li>
              Mention package names exactly:
              <code class="text-xs">@andersseen/web-components</code>,
              <code class="text-xs">@andersseen/angular-components</code>,
              <code class="text-xs">@andersseen/headless-components</code>,
              <code class="text-xs">@andersseen/icon</code>,
              <code class="text-xs">@andersseen/motion</code>,
              <code class="text-xs">@andersseen/layout</code>.
            </li>
            <li>
              Ask the LLM to prefer existing <code class="text-xs">and-*</code>
              components before creating custom UI.
            </li>
            <li>
              Require accessibility defaults: semantic HTML, keyboard behavior,
              and ARIA attributes where needed.
            </li>
            <li>
              Request output as a complete patch-ready response: imports,
              component code, styles, and route updates when needed.
            </li>
            <li>
              Add acceptance criteria (responsive behavior, theme compatibility,
              and no TypeScript errors) to reduce iteration loops.
            </li>
          </ul>
        </div>
      </demo-section>
    </div>
  `,
  styles: [
    `
      .install-toolbar {
        display: inline-flex;
        gap: 0.5rem;
        padding: 0.25rem;
        border: 1px solid var(--color-border);
        border-radius: 0.75rem;
        background: color-mix(in oklab, var(--color-muted) 55%, transparent);
      }

      .install-tab {
        border: 0;
        border-radius: 0.5rem;
        padding: 0.45rem 0.8rem;
        background: transparent;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--color-muted-foreground);
        cursor: pointer;
      }

      .install-tab--active {
        background: var(--color-background);
        color: var(--color-foreground);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      }

      .install-command-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--color-border);
      }

      .copy-btn {
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        background: var(--color-background);
        color: var(--color-foreground);
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.35rem 0.65rem;
        cursor: pointer;
      }

      .copy-btn:hover {
        background: var(--color-accent);
      }

      .install-command {
        margin: 0;
        padding: 1rem;
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        font-size: 0.9rem;
        color: var(--color-foreground);
        overflow-x: auto;
      }
    `,
  ],
})
export default class DocsAiComponent {
  readonly packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn'];
  readonly selectedPm = signal<PackageManager>('pnpm');
  readonly copiedInstall = signal(false);

  private readonly installByPm: Record<PackageManager, string> = {
    pnpm: 'pnpm add @andersseen/web-components @andersseen/angular-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
    npm: 'npm install @andersseen/web-components @andersseen/angular-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
    yarn: 'yarn add @andersseen/web-components @andersseen/angular-components @andersseen/headless-components @andersseen/icon @andersseen/motion @andersseen/layout',
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

  readonly genericPrompt = `You are a senior Angular + design-system engineer.

Goal:
Implement the requested feature in an Angular standalone app using Andersseen libraries with production quality, accessibility, and strong TypeScript safety.

Tech context (must respect):
- Angular standalone components + signals.
- UI components package: @andersseen/web-components (custom elements with and-* tags).
- Angular wrappers package: @andersseen/angular-components (imports like AndButton, AndCard, AndIcon).
- Headless logic package: @andersseen/headless-components (state machines only, no UI styles).
- Icon package: @andersseen/icon (register icons in app bootstrap).
- Motion package: @andersseen/motion (attribute-driven animations + initMotion()).
- Layout package: @andersseen/layout (attribute-driven layout via and-layout / and-text).

Library behavior notes:
1) @andersseen/web-components
- Use existing and-* components first.
- Respect component APIs and events.
- Keep visual customization through props, slots, and design tokens.

2) @andersseen/angular-components
- Prefer Angular wrappers inside Angular templates for typed integration.
- Import only the wrappers needed by each component.

3) @andersseen/headless-components
- Use when custom rendering is required.
- It provides state, keyboard behavior, ARIA props, and actions.
- You must render semantic markup and styles yourself.

4) @andersseen/icon
- Assume icons are registered at bootstrap.
- Use and-icon with valid names.

5) @andersseen/motion
- Use subtle motion only when it adds clarity.
- Respect reduced-motion and avoid noisy animations.

6) @andersseen/layout
- Prefer layout attributes over ad-hoc utility class sprawl.
- Keep spacing and typography token-aligned.

Coding requirements:
- Mobile-first responsive behavior.
- Semantic HTML and accessibility by default.
- Keyboard support for interactive controls.
- Strict TypeScript style; avoid any unless unavoidable.
- Do not invent package APIs. If uncertain, use conservative patterns.
- Keep changes minimal, cohesive, and easy to review.

Output format:
1. Brief plan (3-6 bullets).
2. Exact code changes per file.
3. Short rationale for tradeoffs.
4. Quick validation checklist.

Implementation examples (use as patterns):

Example: Angular wrapper usage
import { Component } from '@angular/core';
import { AndButton, AndCard, AndIcon } from '@andersseen/angular-components';

@Component({
  selector: 'app-example',
  imports: [AndButton, AndCard, AndIcon],
  template: '<and-card><and-button><and-icon name="sparkles" size="16"></and-icon>Run</and-button></and-card>',
})
export class ExampleComponent {}

Example: bootstrap essentials
import { registerAllIcons } from '@andersseen/icon';
import { enableAnimations } from '@andersseen/web-components';
import { initMotion } from '@andersseen/motion';

registerAllIcons();
enableAnimations();
initMotion();

Example: headless logic integration
import { createAccordion } from '@andersseen/headless-components/accordion';
const accordion = createAccordion({ allowMultiple: true });
// Use accordion.getTriggerProps(id), getContentProps(id), actions.toggle(id)

Task to implement:
{{DESCRIBE_THE_FEATURE_OR_FIX}}

Acceptance criteria:
- Works on desktop and mobile.
- Reuses Andersseen components and tokens where possible.
- Accessibility baseline is preserved or improved.
- No TypeScript or template errors.
- Include concise notes about what changed and why.`;

  copyInstallCommand() {
    navigator.clipboard?.writeText(this.installCommand());
    this.copiedInstall.set(true);
    setTimeout(() => this.copiedInstall.set(false), 1200);
  }
}
