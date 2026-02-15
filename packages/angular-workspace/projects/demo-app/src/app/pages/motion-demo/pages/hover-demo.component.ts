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
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Hover Effects
        </h1>
        <p class="text-base text-zinc-500">
          Bind enter/leave animations to mouse hover — with automatic cleanup.
        </p>
      </div>

      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Interaction</span
          >
          <h2 class="text-xl font-bold mb-1">Hover Cards</h2>
          <p class="text-sm text-zinc-500">
            Hover over each card to trigger a different animation. Cleanup
            functions prevent memory leaks.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex gap-4 justify-center flex-wrap">
            <div
              #hoverBox1
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-xl bg-gradient-to-br from-amber-500 to-amber-700"
            >
              <span class="text-2xl">🎯</span>
              <span>Scale</span>
            </div>
            <div
              #hoverBox2
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-xl bg-gradient-to-br from-teal-500 to-teal-700"
            >
              <span class="text-2xl">🌊</span>
              <span>Slide</span>
            </div>
            <div
              #hoverBox3
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-xl bg-gradient-to-br from-rose-500 to-rose-700"
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
            >const unbind = Motion.bindHover(el, MotionAnimations.ScaleIn,
            MotionAnimations.ScaleOut);</code
          >
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
