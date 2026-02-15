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
  selector: 'app-scale-demo',
  imports: [CommonModule, MyButton, MyCard, MyBadge, MyIcon],
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
      <my-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <my-badge variant="secondary">Transform</my-badge>
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
            <my-button (click)="playScaleIn()" size="sm">
              <my-icon name="maximize" class="mr-2" size="14"></my-icon>
              Scale In
            </my-button>
            <my-button (click)="playBounceIn()" size="sm">
              <my-icon name="activity" class="mr-2" size="14"></my-icon>
              Bounce In
            </my-button>
            <my-button (click)="playRotateIn()" size="sm">
              <my-icon name="rotate-cw" class="mr-2" size="14"></my-icon>
              Rotate In
            </my-button>
            <div class="w-px h-8 bg-border mx-2"></div>
            <my-button variant="outline" (click)="playScaleOut()" size="sm">
              <my-icon name="minimize" class="mr-2" size="14"></my-icon>
              Scale Out
            </my-button>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div
              #scaleBox
              class="w-32 h-32 bg-violet-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white gap-2"
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
      </my-card>
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
