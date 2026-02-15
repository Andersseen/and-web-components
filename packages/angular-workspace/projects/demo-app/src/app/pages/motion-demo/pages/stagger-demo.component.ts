import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-stagger-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Staggered Entrance
        </h1>
        <p class="text-base text-zinc-500">
          Animate a list of items with incremental delays for a cascading
          effect.
        </p>
      </div>

      <section
        class="border border-zinc-200 rounded-xl p-6 bg-white transition-shadow hover:shadow-lg duration-200"
      >
        <div class="mb-5">
          <span
            class="inline-block text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full mb-2"
            >Pattern</span
          >
          <h2 class="text-xl font-bold mb-1">Stagger List</h2>
          <p class="text-sm text-zinc-500">
            Each item enters with an increasing delay, creating a cascading
            wave.
          </p>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <my-button (click)="playStagger()">Play Stagger</my-button>
          <my-button variant="outline" (click)="resetStagger()"
            >Reset</my-button
          >
        </div>

        <div
          class="min-h-[120px] flex items-center justify-center border border-dashed border-zinc-200 rounded-lg bg-zinc-100 mb-3 p-4"
        >
          <div class="flex flex-col gap-2 w-full max-w-sm">
            <div
              #staggerItem1
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
              style="display: none;"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700"
              ></div>
              <span>Item 1</span>
            </div>
            <div
              #staggerItem2
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
              style="display: none;"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-500 to-violet-700"
              ></div>
              <span>Item 2</span>
            </div>
            <div
              #staggerItem3
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
              style="display: none;"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-green-500 to-green-700"
              ></div>
              <span>Item 3</span>
            </div>
            <div
              #staggerItem4
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
              style="display: none;"
            >
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-amber-500 to-amber-700"
              ></div>
              <span>Item 4</span>
            </div>
            <div
              #staggerItem5
              class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-200 font-medium text-zinc-900"
              style="display: none;"
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
            >items.forEach((el, i) =&gt; Motion.enter(el,
            MotionAnimations.SlideInLeft, {{ '{' }} delay: i * 80
            {{ '}' }}));</code
          >
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class StaggerDemoComponent implements AfterViewInit {
  @ViewChild('staggerItem1') staggerItem1!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem2') staggerItem2!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem3') staggerItem3!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem4') staggerItem4!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem5') staggerItem5!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async playStagger() {
    const items = [
      this.staggerItem1,
      this.staggerItem2,
      this.staggerItem3,
      this.staggerItem4,
      this.staggerItem5,
    ];

    // Reset all first
    items.forEach((item) => {
      item.nativeElement.style.display = 'none';
    });

    // Animate with staggered delays
    items.forEach((item, i) => {
      Motion.enter(item.nativeElement, MotionAnimations.SlideInLeft, {
        delay: i * 80,
      });
    });
  }

  resetStagger() {
    const items = [
      this.staggerItem1,
      this.staggerItem2,
      this.staggerItem3,
      this.staggerItem4,
      this.staggerItem5,
    ];
    items.forEach((item) => {
      item.nativeElement.style.display = 'none';
    });
  }
}
