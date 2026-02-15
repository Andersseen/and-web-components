import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-slide-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Slide Animations
        </h1>
        <p class="text-base text-zinc-500">
          Slide elements in and out from any direction.
        </p>
      </div>

      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Directional</span
          >
          <h2 class="text-xl font-bold mb-1">Slide In & Out</h2>
          <p class="text-sm text-zinc-500">
            Directional enter/leave animations from all four edges.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div class="flex flex-col gap-2">
            <span
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >Slide In</span
            >
            <div class="flex flex-wrap gap-1.5">
              <my-button size="sm" (click)="slideIn('top')">↑ Top</my-button>
              <my-button size="sm" (click)="slideIn('bottom')"
                >↓ Bottom</my-button
              >
              <my-button size="sm" (click)="slideIn('left')">← Left</my-button>
              <my-button size="sm" (click)="slideIn('right')"
                >→ Right</my-button
              >
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >Slide Out</span
            >
            <div class="flex flex-wrap gap-1.5">
              <my-button size="sm" variant="outline" (click)="slideOut('top')"
                >↑ Top</my-button
              >
              <my-button
                size="sm"
                variant="outline"
                (click)="slideOut('bottom')"
                >↓ Bottom</my-button
              >
              <my-button size="sm" variant="outline" (click)="slideOut('left')"
                >← Left</my-button
              >
              <my-button size="sm" variant="outline" (click)="slideOut('right')"
                >→ Right</my-button
              >
            </div>
          </div>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4 overflow-hidden relative"
        >
          <div
            #slideBox
            class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-green-500 to-green-700"
            style="display: none;"
          >
            <span class="text-2xl">🚀</span>
            <span>Slide!</span>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >await Motion.enter(el, MotionAnimations.SlideInLeft);</code
          >
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class SlideDemoComponent implements AfterViewInit {
  @ViewChild('slideBox') slideBox!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async slideIn(direction: 'top' | 'bottom' | 'left' | 'right') {
    const map: Record<string, string> = {
      top: MotionAnimations.SlideInTop,
      bottom: MotionAnimations.SlideInBottom,
      left: MotionAnimations.SlideInLeft,
      right: MotionAnimations.SlideInRight,
    };
    this.slideBox.nativeElement.style.display = 'none';
    setTimeout(
      () => Motion.enter(this.slideBox.nativeElement, map[direction]),
      30,
    );
  }

  async slideOut(direction: 'top' | 'bottom' | 'left' | 'right') {
    const map: Record<string, string> = {
      top: MotionAnimations.SlideOutTop,
      bottom: MotionAnimations.SlideOutBottom,
      left: MotionAnimations.SlideOutLeft,
      right: MotionAnimations.SlideOutRight,
    };
    await Motion.leave(this.slideBox.nativeElement, map[direction]);
  }
}
