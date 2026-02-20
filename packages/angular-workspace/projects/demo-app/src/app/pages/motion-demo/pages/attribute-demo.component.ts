import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionDirective } from '@andersseen/motion-core';

@Component({
  selector: 'app-attribute-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6" #demoRoot>
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Attribute API
        </h1>
        <p class="text-base text-zinc-500">
          Declare animations directly in HTML — zero TypeScript required.
        </p>
      </div>

      <!-- ========== Enter Trigger ========== -->
      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Enter</span
          >
          <h2 class="text-xl font-bold mb-1">Scroll Into View</h2>
          <p class="text-sm text-zinc-500">
            Elements animate automatically when they enter the viewport. Added
            <code>and-motion-repeat</code> to demo repeating animations.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex gap-4 justify-center flex-wrap">
            <div
              and-motion="fade-in"
              and-motion-repeat
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-lg bg-gradient-to-br from-blue-500 to-blue-700"
            >
              <span class="text-2xl">👋</span>
              <span>Fade</span>
            </div>
            <div
              and-motion="scale-in"
              and-motion-repeat
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-lg bg-gradient-to-br from-violet-500 to-violet-700"
            >
              <span class="text-2xl">✨</span>
              <span>Scale</span>
            </div>
            <div
              and-motion="bounce-in"
              and-motion-repeat
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-lg bg-gradient-to-br from-green-500 to-green-700"
            >
              <span class="text-2xl">🎉</span>
              <span>Bounce</span>
            </div>
            <div
              and-motion="rotate-in"
              and-motion-repeat
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-lg bg-gradient-to-br from-amber-500 to-amber-700"
            >
              <span class="text-2xl">🔄</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >&lt;div and-motion="fade-in"
            and-motion-repeat&gt;Hello&lt;/div&gt;</code
          >
        </div>
      </section>

      <!-- ========== Hover Trigger ========== -->
      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Hover</span
          >
          <h2 class="text-xl font-bold mb-1">Hover Effects</h2>
          <p class="text-sm text-zinc-500">
            Combine enter and leave animations on mouse hover.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex gap-4 justify-center flex-wrap">
            <div
              and-motion="scale-in"
              and-motion-trigger="hover"
              and-motion-leave="scale-out"
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-md transition-shadow duration-200 hover:shadow-xl cursor-pointer bg-gradient-to-br from-teal-500 to-teal-700"
            >
              <span class="text-2xl">🎯</span>
              <span>Scale</span>
            </div>
            <div
              and-motion="rotate-in"
              and-motion-trigger="hover"
              and-motion-leave="scale-out"
              and-motion-duration="250"
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-md transition-shadow duration-200 hover:shadow-xl cursor-pointer bg-gradient-to-br from-rose-500 to-rose-700"
            >
              <span class="text-2xl">🔄</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >&lt;div and-motion="scale-in" and-motion-trigger="hover"
            and-motion-leave="scale-out"&gt;Card&lt;/div&gt;</code
          >
        </div>
      </section>

      <!-- ========== Tap Trigger ========== -->
      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Tap</span
          >
          <h2 class="text-xl font-bold mb-1">Click / Tap</h2>
          <p class="text-sm text-zinc-500">
            Trigger animations on click or tap — great for buttons and
            interactive elements.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex gap-4 justify-center flex-wrap">
            <div
              and-motion="bounce-in"
              and-motion-trigger="tap"
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-md transition-shadow duration-150 select-none active:shadow-sm cursor-pointer bg-gradient-to-br from-blue-500 to-blue-700"
            >
              <span class="text-2xl">💥</span>
              <span>Bounce</span>
            </div>
            <div
              and-motion="scale-in"
              and-motion-trigger="tap"
              and-motion-duration="150"
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-md transition-shadow duration-150 select-none active:shadow-sm cursor-pointer bg-gradient-to-br from-violet-500 to-violet-700"
            >
              <span class="text-2xl">🎯</span>
              <span>Scale</span>
            </div>
            <div
              and-motion="rotate-in"
              and-motion-trigger="tap"
              and-motion-duration="250"
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-md transition-shadow duration-150 select-none active:shadow-sm cursor-pointer bg-gradient-to-br from-green-500 to-green-700"
            >
              <span class="text-2xl">🌀</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >&lt;button and-motion="bounce-in" and-motion-trigger="tap"&gt;Click
            me&lt;/button&gt;</code
          >
        </div>
      </section>

      <!-- ========== Custom Options ========== -->
      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Options</span
          >
          <h2 class="text-xl font-bold mb-1">
            Custom Duration, Easing & Delay
          </h2>
          <p class="text-sm text-zinc-500">
            Fine-tune animations with extra attributes — no JS needed.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex gap-4 justify-center flex-wrap">
            <div
              and-motion="slide-in-left"
              and-motion-duration="800"
              and-motion-easing="ease-in-out"
              and-motion-repeat
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-lg bg-gradient-to-br from-rose-500 to-rose-700"
            >
              <span class="text-2xl">⚙️</span>
              <span>Slow</span>
            </div>
            <div
              and-motion="slide-in-right"
              and-motion-duration="300"
              and-motion-delay="400"
              and-motion-repeat
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-primary-foreground font-semibold text-sm shadow-lg bg-gradient-to-br from-teal-500 to-teal-700"
            >
              <span class="text-2xl">⏱</span>
              <span>Delayed</span>
            </div>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >&lt;div and-motion="slide-in-left" and-motion-duration="800"
            and-motion-easing="ease-in-out"&gt;...&lt;/div&gt;</code
          >
        </div>
      </section>

      <!-- ========== Stagger ========== -->
      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Pattern</span
          >
          <h2 class="text-xl font-bold mb-1">Stagger</h2>
          <p class="text-sm text-zinc-500">
            Add <code>and-motion-stagger</code> on the parent to cascade children
            with incremental delays.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div
            class="flex flex-col gap-2 w-full max-w-sm"
            and-motion-stagger="100"
          >
            <div
              and-motion="slide-in-left"
              and-motion-repeat
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700"
              ></div>
              <span>Item 1</span>
            </div>
            <div
              and-motion="slide-in-left"
              and-motion-repeat
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-500 to-violet-700"
              ></div>
              <span>Item 2</span>
            </div>
            <div
              and-motion="slide-in-left"
              and-motion-repeat
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-green-500 to-green-700"
              ></div>
              <span>Item 3</span>
            </div>
            <div
              and-motion="slide-in-left"
              and-motion-repeat
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-amber-500 to-amber-700"
              ></div>
              <span>Item 4</span>
            </div>
            <div
              and-motion="slide-in-left"
              and-motion-repeat
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-rose-500 to-rose-700"
              ></div>
              <span>Item 5</span>
            </div>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >&lt;ul and-motion-stagger="100"&gt; &lt;li
            and-motion="slide-in-left"&gt;Item&lt;/li&gt; ... &lt;/ul&gt;</code
          >
        </div>
      </section>

      <!-- API Note -->
      <div
        class="flex items-start gap-3 p-4 rounded-xl bg-zinc-100 border border-zinc-200"
      >
        <span class="text-xl flex-shrink-0">💡</span>
        <p class="text-sm text-zinc-500 leading-relaxed m-0">
          Initialize once with
          <code
            class="bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-xs"
            >MotionDirective.init()</code
          >. For advanced control, use the TypeScript
          <code
            class="bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-xs"
            >Motion</code
          >
          class directly. Both approaches respect
          <code
            class="bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-xs"
            >prefers-reduced-motion</code
          >.
        </p>
      </div>
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
    // Use a small timeout to let Angular finish rendering
    setTimeout(() => {
      MotionDirective.init(this.demoRoot.nativeElement);
    }, 50);
  }

  ngOnDestroy() {
    MotionDirective.destroy();
  }
}
