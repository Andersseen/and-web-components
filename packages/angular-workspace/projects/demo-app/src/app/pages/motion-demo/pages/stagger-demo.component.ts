import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';

@Component({
  selector: 'app-stagger-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12 px-6">
      <!-- Header -->
      <header
        class="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-10 pt-12"
      >
        <h1
          class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0"
        >
          Staggered Animations
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Animate a group of elements sequentially. Adds rhythm and polish to
          lists, grids, and menus.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2
          class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5"
        >
          Preview
        </h2>

        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              List Reveal
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              Elements entering one after another.
            </p>
          </div>
          <div class="flex gap-2">
            <button
              (click)="playStagger()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 px-4 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play
            </button>
            <button
              (click)="resetStagger()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 px-4 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[300px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div class="flex flex-col gap-3 w-full max-w-sm">
              <div
                #staggerItem1
                class="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  1
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-16 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem2
                class="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-violet-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  2
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-28 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem3
                class="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  3
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-12 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem4
                class="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  4
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-20 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem5
                class="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-rose-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  5
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-22 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-14 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-100"
          ><code>items.forEach((el, i) => Motion.enter(el, MotionAnimations.SlideInLeft, {{ '{' }} delay: i * 80 {{ '}' }}));</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class StaggerDemoComponent implements AfterViewInit {
  @ViewChild('staggerItem1') staggerItem1!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem2') staggerItem2!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem3') staggerItem3!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem4') staggerItem4!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem5') staggerItem5!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async playStagger() {
    const items = [
      this.staggerItem1,
      this.staggerItem2,
      this.staggerItem3,
      this.staggerItem4,
      this.staggerItem5,
    ];

    // Reset all first
    items.forEach((item) => {
      item.nativeElement.style.display = 'none';
    });

    // Animate with staggered delays
    items.forEach((item, i) => {
      Motion.enter(item.nativeElement, MotionAnimations.SlideInLeft, {
        delay: i * 80,
      });
    });
  }

  resetStagger() {
    const items = [
      this.staggerItem1,
      this.staggerItem2,
      this.staggerItem3,
      this.staggerItem4,
      this.staggerItem5,
    ];
    items.forEach((item) => {
      item.nativeElement.style.display = 'none';
    });
  }
}
