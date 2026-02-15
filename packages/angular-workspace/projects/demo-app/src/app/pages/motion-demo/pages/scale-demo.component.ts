import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';

@Component({
  selector: 'app-scale-demo',
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
          Scale & Rotate
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Playful entrance and exit effects using transform properties. Great for
          drawing attention to new content.
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
              Entrance Effects
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              Combine scaling and rotation for dynamic reveals.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <button
            (click)="playScaleIn()"
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
                d="M15 3h6v6"
              />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
            Scale In
          </button>
          <button
            (click)="playBounceIn()"
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
                d="M22 12h-4l-3 9L9 3l-3 9H2"
              />
            </svg>
            Bounce In
          </button>
          <button
            (click)="playRotateIn()"
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
                d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
              />
              <path d="M21 3v5h-5" />
            </svg>
            Rotate In
          </button>
          <div class="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
          <button
            (click)="playScaleOut()"
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
                d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
              />
            </svg>
            Scale Out
          </button>
        </div>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[300px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div
              #scaleBox
              class="w-32 h-32 bg-violet-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white gap-2 select-none"
              style="display: none;"
            >
              <span class="text-4xl">✨</span>
              <span class="font-bold">Poof!</span>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-100"
          ><code><span class="text-purple-400">await</span> Motion.enter(el, MotionAnimations.BounceIn);</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class ScaleDemoComponent implements AfterViewInit {
  @ViewChild('scaleBox') scaleBox!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async playScaleIn() {
    this.scaleBox.nativeElement.style.display = 'none';
    await Motion.enter(this.scaleBox.nativeElement, MotionAnimations.ScaleIn);
  }

  async playScaleOut() {
    await Motion.leave(this.scaleBox.nativeElement, MotionAnimations.ScaleOut);
  }

  async playBounceIn() {
    this.scaleBox.nativeElement.style.display = 'none';
    await Motion.enter(this.scaleBox.nativeElement, MotionAnimations.BounceIn);
  }

  async playRotateIn() {
    this.scaleBox.nativeElement.style.display = 'none';
    await Motion.enter(this.scaleBox.nativeElement, MotionAnimations.RotateIn);
  }
}
