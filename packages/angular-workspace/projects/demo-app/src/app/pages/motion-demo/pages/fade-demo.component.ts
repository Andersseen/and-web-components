import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-fade-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Fade Animations</h1>
        <p>Show and hide elements with smooth opacity transitions.</p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Enter / Leave</span>
          <h2>Fade In & Out</h2>
          <p>
            The simplest enter/leave pattern. Smoothly transition element
            opacity.
          </p>
        </div>

        <div class="card-actions">
          <my-button (click)="enterBox()">Fade In</my-button>
          <my-button variant="outline" (click)="leaveBox()">Fade Out</my-button>
        </div>

        <div class="demo-stage">
          <div #fadeBox class="demo-box gradient-blue" style="display: none;">
            <span>👋</span>
            <span>Hello!</span>
          </div>
        </div>

        <div class="code-snippet">
          <code>await Motion.enter(el, MotionAnimations.FadeIn);</code>
        </div>
      </section>

      <div class="a11y-note">
        <span>♿</span>
        <p>
          All animations respect <code>prefers-reduced-motion: reduce</code>.
          Users who prefer reduced motion will see instant transitions.
        </p>
      </div>
    </div>
  `,
  styles: [MOTION_DEMO_STYLES],
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
