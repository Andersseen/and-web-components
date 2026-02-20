import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@andersseen/motion-core';
import {
  AndCard,
  AndBadge,
  AndIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tap-demo',
  imports: [CommonModule, AndCard, AndBadge, AndIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">Tap Effects</h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Trigger animations on click/tap with automatic cleanup. Ideal for
          mobile interactions and playful feedback.
        </p>
      </div>

      <!-- Main Demo -->
      <and-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <and-badge variant="secondary">Interaction</and-badge>
                <span class="text-sm text-muted-foreground"
                  >Click/Tap Events</span
                >
              </div>
              <h2 class="text-lg font-semibold">Tap Cards</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Click any card to trigger its bound animation.
              </p>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div class="flex gap-4 justify-center flex-wrap">
              <div
                #tapBox1
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-primary-foreground font-semibold text-sm cursor-pointer select-none shadow-md bg-primary"
              >
                <and-icon name="maximize" size="24"></and-icon>
                <span>Scale</span>
              </div>
              <div
                #tapBox2
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-primary-foreground font-semibold text-sm cursor-pointer select-none shadow-md bg-violet-500"
              >
                <and-icon name="activity" size="24"></and-icon>
                <span>Bounce</span>
              </div>
              <div
                #tapBox3
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-primary-foreground font-semibold text-sm cursor-pointer select-none shadow-md bg-accent"
              >
                <and-icon name="rotate-ccw" size="24"></and-icon>
                <span>Rotate</span>
              </div>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              <span class="text-purple-400">const</span> unbind =
              Motion.bindTap(el, MotionAnimations.BounceIn, {{ '{' }} duration:
              150 {{ '}' }});
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
