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
  selector: 'app-slide-demo',
  imports: [CommonModule, MyButton, MyCard, MyBadge, MyIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">Slide Animations</h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Enter and leave animations from any direction. Useful for drawers,
          sidebars, and list items.
        </p>
      </div>

      <!-- Main Demo -->
      <my-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <my-badge variant="secondary">Directional</my-badge>
                <span class="text-sm text-muted-foreground">Translate</span>
              </div>
              <h2 class="text-lg font-semibold">Slide In & Out</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Control the direction of movement.
              </p>
            </div>
          </div>

          <!-- Controls grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Slide In -->
            <div class="flex flex-col gap-3">
              <span
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >Slide In</span
              >
              <div class="grid grid-cols-2 gap-2">
                <my-button size="sm" (click)="slideIn('top')">
                  <my-icon name="arrow-down" class="mr-2" size="14"></my-icon>
                  From Top
                </my-button>
                <my-button size="sm" (click)="slideIn('bottom')">
                  <my-icon name="arrow-up" class="mr-2" size="14"></my-icon>
                  From Bottom
                </my-button>
                <my-button size="sm" (click)="slideIn('left')">
                  <my-icon name="arrow-right" class="mr-2" size="14"></my-icon>
                  From Left
                </my-button>
                <my-button size="sm" (click)="slideIn('right')">
                  <my-icon name="arrow-left" class="mr-2" size="14"></my-icon>
                  From Right
                </my-button>
              </div>
            </div>

            <!-- Slide Out -->
            <div class="flex flex-col gap-3">
              <span
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >Slide Out</span
              >
              <div class="grid grid-cols-2 gap-2">
                <my-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('top')"
                >
                  <my-icon name="arrow-up" class="mr-2" size="14"></my-icon>
                  To Top
                </my-button>
                <my-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('bottom')"
                >
                  <my-icon name="arrow-down" class="mr-2" size="14"></my-icon>
                  To Bottom
                </my-button>
                <my-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('left')"
                >
                  <my-icon name="arrow-left" class="mr-2" size="14"></my-icon>
                  To Left
                </my-button>
                <my-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('right')"
                >
                  <my-icon name="arrow-right" class="mr-2" size="14"></my-icon>
                  To Right
                </my-button>
              </div>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div
              #slideBox
              class="w-32 h-32 bg-green-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white gap-2"
              style="display: none;"
            >
              <span class="text-4xl">🚀</span>
              <span class="font-bold">Whoosh!</span>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              <span class="text-purple-400">await</span> Motion.enter(el,
              MotionAnimations.SlideInLeft);
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
