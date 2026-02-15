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
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">Tap Effects</h1>
        <p class="text-base text-zinc-500">
          Trigger animations on click/tap. Returns a cleanup function to prevent
          memory leaks.
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
          <h2 class="text-xl font-bold mb-1">Tap Cards</h2>
          <p class="text-sm text-zinc-500">
            Click any card to trigger its bound animation.
          </p>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex gap-4 justify-center flex-wrap">
            <div
              #tapBox1
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm cursor-pointer select-none shadow-md transition-shadow duration-150 active:shadow-sm bg-gradient-to-br from-blue-500 to-blue-700"
            >
              <span class="text-2xl">💥</span>
              <span>Scale</span>
            </div>
            <div
              #tapBox2
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm cursor-pointer select-none shadow-md transition-shadow duration-150 active:shadow-sm bg-gradient-to-br from-violet-500 to-violet-700"
            >
              <span class="text-2xl">🎉</span>
              <span>Bounce</span>
            </div>
            <div
              #tapBox3
              class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm cursor-pointer select-none shadow-md transition-shadow duration-150 active:shadow-sm bg-gradient-to-br from-green-500 to-green-700"
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
            >const unbind = Motion.bindTap(el, MotionAnimations.BounceIn,
            {{ '{' }} duration: 150 {{ '}' }});</code
          >
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
