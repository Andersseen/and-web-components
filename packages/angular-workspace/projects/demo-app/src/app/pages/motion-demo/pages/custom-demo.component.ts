import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import {
  MyButton,
  MyCard,
  MyBadge,
  MyIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-custom-demo',
  imports: [CommonModule, FormsModule, MyButton, MyCard, MyBadge, MyIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">Custom Options</h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Fine-tune animations with duration, easing, and delay. Create the
          perfect feel for your interactions.
        </p>
      </div>

      <!-- Main Demo -->
      <my-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <my-badge variant="secondary">Configuration</my-badge>
                <span class="text-sm text-muted-foreground"
                  >Timing & Easing</span
                >
              </div>
              <h2 class="text-lg font-semibold">Animation Playground</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Adjust the parameters to customize the behavior.
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-4 rounded-xl bg-muted/50 border border-border"
          >
            <!-- Duration -->
            <div class="flex flex-col gap-2">
              <label
                class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Duration
              </label>
              <div class="flex items-center gap-3">
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  [(ngModel)]="customDuration"
                  class="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <span class="text-xs font-mono w-12 text-right"
                  >{{ customDuration }}ms</span
                >
              </div>
            </div>

            <!-- Easing -->
            <div class="flex flex-col gap-2">
              <label
                class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Easing
              </label>
              <select
                [(ngModel)]="customEasing"
                class="px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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

            <!-- Delay -->
            <div class="flex flex-col gap-2">
              <label
                class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Delay
              </label>
              <div class="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  [(ngModel)]="customDelay"
                  class="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <span class="text-xs font-mono w-12 text-right"
                  >{{ customDelay }}ms</span
                >
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <my-button (click)="playCustom()">
              <my-icon name="play" class="mr-2" size="14"></my-icon>
              Play Animation
            </my-button>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div
              #customBox
              class="w-24 h-24 bg-rose-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white gap-2"
              style="display: none;"
            >
              <span class="text-3xl">⚙️</span>
              <span class="font-bold text-xs">Custom</span>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              <span class="text-purple-400">await</span> Motion.enter(el,
              MotionAnimations.BounceIn, {{ '{' }} <br />&nbsp;&nbsp;duration:
              {{ customDuration }}, <br />&nbsp;&nbsp;easing: '{{
                customEasing
              }}', <br />&nbsp;&nbsp;delay: {{ customDelay }} <br />{{ '}' }});
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
      input[type='range'] {
        @apply accent-primary;
      }
    `,
  ],
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
