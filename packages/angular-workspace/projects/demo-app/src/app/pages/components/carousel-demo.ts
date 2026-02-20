import { Component } from '@angular/core';
import {
  AndCarousel,
  AndCarouselItem,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-carousel-demo',
  imports: [AndCarousel, AndCarouselItem],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Carousel
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A slideshow component for cycling through elements — images, cards, or
          any content. Supports autoplay and manual navigation.
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
          <div class="p-8">
            <and-carousel autoplay="true">
              <and-carousel-item>
                <div
                  class="h-[300px] rounded-lg bg-primary/10 flex flex-col items-center justify-center gap-3"
                >
                  <svg
                    class="text-primary"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span class="text-lg font-semibold text-foreground"
                    >Slide One</span
                  >
                  <span class="text-sm text-muted-foreground"
                    >Beautiful imagery starts here</span
                  >
                </div>
              </and-carousel-item>
              <and-carousel-item>
                <div
                  class="h-[300px] rounded-lg bg-accent flex flex-col items-center justify-center gap-3"
                >
                  <svg
                    class="text-accent-foreground/60"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    />
                  </svg>
                  <span class="text-lg font-semibold text-foreground"
                    >Slide Two</span
                  >
                  <span class="text-sm text-muted-foreground"
                    >Showcase your best content</span
                  >
                </div>
              </and-carousel-item>
              <and-carousel-item>
                <div
                  class="h-[300px] rounded-lg bg-secondary flex flex-col items-center justify-center gap-3"
                >
                  <svg
                    class="text-secondary-foreground/60"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                  <span class="text-lg font-semibold text-foreground"
                    >Slide Three</span
                  >
                  <span class="text-sm text-muted-foreground"
                    >Engage your audience</span
                  >
                </div>
              </and-carousel-item>
            </and-carousel>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
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
          ><code>&lt;and-carousel autoplay="true"&gt;
  &lt;and-carousel-item&gt;
    &lt;div&gt;Slide 1 content&lt;/div&gt;
  &lt;/and-carousel-item&gt;
  &lt;and-carousel-item&gt;
    &lt;div&gt;Slide 2 content&lt;/div&gt;
  &lt;/and-carousel-item&gt;
&lt;/and-carousel&gt;</code></pre>
        </div>
      </section>

      <!-- Features -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Features
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">Autoplay</h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Automatic slide transitions with configurable intervals.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Navigation
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Next/previous controls and dot indicators built-in.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Touch Friendly
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Responsive design with swipe support on mobile devices.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export default class CarouselDemo {}
