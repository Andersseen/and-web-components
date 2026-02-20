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
  selector: 'app-fade-demo',
  imports: [CommonModule, AndButton, AndCard, AndBadge, AndIcon],
  template: `
    <div class="demo-page">
      <!-- Hero -->
      <div class="hero mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-3">Fade Animations</h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Smooth opacity transitions for entering and leaving elements. Perfect
          for modal dialogs, notifications, and revealing content.
        </p>
      </div>

      <!-- Main Demo -->
      <and-card class="block mb-8">
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <and-badge variant="secondary">Enter / Leave</and-badge>
                <span class="text-sm text-muted-foreground">Opacity</span>
              </div>
              <h2 class="text-lg font-semibold">Basic Fade</h2>
              <p class="text-sm text-muted-foreground mt-1">
                The most essential transition effect.
              </p>
            </div>
            <div class="flex gap-2">
              <and-button (click)="enterBox()" size="sm">
                <and-icon name="eye" class="mr-2" size="14"></and-icon>
                Fade In
              </and-button>
              <and-button variant="outline" (click)="leaveBox()" size="sm">
                <and-icon name="eye-off" class="mr-2" size="14"></and-icon>
                Fade Out
              </and-button>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="h-64 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative overflow-hidden"
          >
            <div
              #fadeBox
              class="w-32 h-32 bg-primary rounded-xl shadow-lg flex items-center justify-center text-primary-foreground"
              style="display: none;"
            >
              <span class="text-3xl">👋</span>
            </div>
          </div>

          <!-- Code Block -->
          <div class="bg-zinc-950 rounded-md p-4 overflow-x-auto">
            <code class="text-sm font-mono text-blue-300">
              <span class="text-purple-400">await</span> Motion.enter(element,
              MotionAnimations.FadeIn);<br />
              <span class="text-purple-400">await</span> Motion.leave(element,
              MotionAnimations.FadeOut);
            </code>
          </div>
        </div>
      </and-card>

      <!-- Accessibility Info -->
      <div
        class="flex items-start gap-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800"
      >
        <div
          class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"
        >
          <and-icon name="accessibility" size="20"></and-icon>
        </div>
        <div>
          <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-1">
            Respects Preferences
          </h3>
          <p class="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            All motion animations automatically check for
            <code
              class="px-1 py-0.5 rounded bg-blue-100/50 dark:bg-blue-900/30 font-mono text-xs"
              >prefers-reduced-motion</code
            >. If the user has requested reduced motion, transitions are skipped
            instantly.
          </p>
        </div>
      </div>
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
export default class FadeDemoComponent implements AfterViewInit {
  @ViewChild('fadeBox') fadeBox!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async enterBox() {
    await Motion.enter(this.fadeBox.nativeElement, MotionAnimations.FadeIn);
  }

  async leaveBox() {
    await Motion.leave(this.fadeBox.nativeElement, MotionAnimations.FadeOut);
  }
}
