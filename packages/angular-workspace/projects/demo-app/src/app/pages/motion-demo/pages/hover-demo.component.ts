import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';

@Component({
  selector: 'app-hover-demo',
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
          Hover Effects
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Bind enter/leave animations to mouse hover — with automatic cleanup.
          Perfect for cards, buttons, and interactive elements.
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
              Hover Cards
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              Hover over each card to trigger a different animation.
            </p>
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[300px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div class="flex gap-4 justify-center flex-wrap">
              <div
                #hoverBox1
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md bg-amber-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M15 3h6v6" />
                  <path d="M9 21H3v-6" />
                  <path d="M21 3l-7 7" />
                  <path d="M3 21l7-7" />
                </svg>
                <span>Scale</span>
              </div>
              <div
                #hoverBox2
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md bg-teal-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
                <span>Slide</span>
              </div>
              <div
                #hoverBox3
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md bg-rose-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Rotate</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-100"
          ><code><span class="text-purple-400">const</span> unbind = Motion.bindHover(el, MotionAnimations.ScaleIn, MotionAnimations.ScaleOut);</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class HoverDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hoverBox1') hoverBox1!: ElementRef<HTMLElement>;
  @ViewChild('hoverBox2') hoverBox2!: ElementRef<HTMLElement>;
  @ViewChild('hoverBox3') hoverBox3!: ElementRef<HTMLElement>;

  private cleanups: (() => void)[] = [];

  ngAfterViewInit() {
    this.cleanups.push(
      Motion.bindHover(
        this.hoverBox1.nativeElement,
        MotionAnimations.ScaleIn,
        MotionAnimations.ScaleOut,
        { duration: 200 },
      ),
    );
    this.cleanups.push(
      Motion.bindHover(
        this.hoverBox2.nativeElement,
        MotionAnimations.SlideInBottom,
        MotionAnimations.SlideOutBottom,
        { duration: 200 },
      ),
    );
    this.cleanups.push(
      Motion.bindHover(
        this.hoverBox3.nativeElement,
        MotionAnimations.RotateIn,
        MotionAnimations.ScaleOut,
        { duration: 250 },
      ),
    );
  }

  ngOnDestroy() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
  }
}
