import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motion, MotionAnimations } from '@my-lib/motion-core';

@Component({
  selector: 'app-custom-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12 px-6">
      <!-- Header -->
      <header
        class="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-10 pt-12"
      >
        <h1
          class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0"
        >
          Custom Animation
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Customize duration, easing, and delay. Create the perfect feel for
          your interactions.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2
          class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5"
        >
          Preview
        </h2>

        <!-- Controls -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Duration -->
          <div class="flex flex-col gap-2">
            <label
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Duration
            </label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                [(ngModel)]="customDuration"
                class="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span
                class="text-xs font-mono w-12 text-right text-zinc-600 dark:text-zinc-400"
                >{{ customDuration }}ms</span
              >
            </div>
          </div>

          <!-- Easing -->
          <div class="flex flex-col gap-2">
            <label
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Easing
            </label>
            <select
              [(ngModel)]="customEasing"
              class="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
              <option value="linear">linear</option>
              <option value="cubic-bezier(0.68,-0.55,0.265,1.55)">
                spring
              </option>
            </select>
          </div>

          <!-- Delay -->
          <div class="flex flex-col gap-2">
            <label
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Delay
            </label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                [(ngModel)]="customDelay"
                class="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span
                class="text-xs font-mono w-12 text-right text-zinc-600 dark:text-zinc-400"
                >{{ customDelay }}ms</span
              >
            </div>
          </div>
        </div>

        <div class="flex mb-6">
          <button
            (click)="playCustom()"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-2 shadow"
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
            Play Animation
          </button>
        </div>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[300px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div
              #customBox
              class="w-24 h-24 bg-rose-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white gap-2 select-none"
              style="display: none;"
            >
              <span class="text-3xl">⚙️</span>
              <span class="font-bold text-xs">Custom</span>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-100"
          ><code><span class="text-purple-400">await</span> Motion.enter(el, MotionAnimations.BounceIn, {{ '{' }}
  duration: {{ customDuration }},
  easing: '{{ customEasing }}',
  delay: {{ customDelay }}
{{ '}' }});</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class CustomDemoComponent implements AfterViewInit {
  @ViewChild('customBox') customBox!: ElementRef<HTMLElement>;
  customDuration = 500;
  customEasing = 'ease';
  customDelay = 0;

  ngAfterViewInit() {}

  async playCustom() {
    this.customBox.nativeElement.style.display = 'none';
    await Motion.enter(
      this.customBox.nativeElement,
      MotionAnimations.BounceIn,
      {
        duration: this.customDuration,
        easing: this.customEasing,
        delay: this.customDelay,
      },
    );
  }
}
