import { Component, computed, signal } from '@angular/core';
import { DemoCodeBlockComponent } from '../../shared/demo-code-block.component';
import { DemoHeaderComponent } from '../../shared/demo-header.component';
import { DemoSectionComponent } from '../../shared/demo-section.component';

type PackageManager = 'pnpm' | 'npm' | 'yarn';
type PromptLibrary =
  | 'web-components'
  | 'headless-components'
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
    'headless-components',
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
    'headless-components': 'headless-core',
    icon: 'icon',
    motion: 'motion',
    layout: 'layout',
  };

  private readonly promptByLibrary: Record<PromptLibrary, string> = {
    'web-components': `CONTEXT: @andersseen/web-components

Library profile:
- Stencil custom-elements package (and-* tags), Shadow DOM based.
- Framework-agnostic runtime (plain HTML + any framework).
- Built on top of @andersseen/headless-components and @andersseen/icon.

Verified package entrypoints:
- '@andersseen/web-components/components/all'  -> registers all elements.
- '@andersseen/web-components/loader'          -> defineCustomElements(window).
- '@andersseen/web-components/dist/web-components/web-components.css' -> global theme tokens/palettes/base styles.

Install:
npm i @andersseen/web-components @andersseen/icon

Recommended setup in bundled apps:
import '@andersseen/web-components/components/all';
import '@andersseen/web-components/dist/web-components/web-components.css';

Alternative setup with loader API:
import { defineCustomElements } from '@andersseen/web-components/loader';
defineCustomElements(window);

Icon requirement (important):
- and-icon reads from @andersseen/icon registry.
- Register at least component-required icons:
import { registerIcons, COMPONENT_ICONS } from '@andersseen/icon';
registerIcons(COMPONENT_ICONS);

Optional runtime toggle:
import { enableAnimations } from '@andersseen/web-components';
enableAnimations();

Usage contract for LLM output:
- Use public props, slots, and CustomEvent APIs from component docs.
- Do not depend on internal shadow markup/classes.
- Prefer design tokens (CSS variables) over hardcoded color palettes.

Minimal usage examples:
<and-button variant="default">Save</and-button>
<and-dropdown id="theme" label="Theme"></and-dropdown>

const dd = document.querySelector('#theme');
dd?.addEventListener('andDropdownSelect', (e) => {
  console.log('selected', e.detail);
});`,

    'headless-components': `CONTEXT: @andersseen/headless-components

Library profile:
- Framework-agnostic state/behavior primitives.
- No DOM rendering and no CSS.
- Includes ARIA props, keyboard handlers, and actions.

Install:
npm i @andersseen/headless-components

Exported modules (verified):
- button, accordion, tabs, dropdown, modal, tooltip, toast,
  drawer, alert, navbar, sidebar, breadcrumb, menu-list, context-menu.

Canonical API shape:
const logic = createX(config);
logic.state;
logic.actions;
logic.queries;            // available on many components
logic.get*Props(...);     // aria + keyboard related props
logic.handle*KeyDown(...);

Usage rules:
- Always map returned props to semantic elements.
- Keep styling/rendering fully separated from logic.
- Preserve keyboard handlers from the library.

Example (accordion):
import { createAccordion } from '@andersseen/headless-components/accordion';

const accordion = createAccordion({ allowMultiple: true });
const trigger = accordion.getTriggerProps('item-1');
const content = accordion.getContentProps('item-1');

// Bind trigger props to your button and content props to your panel.
// Keyboard path:
accordion.handleTriggerKeyDown(event, 'item-1', ['item-1', 'item-2']);

Common mistake to avoid:
- Do not reimplement focus/keyboard state manually if logic already provides it.`,

    icon: `CONTEXT: @andersseen/icon

Library profile:
- Framework-agnostic SVG string registry.
- Tree-shakable icon constants + runtime registration functions.
- Used by and-icon in @andersseen/web-components.

Install:
npm i @andersseen/icon

Core API:
import { registerIcons, getIcon, hasIcon, getRegisteredIconNames } from '@andersseen/icon';

Setup options:
import { registerAllIcons } from '@andersseen/icon';
registerAllIcons();

Or tree-shakable:
import { registerIcons, HOME, CLOSE, COMPONENT_ICONS } from '@andersseen/icon';
registerIcons(COMPONENT_ICONS);
registerIcons({ home: HOME, close: CLOSE });

Usage rules:
- Prefer selective registration in production.
- Use registerAllIcons only in demo/prototyping.
- Keep icon names synced with registration keys.

Example with web components:
<and-icon name="home" size="16"></and-icon>

Registry example:
const svg = getIcon('home');
if (!hasIcon('home')) {
  console.warn('Icon not registered');
}`,

    motion: `CONTEXT: @andersseen/motion

Library profile:
- Framework-agnostic attribute-driven animation engine.
- JS controller + CSS animation catalog.
- Respects prefers-reduced-motion.

Install:
npm i @andersseen/motion

Setup:
import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

const cleanup = initMotion();
// later: cleanup();

Optional advanced API:
import { MotionController } from '@andersseen/motion';
const controller = new MotionController({
  root: document.body,
  threshold: 0.1,
  rootMargin: '0px',
  once: true,
});

Attribute API examples:
<div and-motion="fade-in" and-motion-trigger="enter">...</div>
<button and-motion="zoom-in" and-motion-trigger="hover">...</button>
<div and-motion="slide-in-up" and-motion-duration="800ms" and-motion-delay="120ms">...</div>

Supported trigger values:
- enter | hover | tap

Attribute options:
- and-motion
- and-motion-trigger
- and-motion-duration
- and-motion-delay
- and-motion-easing
- and-motion-once

Usage rules:
- Use motion for feedback/hierarchy, not constant decoration.
- Keep duration/easing tokens consistent.
- Always expose a non-motion-complete UX path.`,

    layout: `CONTEXT: @andersseen/layout

Library profile:
- Pure CSS library, no JS runtime.
- Attribute-driven layout and typography.
- Framework-agnostic.

Install:
npm i @andersseen/layout

Setup:
import '@andersseen/layout/dist/layout.css';

Breakpoints (verified):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Core attribute system:
- and-layout="horizontal|vertical|grid"
- and-layout spacing: gap, gap-x, gap-y
- and-layout alignment: align, justify, wrap
- and-layout spacing utils: p, p-x, p-y, m, m-x, m-y (+ directional variants)
- and-layout grid: cols (1..12), span (1..12/full), col-start, col-end
- Responsive syntax: prop@md:value

Typography attribute system:
- and-text="h1|h2|h3|h4|h5|h6|p|p-sm|p-xs|caption"
- and-text modifiers: align, weight, color

Attribute examples:
<section and-layout="vertical gap:md">
  <header and-layout="horizontal justify:between align:center">
    <h2 and-text="h2 weight:bold">Title</h2>
  </header>
</section>

Responsive examples:
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg"></div>
<p and-text="p align:left align@md:center">Body text</p>

Usage rules:
 - Prefer attributes as source of truth for composition.
 - Avoid mixing utility frameworks and and-layout rules on same node when equivalent modifiers exist.
 - Color tokens in layout map to CSS variables (--color-primary, --color-foreground, etc).`,
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
