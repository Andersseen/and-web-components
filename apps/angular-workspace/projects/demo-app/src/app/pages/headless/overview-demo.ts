import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Hero -->
      <div class="mb-12">
        <h2 class="text-4xl font-bold tracking-tight text-foreground m-0">
          Headless UI
        </h2>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Unstyled, accessible UI primitives for building robust design systems.
          <strong class="text-foreground"
            >You bring the styles, we handle the logic.</strong
          >
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div
          class="p-6 rounded-xl border border-border bg-card transition-all hover:shadow-sm hover:border-ring"
        >
          <div class="mb-4 text-[#6366f1]">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-2">
            Total Control
          </h3>
          <p class="text-sm text-muted-foreground leading-relaxed m-0">
            No Shadow DOM, no style overrides. You have direct access to every
            DOM element and can style them with Tailwind, CSS Modules, or
            anything else.
          </p>
        </div>

        <div
          class="p-6 rounded-xl border border-border bg-card transition-all hover:shadow-sm hover:border-ring"
        >
          <div class="mb-4 text-[#10b981]">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-2">
            Accessible by Default
          </h3>
          <p class="text-sm text-muted-foreground leading-relaxed m-0">
            We handle the hard parts: ARIA attributes, keyboard navigation,
            focus management, and state logic.
          </p>
        </div>

        <div
          class="p-6 rounded-xl border border-border bg-card transition-all hover:shadow-sm hover:border-ring"
        >
          <div class="mb-4 text-[#f97316]">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-2">
            Framework Agnostic
          </h3>
          <p class="text-sm text-muted-foreground leading-relaxed m-0">
            Pure JavaScript core — works with Angular, React, Vue, or vanilla
            JS. No framework lock-in.
          </p>
        </div>

        <div
          class="p-6 rounded-xl border border-border bg-card transition-all hover:shadow-sm hover:border-ring"
        >
          <div class="mb-4 text-[#a855f7]">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-2">
            Type Safe
          </h3>
          <p class="text-sm text-muted-foreground leading-relaxed m-0">
            Full TypeScript support with strongly typed state, actions, and
            configuration options.
          </p>
        </div>
      </div>

      <!-- How it Works -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold text-foreground mb-5">How it works</h3>
        <div
          class="rounded-xl border border-border bg-muted/30 p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center"
        >
          <div class="flex flex-col gap-5">
            <div class="flex gap-3">
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
                >1</span
              >
              <div>
                <p class="text-sm font-medium text-foreground m-0">
                  Initialize Logic
                </p>
                <p class="text-xs text-muted-foreground mt-1 m-0">
                  Create the component logic with a simple function call.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
                >2</span
              >
              <div>
                <p class="text-sm font-medium text-foreground m-0">
                  Connect to UI
                </p>
                <p class="text-xs text-muted-foreground mt-1 m-0">
                  Bind state and actions to your native HTML elements.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
                >3</span
              >
              <div>
                <p class="text-sm font-medium text-foreground m-0">
                  Style Away
                </p>
                <p class="text-xs text-muted-foreground mt-1 m-0">
                  Apply your classes dynamically based on the state.
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-primary-950 p-4 overflow-x-auto shadow-sm">
            <pre
              class="m-0 font-mono text-xs leading-relaxed text-blue-200"
            ><code><span class="text-purple-400">const</span> btn = <span class="text-blue-300">createButton</span>();

<span class="text-slate-500">// Your native button</span>
&lt;<span class="text-pink-400">button</span>
  <span class="text-green-300">class</span>="bg-primary text-primary-foreground ..."
  [<span class="text-amber-200">disabled</span>]="btn.state.disabled"
  (<span class="text-amber-200">click</span>)="btn.actions.click()"
&gt;
  My Custom Button
&lt;/<span class="text-pink-400">button</span>&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- Available Components -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold text-foreground mb-5">
          Available Components
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            class="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card no-underline transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-sm hover:-translate-y-0.5"
            href="/headless/button"
          >
            <span class="text-3xl mb-3">🔘</span>
            <span class="text-sm font-semibold text-foreground mb-1"
              >Button</span
            >
            <span class="text-[11px] text-muted-foreground leading-snug"
              >Loading, disabled, click handling</span
            >
          </a>
          <a
            class="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card no-underline transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-sm hover:-translate-y-0.5"
            href="/headless/dropdown"
          >
            <span class="text-3xl mb-3">📋</span>
            <span class="text-sm font-semibold text-foreground mb-1"
              >Dropdown</span
            >
            <span class="text-[11px] text-muted-foreground leading-snug"
              >Menu, keyboard nav, outside click</span
            >
          </a>
          <a
            class="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card no-underline transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-sm hover:-translate-y-0.5"
            href="/headless/tabs"
          >
            <span class="text-3xl mb-3">📑</span>
            <span class="text-sm font-semibold text-foreground mb-1">Tabs</span>
            <span class="text-[11px] text-muted-foreground leading-snug"
              >Tab panels, ARIA, keyboard support</span
            >
          </a>
          <a
            class="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card no-underline transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-sm hover:-translate-y-0.5"
            href="/headless/accordion"
          >
            <span class="text-3xl mb-3">🪗</span>
            <span class="text-sm font-semibold text-foreground mb-1"
              >Accordion</span
            >
            <span class="text-[11px] text-muted-foreground leading-snug"
              >Expand/collapse, multi-select</span
            >
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export default class OverviewDemo {}
