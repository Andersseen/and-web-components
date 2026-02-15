import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-scale-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Scale, Bounce & Rotate
        </h1>
        <p class="text-base text-zinc-500">
          Playful entrance effects using transform and opacity.
        </p>
      </div>

      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Transform</span
          >
          <h2 class="text-xl font-bold mb-1">Scale & Bounce</h2>
          <p class="text-sm text-zinc-500">
            Eye-catching enter/leave effects that combine scale transforms with
            opacity.
          </p>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <my-button (click)="playScaleIn()">Scale In</my-button>
          <my-button (click)="playBounceIn()">Bounce In</my-button>
          <my-button (click)="playRotateIn()">Rotate In</my-button>
          <my-button variant="outline" (click)="playScaleOut()"
            >Scale Out</my-button
          >
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div
            #scaleBox
            class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-violet-500 to-violet-700"
            style="display: none;"
          >
            <span class="text-2xl">✨</span>
            <span>Wow!</span>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >await Motion.enter(el, MotionAnimations.BounceIn);</code
          >
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
