import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import {
  MyButton,
  MyCard,
  MyBadge,
  MyIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-stagger-demo',
  imports: [CommonModule, MyButton, MyCard, MyBadge, MyIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">
          Staggered Entrance
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Animate a list of items with incremental delays for a cascading
          effect. Essential for lists, grids, and menus.
        </p>
      </div>

      <!-- Main Demo -->
      <my-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <my-badge variant="secondary">Pattern</my-badge>
                <span class="text-sm text-muted-foreground"
                  >List Animation</span
                >
              </div>
              <h2 class="text-lg font-semibold">Stagger List</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Each item enters with an increasing delay.
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex flex-wrap gap-2 mb-6">
            <my-button (click)="playStagger()">
              <my-icon name="play" class="mr-2" size="14"></my-icon>
              Play Stagger
            </my-button>
            <my-button variant="outline" (click)="resetStagger()">
              <my-icon name="rotate-ccw" class="mr-2" size="14"></my-icon>
              Reset
            </my-button>
          </div>

          <!-- Preview Area -->
          <div
            class="min-h-[250px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 p-8"
          >
            <div class="flex flex-col gap-3 w-full max-w-sm">
              <div
                #staggerItem1
                class="flex items-center gap-3 p-4 rounded-lg bg-background border border-border shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-blue-500 flex items-center justify-center text-white"
                >
                  1
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-16 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem2
                class="flex items-center gap-3 p-4 rounded-lg bg-background border border-border shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-violet-500 flex items-center justify-center text-white"
                >
                  2
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-28 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem3
                class="flex items-center gap-3 p-4 rounded-lg bg-background border border-border shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-green-500 flex items-center justify-center text-white"
                >
                  3
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-12 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem4
                class="flex items-center gap-3 p-4 rounded-lg bg-background border border-border shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-amber-500 flex items-center justify-center text-white"
                >
                  4
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-20 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
              <div
                #staggerItem5
                class="flex items-center gap-3 p-4 rounded-lg bg-background border border-border shadow-sm"
                style="display: none;"
              >
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 bg-rose-500 flex items-center justify-center text-white"
                >
                  5
                </div>
                <div class="flex-1">
                  <div
                    class="h-2 w-22 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5"
                  ></div>
                  <div
                    class="h-2 w-14 bg-zinc-100 dark:bg-zinc-800/50 rounded"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              items.forEach((el, i) => Motion.enter(el,
              MotionAnimations.SlideInLeft, {{ '{' }} delay: i * 80 {{ '}' }}));
            </code>
          </div>
        </div>
      </my-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 4rem;
      }
    `,
  ],
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
