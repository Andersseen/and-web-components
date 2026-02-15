import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import {
  MyCard,
  MyBadge,
  MyIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-hover-demo',
  imports: [CommonModule, MyCard, MyBadge, MyIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">Hover Effects</h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Bind enter/leave animations to mouse hover — with automatic cleanup.
          Perfect for cards, buttons, and interactive elements.
        </p>
      </div>

      <!-- Main Demo -->
      <my-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <my-badge variant="secondary">Interaction</my-badge>
                <span class="text-sm text-muted-foreground">Mouse Events</span>
              </div>
              <h2 class="text-lg font-semibold">Hover Cards</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Hover over each card to trigger a different animation.
              </p>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div class="flex gap-4 justify-center flex-wrap">
              <div
                #hoverBox1
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md bg-amber-500"
              >
                <my-icon name="maximize" size="24"></my-icon>
                <span>Scale</span>
              </div>
              <div
                #hoverBox2
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md bg-teal-500"
              >
                <my-icon name="arrow-up" size="24"></my-icon>
                <span>Slide</span>
              </div>
              <div
                #hoverBox3
                class="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-md bg-rose-500"
              >
                <my-icon name="rotate-cw" size="24"></my-icon>
                <span>Rotate</span>
              </div>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              <span class="text-purple-400">const</span> unbind =
              Motion.bindHover(el, MotionAnimations.ScaleIn,
              MotionAnimations.ScaleOut);
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
export default class HoverDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hoverBox1') hoverBox1!: ElementRef<HTMLElement>;
  @ViewChild('hoverBox2') hoverBox2!: ElementRef<HTMLElement>;
  @ViewChild('hoverBox3') hoverBox3!: ElementRef<HTMLElement>;

  private cleanups: (() => void)[] = [];

  ngAfterViewInit() {
    this.cleanups.push(
      Motion.bindHover(
        this.hoverBox1.nativeElement,
        MotionAnimations.ScaleIn,
        MotionAnimations.ScaleOut,
        { duration: 200 },
      ),
    );
    this.cleanups.push(
      Motion.bindHover(
        this.hoverBox2.nativeElement,
        MotionAnimations.SlideInBottom,
        MotionAnimations.SlideOutBottom,
        { duration: 200 },
      ),
    );
    this.cleanups.push(
      Motion.bindHover(
        this.hoverBox3.nativeElement,
        MotionAnimations.RotateIn,
        MotionAnimations.ScaleOut,
        { duration: 250 },
      ),
    );
  }

  ngOnDestroy() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
  }
}
