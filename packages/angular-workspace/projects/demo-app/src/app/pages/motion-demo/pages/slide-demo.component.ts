import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@andersseen/motion-core';
import {
  AndButton,
  AndCard,
  AndBadge,
  AndIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-slide-demo',
  imports: [CommonModule, AndButton, AndCard, AndBadge, AndIcon],
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
      <and-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <and-badge variant="secondary">Directional</and-badge>
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
                <and-button size="sm" (click)="slideIn('top')">
                  <and-icon name="arrow-down" class="mr-2" size="14"></and-icon>
                  From Top
                </and-button>
                <and-button size="sm" (click)="slideIn('bottom')">
                  <and-icon name="arrow-up" class="mr-2" size="14"></and-icon>
                  From Bottom
                </and-button>
                <and-button size="sm" (click)="slideIn('left')">
                  <and-icon name="arrow-right" class="mr-2" size="14"></and-icon>
                  From Left
                </and-button>
                <and-button size="sm" (click)="slideIn('right')">
                  <and-icon name="arrow-left" class="mr-2" size="14"></and-icon>
                  From Right
                </and-button>
              </div>
            </div>

            <!-- Slide Out -->
            <div class="flex flex-col gap-3">
              <span
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >Slide Out</span
              >
              <div class="grid grid-cols-2 gap-2">
                <and-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('top')"
                >
                  <and-icon name="arrow-up" class="mr-2" size="14"></and-icon>
                  To Top
                </and-button>
                <and-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('bottom')"
                >
                  <and-icon name="arrow-down" class="mr-2" size="14"></and-icon>
                  To Bottom
                </and-button>
                <and-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('left')"
                >
                  <and-icon name="arrow-left" class="mr-2" size="14"></and-icon>
                  To Left
                </and-button>
                <and-button
                  size="sm"
                  variant="outline"
                  (click)="slideOut('right')"
                >
                  <and-icon name="arrow-right" class="mr-2" size="14"></and-icon>
                  To Right
                </and-button>
              </div>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div
              #slideBox
              class="w-32 h-32 bg-accent rounded-xl shadow-lg flex flex-col items-center justify-center text-primary-foreground gap-2"
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
      </and-card>
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
