import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionDirective } from '@my-lib/motion-core';

@Component({
  selector: 'app-attribute-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12 px-6" #demoRoot>
      <!-- Header -->
      <header
        class="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-10 pt-12"
      >
        <h1
          class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0"
        >
          Attribute API
        </h1>
        <p
          class="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          Declare animations directly in HTML — zero TypeScript required.
        </p>
      </header>

      <!-- Enter Trigger -->
      <section class="mb-12">
        <h2
          class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5"
        >
          Scroll Into View
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Elements animate automatically when they enter the viewport. Added
          <code
            class="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs"
            >my-motion-repeat</code
          >
          to demo repeating animations.
        </p>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[200px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div class="flex gap-4 justify-center flex-wrap">
              <div
                my-motion="fade-in"
                my-motion-repeat
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-lg bg-blue-500"
              >
                <span class="text-2xl">👋</span>
                <span>Fade</span>
              </div>
              <div
                my-motion="scale-in"
                my-motion-repeat
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-lg bg-violet-500"
              >
                <span class="text-2xl">✨</span>
                <span>Scale</span>
              </div>
              <div
                my-motion="bounce-in"
                my-motion-repeat
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-lg bg-green-500"
              >
                <span class="text-2xl">🎉</span>
                <span>Bounce</span>
              </div>
              <div
                my-motion="rotate-in"
                my-motion-repeat
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-lg bg-amber-500"
              >
                <span class="text-2xl">🔄</span>
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
          ><code>&lt;div my-motion="fade-in" my-motion-repeat&gt;Hello&lt;/div&gt;</code></pre>
        </div>
      </section>

      <!-- Hover Trigger -->
      <section class="mb-12">
        <h2
          class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5"
        >
          Hover Effects
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Combine enter and leave animations on mouse hover.
        </p>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[200px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div class="flex gap-4 justify-center flex-wrap">
              <div
                my-motion="scale-in"
                my-motion-trigger="hover"
                my-motion-leave="scale-out"
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-md transition-shadow duration-200 hover:shadow-xl cursor-pointer bg-teal-500"
              >
                <span class="text-2xl">🎯</span>
                <span>Scale</span>
              </div>
              <div
                my-motion="rotate-in"
                my-motion-trigger="hover"
                my-motion-leave="scale-out"
                my-motion-duration="250"
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-md transition-shadow duration-200 hover:shadow-xl cursor-pointer bg-rose-500"
              >
                <span class="text-2xl">🔄</span>
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
          ><code>&lt;div my-motion="scale-in" my-motion-trigger="hover" my-motion-leave="scale-out"&gt;Card&lt;/div&gt;</code></pre>
        </div>
      </section>

      <!-- Tap Trigger -->
      <section class="mb-12">
        <h2
          class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5"
        >
          Click / Tap
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Trigger animations on click or tap.
        </p>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm overflow-hidden mb-6"
        >
          <div
            class="p-12 flex items-center justify-center min-h-[200px] bg-zinc-50/50 dark:bg-zinc-900/50 relative"
          >
            <div class="flex gap-4 justify-center flex-wrap">
              <div
                my-motion="bounce-in"
                my-motion-trigger="tap"
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-md cursor-pointer select-none bg-blue-500"
              >
                <span class="text-2xl">💥</span>
                <span>Bounce</span>
              </div>
              <div
                my-motion="scale-in"
                my-motion-trigger="tap"
                my-motion-duration="150"
                class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl text-white font-semibold text-sm shadow-md cursor-pointer select-none bg-violet-500"
              >
                <span class="text-2xl">🎯</span>
                <span>Scale</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-100"
          ><code>&lt;button my-motion="bounce-in" my-motion-trigger="tap"&gt;Click me&lt;/button&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class AttributeDemoComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('demoRoot') demoRoot!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Initialize the directive on this component's root element
    setTimeout(() => {
      MotionDirective.init(this.demoRoot.nativeElement);
    }, 50);
  }

  ngOnDestroy() {
    MotionDirective.destroy();
  }
}
