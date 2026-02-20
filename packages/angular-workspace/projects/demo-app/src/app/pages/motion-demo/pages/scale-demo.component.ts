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
  selector: 'app-scale-demo',
  imports: [CommonModule, AndButton, AndCard, AndBadge, AndIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">Scale & Rotate</h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Playful entrance and exit effects using transform properties. Great
          for drawing attention to new content.
        </p>
      </div>

      <!-- Main Demo -->
      <and-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <and-badge variant="secondary">Transform</and-badge>
                <span class="text-sm text-muted-foreground"
                  >Scale / Rotate</span
                >
              </div>
              <h2 class="text-lg font-semibold">Entrance Effects</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Combine scaling and rotation for dynamic reveals.
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex flex-wrap gap-2 mb-6">
            <and-button (click)="playScaleIn()" size="sm">
              <and-icon name="maximize" class="mr-2" size="14"></and-icon>
              Scale In
            </and-button>
            <and-button (click)="playBounceIn()" size="sm">
              <and-icon name="activity" class="mr-2" size="14"></and-icon>
              Bounce In
            </and-button>
            <and-button (click)="playRotateIn()" size="sm">
              <and-icon name="rotate-cw" class="mr-2" size="14"></and-icon>
              Rotate In
            </and-button>
            <div class="w-px h-8 bg-border mx-2"></div>
            <and-button variant="outline" (click)="playScaleOut()" size="sm">
              <and-icon name="minimize" class="mr-2" size="14"></and-icon>
              Scale Out
            </and-button>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div
              #scaleBox
              class="w-32 h-32 bg-violet-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-primary-foreground gap-2"
              style="display: none;"
            >
              <span class="text-4xl">✨</span>
              <span class="font-bold">Poof!</span>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              <span class="text-purple-400">await</span> Motion.enter(el,
              MotionAnimations.BounceIn);
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
      .bg-border {
        background-color: hsl(var(--border));
      }
    `,
  ],
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
