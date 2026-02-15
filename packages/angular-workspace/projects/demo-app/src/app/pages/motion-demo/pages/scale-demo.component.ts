import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-scale-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Scale, Bounce & Rotate</h1>
        <p>Playful entrance effects using transform and opacity.</p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Transform</span>
          <h2>Scale & Bounce</h2>
          <p>
            Eye-catching enter/leave effects that combine scale transforms with
            opacity.
          </p>
        </div>

        <div class="card-actions">
          <my-button (click)="playScaleIn()">Scale In</my-button>
          <my-button (click)="playBounceIn()">Bounce In</my-button>
          <my-button (click)="playRotateIn()">Rotate In</my-button>
          <my-button variant="outline" (click)="playScaleOut()"
            >Scale Out</my-button
          >
        </div>

        <div class="demo-stage">
          <div
            #scaleBox
            class="demo-box gradient-purple"
            style="display: none;"
          >
            <span>✨</span>
            <span>Wow!</span>
          </div>
        </div>

        <div class="code-snippet">
          <code>await Motion.enter(el, MotionAnimations.BounceIn);</code>
        </div>
      </section>
    </div>
  `,
  styles: [MOTION_DEMO_STYLES],
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
