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
  selector: 'app-tap-demo',
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
          Tap Effects
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Trigger animations on click/tap with automatic cleanup. Ideal for
          mobile interactions and playful feedback.
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
              Tap Cards
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              Click any card to trigger its bound animation.
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
                #tapBox1
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer select-none shadow-md bg-blue-500"
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
                #tapBox2
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer select-none shadow-md bg-violet-500"
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span>Bounce</span>
              </div>
              <div
                #tapBox3
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer select-none shadow-md bg-green-500"
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
          ><code><span class="text-purple-400">const</span> unbind = Motion.bindTap(el, MotionAnimations.BounceIn, {{ '{' }} duration: 150 {{ '}' }});</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class TapDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tapBox1') tapBox1!: ElementRef<HTMLElement>;
  @ViewChild('tapBox2') tapBox2!: ElementRef<HTMLElement>;
  @ViewChild('tapBox3') tapBox3!: ElementRef<HTMLElement>;

  private cleanups: (() => void)[] = [];

  ngAfterViewInit() {
    this.cleanups.push(
      Motion.bindTap(this.tapBox1.nativeElement, MotionAnimations.ScaleIn, {
        duration: 150,
      }),
    );
    this.cleanups.push(
      Motion.bindTap(this.tapBox2.nativeElement, MotionAnimations.BounceIn, {
        duration: 300,
      }),
    );
    this.cleanups.push(
      Motion.bindTap(this.tapBox3.nativeElement, MotionAnimations.RotateIn, {
        duration: 250,
      }),
    );
  }

  ngOnDestroy() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
  }
}
