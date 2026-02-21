import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-headless-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-primary-100/20 dark:from-background dark:via-primary-950/30 dark:to-primary-900/10"
    >
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div
          class="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,transparent,black)]"
        ></div>
        <div
          class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        >
          <div class="text-center">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium animate-fade-in"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-primary"
                ></span>
              </span>
              Framework Agnostic • Accessible • Type-Safe
            </div>

            <h1
              class="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-600 to-secondary-600 dark:from-primary-400 dark:via-primary dark:to-secondary-400 mb-6 animate-slide-up"
            >
              Headless Components
            </h1>

            <p
              class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up"
              style="animation-delay: 0.1s"
            >
              Build accessible, customizable UI components with
              <strong>logic separated from presentation</strong>
            </p>

            <div
              class="flex flex-wrap justify-center gap-4 animate-slide-up"
              style="animation-delay: 0.2s"
            >
              <and-button variant="default" size="lg"> Get Started </and-button>
              <and-button variant="outline" size="lg">
                View on GitHub
              </and-button>
            </div>
          </div>

          <!-- Feature Pills -->
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in"
            style="animation-delay: 0.3s"
          >
            <div
              class="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div class="text-4xl mb-3">🎨</div>
              <h3 class="text-lg font-bold text-foreground mb-2">
                Fully Customizable
              </h3>
              <p class="text-muted-foreground text-sm">
                Complete control over styling and appearance
              </p>
            </div>

            <div
              class="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div class="text-4xl mb-3">♿</div>
              <h3 class="text-lg font-bold text-foreground mb-2">
                Accessible by Default
              </h3>
              <p class="text-muted-foreground text-sm">
                ARIA attributes and keyboard navigation built-in
              </p>
            </div>

            <div
              class="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div class="text-4xl mb-3">🔄</div>
              <h3 class="text-lg font-bold text-foreground mb-2">
                Framework Agnostic
              </h3>
              <p class="text-muted-foreground text-sm">
                Works with React, Vue, Angular, or vanilla JS
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Interactive Demo Tabs -->
        <div class="mb-16">
          <h2
            class="text-3xl font-bold text-foreground mb-8 text-center"
          >
            Live Interactive Examples
          </h2>

          <and-tabs
            [value]="activeDemo()"
            (valueChange)="activeDemo.set($event.detail)"
            class="block"
          >
            <and-tabs-list class="flex justify-center mb-8">
              <and-tabs-trigger value="button">Button</and-tabs-trigger>
              <and-tabs-trigger value="dropdown">Dropdown</and-tabs-trigger>
              <and-tabs-trigger value="tabs">Tabs</and-tabs-trigger>
              <and-tabs-trigger value="accordion">Accordion</and-tabs-trigger>
            </and-tabs-list>

            <!-- Button Demo -->
            <and-tabs-content value="button">
              <div class="grid md:grid-cols-2 gap-8">
                <div
                  class="bg-muted rounded-2xl p-8 shadow-xl border border-border"
                >
                  <h3
                    class="text-xl font-bold text-foreground mb-6"
                  >
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-accent"></span>
                      Preview
                    </span>
                  </h3>

                  <div class="space-y-4">
                    <div class="flex flex-wrap gap-3">
                      <and-button
                        variant="default"
                        (buttonClick)="showToast('Default clicked!')"
                      >
                        Default
                      </and-button>
                      <and-button variant="secondary">Secondary</and-button>
                      <and-button variant="destructive">Destructive</and-button>
                      <and-button variant="outline">Outline</and-button>
                      <and-button variant="ghost">Ghost</and-button>
                    </div>

                    <div class="h-px bg-border"></div>

                    <div class="flex flex-wrap gap-3">
                      <and-button variant="default" size="sm">Small</and-button>
                      <and-button variant="default">Default</and-button>
                      <and-button variant="default" size="lg">Large</and-button>
                    </div>

                    <div class="h-px bg-border"></div>

                    <div class="flex flex-wrap gap-3">
                      <and-button
                        variant="default"
                        [loading]="buttonLoading()"
                        (buttonClick)="toggleButtonLoading()"
                      >
                        {{ buttonLoading() ? 'Loading...' : 'Click to Load' }}
                      </and-button>
                      <and-button variant="outline" [disabled]="true">
                        Disabled
                      </and-button>
                    </div>

                    <div
                      class="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
                    >
                      <div
                        class="text-sm font-medium text-primary-900 dark:text-primary-200 mb-2"
                      >
                        ✨ Features:
                      </div>
                      <ul
                        class="text-xs text-primary-700 dark:text-primary-300 space-y-1"
                      >
                        <li>• <code>aria-busy</code> during loading state</li>
                        <li>• <code>aria-disabled</code> when disabled</li>
                        <li>• Automatic click prevention when inactive</li>
                        <li>• Customizable variants and sizes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-primary-950 rounded-2xl p-8 shadow-xl border border-primary-900 overflow-hidden"
                >
                  <h3 class="text-xl font-bold text-primary-foreground mb-6">
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-secondary"></span>
                      Code
                    </span>
                  </h3>
                  <pre
                    class="text-sm text-primary-200 overflow-x-auto"
                  ><code>{{ buttonCode }}</code></pre>
                </div>
              </div>
            </and-tabs-content>

            <!-- Dropdown Demo -->
            <and-tabs-content value="dropdown">
              <div class="grid md:grid-cols-2 gap-8">
                <div
                  class="bg-muted rounded-2xl p-8 shadow-xl border border-border"
                >
                  <h3
                    class="text-xl font-bold text-foreground mb-6"
                  >
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-accent"></span>
                      Preview
                    </span>
                  </h3>

                  <div class="space-y-6">
                    <div>
                      <label
                        class="block text-sm font-medium text-muted-foreground mb-2"
                      >
                        Select an option
                      </label>
                      <and-dropdown
                        label="Choose..."
                        [items]="dropdownItems"
                        (dropdownSelect)="onDropdownSelect($event)"
                      >
                      </and-dropdown>

                      <div
                        *ngIf="selectedItem()"
                        class="mt-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 rounded-lg border border-primary-200 dark:border-primary-800 animate-slide-up"
                      >
                        <div class="flex items-center gap-2">
                          <span class="text-2xl">✓</span>
                          <div>
                            <div
                              class="text-sm font-medium text-foreground"
                            >
                              Selected:
                            </div>
                            <div
                              class="text-lg font-bold text-primary dark:text-primary"
                            >
                              {{ selectedItem() }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg"
                    >
                      <div
                        class="text-sm font-medium text-secondary-900 dark:text-secondary-200 mb-2"
                      >
                        ⌨️ Keyboard Navigation:
                      </div>
                      <ul
                        class="text-xs text-secondary-700 dark:text-secondary-300 space-y-1"
                      >
                        <li>
                          •
                          <kbd
                            class="px-2 py-1 bg-muted rounded"
                            >Enter</kbd
                          >
                          /
                          <kbd
                            class="px-2 py-1 bg-muted rounded"
                            >Space</kbd
                          >
                          to open
                        </li>
                        <li>
                          •
                          <kbd
                            class="px-2 py-1 bg-muted rounded"
                            >Esc</kbd
                          >
                          to close
                        </li>
                        <li>
                          •
                          <kbd
                            class="px-2 py-1 bg-muted rounded"
                            >↑</kbd
                          >
                          <kbd
                            class="px-2 py-1 bg-muted rounded"
                            >↓</kbd
                          >
                          to navigate items
                        </li>
                        <li>• Click outside to close</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-primary-950 rounded-2xl p-8 shadow-xl border border-primary-900 overflow-hidden"
                >
                  <h3 class="text-xl font-bold text-primary-foreground mb-6">
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-secondary"></span>
                      Code
                    </span>
                  </h3>
                  <pre
                    class="text-sm text-primary-200 overflow-x-auto"
                  ><code>{{ dropdownCode }}</code></pre>
                </div>
              </div>
            </and-tabs-content>

            <!-- Tabs Demo -->
            <and-tabs-content value="tabs">
              <div class="grid md:grid-cols-2 gap-8">
                <div
                  class="bg-muted rounded-2xl p-8 shadow-xl border border-border"
                >
                  <h3
                    class="text-xl font-bold text-foreground mb-6"
                  >
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-accent"></span>
                      Preview
                    </span>
                  </h3>

                  <and-tabs
                    value="tab1"
                    (valueChange)="currentTab.set($event.detail)"
                  >
                    <and-tabs-list>
                      <and-tabs-trigger value="tab1">Dashboard</and-tabs-trigger>
                      <and-tabs-trigger value="tab2">Analytics</and-tabs-trigger>
                      <and-tabs-trigger value="tab3">Settings</and-tabs-trigger>
                    </and-tabs-list>

                    <and-tabs-content value="tab1">
                      <div
                        class="mt-6 p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 rounded-xl border border-primary-200 dark:border-primary-800"
                      >
                        <div class="flex items-center gap-3 mb-3">
                          <div
                            class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-2xl"
                          >
                            📊
                          </div>
                          <div>
                            <h4 class="font-bold text-foreground">
                              Dashboard
                            </h4>
                            <p class="text-sm text-muted-foreground">
                              Overview of your metrics
                            </p>
                          </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4 mt-4">
                          <div class="bg-card p-3 rounded-lg">
                            <div class="text-2xl font-bold text-primary">
                              127
                            </div>
                            <div
                              class="text-xs text-muted-foreground"
                            >
                              Views
                            </div>
                          </div>
                          <div class="bg-card p-3 rounded-lg">
                            <div class="text-2xl font-bold text-success">
                              94%
                            </div>
                            <div
                              class="text-xs text-muted-foreground"
                            >
                              Success
                            </div>
                          </div>
                          <div class="bg-card p-3 rounded-lg">
                            <div class="text-2xl font-bold text-secondary-foreground">
                              1.2s
                            </div>
                            <div
                              class="text-xs text-muted-foreground"
                            >
                              Avg Time
                            </div>
                          </div>
                        </div>
                      </div>
                    </and-tabs-content>

                    <and-tabs-content value="tab2">
                      <div
                        class="mt-6 p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-900/10 rounded-xl border border-secondary-200 dark:border-secondary-800"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary-foreground text-2xl"
                          >
                            📈
                          </div>
                          <div>
                            <h4 class="font-bold text-foreground">
                              Analytics Content
                            </h4>
                            <p class="text-muted-foreground">
                              Detailed analytics and insights
                            </p>
                          </div>
                        </div>
                      </div>
                    </and-tabs-content>

                    <and-tabs-content value="tab3">
                      <div
                        class="mt-6 p-6 bg-gradient-to-br from-muted to-muted dark:from-muted dark:to-muted rounded-xl border border-border"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 bg-muted-foreground rounded-xl flex items-center justify-center text-primary-foreground text-2xl"
                          >
                            ⚙️
                          </div>
                          <div>
                            <h4 class="font-bold text-foreground">
                              Settings
                            </h4>
                            <p class="text-muted-foreground">
                              Configure your preferences
                            </p>
                          </div>
                        </div>
                      </div>
                    </and-tabs-content>
                  </and-tabs>

                  <div
                    class="mt-6 p-4 bg-primary-100 dark:bg-primary-900/20 rounded-lg"
                  >
                    <div
                      class="text-sm font-medium text-primary-900 dark:text-primary-200 mb-2"
                    >
                      ⌨️ Keyboard:
                    </div>
                    <ul
                      class="text-xs text-primary-700 dark:text-primary-300 space-y-1"
                    >
                      <li>
                        •
                        <kbd class="px-2 py-1 bg-muted rounded"
                          >←</kbd
                        >
                        <kbd class="px-2 py-1 bg-muted rounded"
                          >→</kbd
                        >
                        Navigate tabs
                      </li>
                      <li>
                        •
                        <kbd class="px-2 py-1 bg-muted rounded"
                          >Home</kbd
                        >
                        First tab
                      </li>
                      <li>
                        •
                        <kbd class="px-2 py-1 bg-muted rounded"
                          >End</kbd
                        >
                        Last tab
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  class="bg-primary-950 rounded-2xl p-8 shadow-xl border border-primary-900 overflow-hidden"
                >
                  <h3 class="text-xl font-bold text-primary-foreground mb-6">
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-secondary"></span>
                      Code
                    </span>
                  </h3>
                  <pre
                    class="text-sm text-primary-200 overflow-x-auto"
                  ><code>{{ tabsCode }}</code></pre>
                </div>
              </div>
            </and-tabs-content>

            <!-- Accordion Demo -->
            <and-tabs-content value="accordion">
              <div class="grid md:grid-cols-2 gap-8">
                <div
                  class="bg-muted rounded-2xl p-8 shadow-xl border border-border"
                >
                  <h3
                    class="text-xl font-bold text-foreground mb-6"
                  >
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-accent"></span>
                      Preview
                    </span>
                  </h3>

                  <and-accordion>
                    <and-accordion-item value="q1">
                      <and-accordion-trigger value="q1">
                        <span class="font-semibold"
                          >What is a headless component?</span
                        >
                      </and-accordion-trigger>
                      <and-accordion-content value="q1">
                        <div
                          class="text-muted-foreground leading-relaxed"
                        >
                          A headless component provides the
                          <strong>logic and behavior</strong> without dictating
                          the visual presentation. It separates state
                          management, keyboard navigation, and accessibility
                          from the UI layer.
                        </div>
                      </and-accordion-content>
                    </and-accordion-item>

                    <and-accordion-item value="q2">
                      <and-accordion-trigger value="q2">
                        <span class="font-semibold"
                          >Why use headless components?</span
                        >
                      </and-accordion-trigger>
                      <and-accordion-content value="q2">
                        <div
                          class="text-muted-foreground leading-relaxed space-y-2"
                        >
                          <p>
                            <strong>✓ Framework Agnostic:</strong> Works in
                            React, Vue, Angular, or vanilla JS
                          </p>
                          <p>
                            <strong>✓ Accessibility:</strong> ARIA attributes
                            and keyboard support built-in
                          </p>
                          <p>
                            <strong>✓ Design Freedom:</strong> Complete control
                            over styling
                          </p>
                          <p>
                            <strong>✓ Testable:</strong> Logic can be tested
                            independently
                          </p>
                        </div>
                      </and-accordion-content>
                    </and-accordion-item>

                    <and-accordion-item value="q3">
                      <and-accordion-trigger value="q3">
                        <span class="font-semibold">How does it work?</span>
                      </and-accordion-trigger>
                      <and-accordion-content value="q3">
                        <div
                          class="text-muted-foreground leading-relaxed"
                        >
                          The headless-core library provides factory functions
                          like
                          <code
                            class="px-2 py-1 bg-muted rounded"
                            >createButton()</code
                          >
                          that return state, actions, and prop getters. Stencil
                          components consume this logic and render the UI.
                        </div>
                      </and-accordion-content>
                    </and-accordion-item>
                  </and-accordion>

                  <div
                    class="mt-6 p-4 bg-success/10 dark:bg-success/20 rounded-lg"
                  >
                    <div
                      class="text-sm font-medium text-success dark:text-success mb-2"
                    >
                      ✨ Features:
                    </div>
                    <ul
                      class="text-xs text-success dark:text-success space-y-1"
                    >
                      <li>• Smooth expand/collapse animations</li>
                      <li>• Proper ARIA attributes for screen readers</li>
                      <li>• Keyboard navigation support</li>
                      <li>• Single or multiple items can be open</li>
                    </ul>
                  </div>
                </div>

                <div
                  class="bg-primary-950 rounded-2xl p-8 shadow-xl border border-primary-900 overflow-hidden"
                >
                  <h3 class="text-xl font-bold text-primary-foreground mb-6">
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-secondary"></span>
                      Code
                    </span>
                  </h3>
                  <pre
                    class="text-sm text-primary-200 overflow-x-auto"
                  ><code>{{ accordionCode }}</code></pre>
                </div>
              </div>
            </and-tabs-content>
          </and-tabs>
        </div>

        <!-- Architecture Section -->
        <div class="mb-16">
          <h2
            class="text-3xl font-bold text-foreground mb-8 text-center"
          >
            How It Works
          </h2>

          <div
            class="bg-muted rounded-3xl p-8 shadow-2xl border border-border"
          >
            <div class="grid md:grid-cols-3 gap-8">
              <!-- Layer 1 -->
              <div class="relative">
                <div
                  class="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-2xl opacity-10 animate-pulse"
                ></div>
                <div
                  class="relative bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-6 text-primary-foreground shadow-xl"
                >
                  <div class="text-4xl mb-4">🎯</div>
                  <h3 class="text-xl font-bold mb-3">Headless Core</h3>
                  <p class="text-primary-100 text-sm mb-4">
                    Pure TypeScript logic with no UI dependencies
                  </p>
                  <div class="space-y-2">
                    <div
                      class="text-xs bg-primary-foreground/20 rounded px-2 py-1 font-mono"
                    >
                      createButton()
                    </div>
                    <div
                      class="text-xs bg-primary-foreground/20 rounded px-2 py-1 font-mono"
                    >
                      createTabs()
                    </div>
                    <div
                      class="text-xs bg-primary-foreground/20 rounded px-2 py-1 font-mono"
                    >
                      createDropdown()
                    </div>
                  </div>
                </div>
              </div>

              <!-- Arrow -->
              <div class="hidden md:flex items-center justify-center">
                <svg
                  class="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </div>

              <!-- Layer 2 -->
              <div class="relative">
                <div
                  class="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-2xl opacity-10 animate-pulse"
                  style="animation-delay: 0.2s"
                ></div>
                <div
                  class="relative bg-gradient-to-br from-secondary to-secondary-700 rounded-2xl p-6 text-primary-foreground shadow-xl"
                >
                  <div class="text-4xl mb-4">🎨</div>
                  <h3 class="text-xl font-bold mb-3">Stencil Components</h3>
                  <p class="text-secondary-100 text-sm mb-4">
                    Web Components with visual presentation
                  </p>
                  <div class="space-y-2">
                    <div
                      class="text-xs bg-primary-foreground/20 rounded px-2 py-1 font-mono"
                    >
                      &lt;and-button&gt;
                    </div>
                    <div
                      class="text-xs bg-primary-foreground/20 rounded px-2 py-1 font-mono"
                    >
                      &lt;and-tabs&gt;
                    </div>
                    <div
                      class="text-xs bg-primary-foreground/20 rounded px-2 py-1 font-mono"
                    >
                      &lt;and-dropdown&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
            >
              <h4 class="font-bold text-foreground mb-3">
                💡 The Result
              </h4>
              <p
                class="text-muted-foreground text-sm leading-relaxed"
              >
                The headless core handles all the complex logic, state
                management, and accessibility concerns. Stencil components
                simply consume this logic and focus on rendering beautiful,
                customizable UI. This separation makes components easier to
                test, maintain, and reuse across different frameworks.
              </p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div
            class="bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-6 text-primary-foreground shadow-xl"
          >
            <div class="text-4xl font-bold mb-2">4</div>
            <div class="text-primary-100 text-sm">Components Integrated</div>
          </div>
          <div
            class="bg-gradient-to-br from-secondary to-secondary-600 rounded-2xl p-6 text-primary-foreground shadow-xl"
          >
            <div class="text-4xl font-bold mb-2">100%</div>
            <div class="text-secondary-100 text-sm">Type Safe</div>
          </div>
          <div
            class="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-primary-foreground shadow-xl"
          >
            <div class="text-4xl font-bold mb-2">0</div>
            <div class="text-secondary-100 text-sm">Runtime Dependencies</div>
          </div>
          <div
            class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-primary-foreground shadow-xl"
          >
            <div class="text-4xl font-bold mb-2">∞</div>
            <div class="text-primary-100 text-sm">Framework Support</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.6s ease-out;
      }

      .animate-slide-up {
        animation: slide-up 0.6s ease-out;
      }

      .bg-grid-slate-200\/50 {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(203 213 225 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
      }

      .dark .bg-grid-slate-700\/25 {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.25)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
      }

      code {
        font-family: 'Courier New', monospace;
      }

      kbd {
        font-family: 'Courier New', monospace;
        font-size: 0.75rem;
      }
    `,
  ],
})
export default class HeadlessDemoComponent {
  activeDemo = signal('button');
  buttonLoading = signal(false);
  selectedItem = signal('');
  currentTab = signal('tab1');

  dropdownItems = [
    { text: '🚀 Option One', value: 'option-1' },
    { text: '⭐ Option Two', value: 'option-2' },
    { text: '💎 Option Three', value: 'option-3' },
    { text: '🎯 Premium Option', value: 'option-4' },
  ];

  buttonCode = `// Headless Core
const buttonLogic = createButton({
  disabled: false,
  loading: false,
  onClick: (e) => handleClick(e)
});

// Stencil Component
<button 
  {...buttonLogic.getButtonProps()}
  onClick={(e) => buttonLogic.actions.click(e)}
>
  {loading && <Spinner />}
  <slot />
</button>`;

  dropdownCode = `// Headless Core
const dropdown = createDropdown({
  placement: 'bottom',
  closeOnSelect: true,
  onOpenChange: (open) => setState(open)
});

// Usage
<div {...dropdown.getTriggerProps()}>
  <button onClick={dropdown.actions.toggle}>
    Open Menu
  </button>
</div>

<div {...dropdown.getMenuProps()}>
  {items.map(item => (
    <div {...dropdown.getItemProps(item.id)}>
      {item.text}
    </div>
  ))}
</div>`;

  tabsCode = `// Headless Core
const tabs = createTabs({
  value: 'tab1',
  onValueChange: (v) => setValue(v)
});

// Usage
<div role="tablist">
  <button {...tabs.getTabTriggerProps('tab1')}>
    Tab 1
  </button>
  <button {...tabs.getTabTriggerProps('tab2')}>
    Tab 2
  </button>
</div>

<div {...tabs.getContentProps('tab1')}>
  Content 1
</div>`;

  accordionCode = `// Headless Core  
const accordion = createAccordion({
  multiple: false,
  onValueChange: (v) => setOpen(v)
});

// Usage
<and-accordion>
  <and-accordion-item value="item-1">
    <and-accordion-trigger value="item-1">
      Question 1
    </and-accordion-trigger>
    <and-accordion-content value="item-1">
      Answer 1
    </and-accordion-content>
  </and-accordion-item>
</and-accordion>`;

  toggleButtonLoading() {
    this.buttonLoading.set(true);
    setTimeout(() => this.buttonLoading.set(false), 2000);
  }

  onDropdownSelect(event: any) {
    this.selectedItem.set(event.detail);
  }

  showToast(message: string) {
    console.log(message);
  }
}
