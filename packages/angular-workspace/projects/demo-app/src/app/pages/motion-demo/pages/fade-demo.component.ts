import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';

@Component({
  selector: 'app-fade-demo',
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
          Fade Animations
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Smooth opacity transitions for entering and leaving elements. Perfect
          for modal dialogs, notifications, and revealing content.
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
              Basic Fade
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              The most essential transition effect.
            </p>
          </div>
          <div class="flex gap-2">
            <button
              (click)="enterBox()"
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
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Fade In
            </button>
            <button
              (click)="leaveBox()"
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
                <path
                  d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                />
                <path
                  d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                />
                <path
                  d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
              Fade Out
            </button>
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[300px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div
              #fadeBox
              class="w-32 h-32 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center text-white text-3xl select-none"
              style="display: none;"
            >
              👋
            </div>
          </div>
        </div>

        <div
          class="rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-100"
          ><code><span class="text-purple-400">await</span> Motion.enter(element, MotionAnimations.FadeIn);
<span class="text-purple-400">await</span> Motion.leave(element, MotionAnimations.FadeOut);</code></pre>
        </div>
      </section>

      <!-- Accessibility Info -->
      <section class="mb-12">
        <div
          class="flex items-start gap-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800"
        >
          <div
            class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="16" cy="4" r="1" />
              <path d="m18 19 1-7-6 1" />
              <path d="m5 8 3-3 5.5 3-2.36 4.68" />
              <path d="M8 14v9c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-8" />
              <line x1="16" x2="16" y1="12" y2="20" />
            </svg>
          </div>
          <div>
            <h3
              class="font-medium text-blue-900 dark:text-blue-100 mb-1 text-sm"
            >
              Respects Preferences
            </h3>
            <p
              class="text-sm text-blue-700 dark:text-blue-300 leading-relaxed max-w-2xl"
            >
              All motion animations automatically check for
              <code
                class="px-1 py-0.5 rounded bg-blue-100/50 dark:bg-blue-900/30 font-mono text-xs"
                >prefers-reduced-motion</code
              >. If the user has requested reduced motion, transitions are
              skipped instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class FadeDemoComponent implements AfterViewInit {
  @ViewChild('fadeBox') fadeBox!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async enterBox() {
    await Motion.enter(this.fadeBox.nativeElement, MotionAnimations.FadeIn);
  }

  async leaveBox() {
    await Motion.leave(this.fadeBox.nativeElement, MotionAnimations.FadeOut);
  }
}
