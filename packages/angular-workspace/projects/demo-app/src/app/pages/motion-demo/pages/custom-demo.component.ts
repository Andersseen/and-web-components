import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-custom-demo',
  imports: [CommonModule, FormsModule, MyButton],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Custom Options
        </h1>
        <p class="text-base text-zinc-500">
          Fine-tune animations with duration, easing, and delay.
        </p>
      </div>

      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Options</span
          >
          <h2 class="text-xl font-bold mb-1">Animation Playground</h2>
          <p class="text-sm text-zinc-500">
            Adjust the sliders and select easing to customize the animation
            behavior.
          </p>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 p-4 rounded-xl bg-zinc-100 border border-zinc-200"
        >
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >Duration</label
            >
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              [(ngModel)]="customDuration"
              class="w-full accent-blue-500"
            />
            <span class="text-xs font-medium text-zinc-900 tabular-nums"
              >{{ customDuration }}ms</span
            >
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >Easing</label
            >
            <select
              [(ngModel)]="customEasing"
              class="px-2 py-1.5 rounded-md border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >Delay</label
            >
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              [(ngModel)]="customDelay"
              class="w-full accent-blue-500"
            />
            <span class="text-xs font-medium text-zinc-900 tabular-nums"
              >{{ customDelay }}ms</span
            >
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <my-button (click)="playCustom()">Play Animation</my-button>
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div
            #customBox
            class="flex flex-col items-center justify-center gap-1 w-[100px] h-[100px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-rose-500 to-rose-700"
            style="display: none;"
          >
            <span class="text-2xl">⚙️</span>
            <span>Custom!</span>
          </div>
        </div>

        <div
          class="bg-zinc-100 border border-zinc-200 rounded-lg p-3 overflow-x-auto"
        >
          <code class="text-xs font-mono whitespace-nowrap"
            >await Motion.enter(el, MotionAnimations.BounceIn,
            {{ '{' }} duration: {{ customDuration }}, easing: '{{
              customEasing
            }}', delay: {{ customDelay }} {{ '}' }});</code
          >
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
