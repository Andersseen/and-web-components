import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-fade-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Fade Animations
        </h1>
        <p class="text-base text-zinc-500">
          Show and hide elements with smooth opacity transitions.
        </p>
      </div>

      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Enter / Leave</span
          >
          <h2 class="text-xl font-bold mb-1">Fade In & Out</h2>
          <p class="text-sm text-zinc-500">
            The simplest enter/leave pattern. Smoothly transition element
            opacity.
          </p>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <my-button (click)="enterBox()">Fade In</my-button>
          <my-button variant="outline" (click)="leaveBox()">Fade Out</my-button>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div
            #fadeBox
            class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-blue-500 to-blue-700"
            style="display: none;"
          >
            <span class="text-2xl">👋</span>
            <span>Hello!</span>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >await Motion.enter(el, MotionAnimations.FadeIn);</code
          >
        </div>
      </section>

      <div
        class="flex items-start gap-3 p-4 rounded-xl bg-zinc-100 border border-zinc-200"
      >
        <span class="text-xl flex-shrink-0">♿</span>
        <p class="text-sm text-zinc-500 leading-relaxed m-0">
          All animations respect
          <code
            class="bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-xs"
            >prefers-reduced-motion: reduce</code
          >. Users who prefer reduced motion will see instant transitions.
        </p>
      </div>
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
