import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-slide-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Slide Animations</h1>
        <p>Slide elements in and out from any direction.</p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Directional</span>
          <h2>Slide In & Out</h2>
          <p>Directional enter/leave animations from all four edges.</p>
        </div>

        <div class="card-actions-grid">
          <div class="action-group">
            <span class="action-label">Slide In</span>
            <div class="action-buttons">
              <my-button size="sm" (click)="slideIn('top')">↑ Top</my-button>
              <my-button size="sm" (click)="slideIn('bottom')"
                >↓ Bottom</my-button
              >
              <my-button size="sm" (click)="slideIn('left')">← Left</my-button>
              <my-button size="sm" (click)="slideIn('right')"
                >→ Right</my-button
              >
            </div>
          </div>
          <div class="action-group">
            <span class="action-label">Slide Out</span>
            <div class="action-buttons">
              <my-button size="sm" variant="outline" (click)="slideOut('top')"
                >↑ Top</my-button
              >
              <my-button
                size="sm"
                variant="outline"
                (click)="slideOut('bottom')"
                >↓ Bottom</my-button
              >
              <my-button size="sm" variant="outline" (click)="slideOut('left')"
                >← Left</my-button
              >
              <my-button size="sm" variant="outline" (click)="slideOut('right')"
                >→ Right</my-button
              >
            </div>
          </div>
        </div>

        <div class="demo-stage demo-stage--overflow">
          <div #slideBox class="demo-box gradient-green" style="display: none;">
            <span>🚀</span>
            <span>Slide!</span>
          </div>
        </div>

        <div class="code-snippet">
          <code>await Motion.enter(el, MotionAnimations.SlideInLeft);</code>
        </div>
      </section>
    </div>
  `,
  styles: [MOTION_DEMO_STYLES],
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
