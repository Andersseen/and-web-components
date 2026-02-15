import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-custom-demo',
  imports: [CommonModule, FormsModule, MyButton],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Custom Options</h1>
        <p>Fine-tune animations with duration, easing, and delay.</p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Options</span>
          <h2>Animation Playground</h2>
          <p>
            Adjust the sliders and select easing to customize the animation
            behavior.
          </p>
        </div>

        <div class="options-controls">
          <div class="control-group">
            <label>Duration</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              [(ngModel)]="customDuration"
            />
            <span class="control-value">{{ customDuration }}ms</span>
          </div>
          <div class="control-group">
            <label>Easing</label>
            <select [(ngModel)]="customEasing">
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
          <div class="control-group">
            <label>Delay</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              [(ngModel)]="customDelay"
            />
            <span class="control-value">{{ customDelay }}ms</span>
          </div>
        </div>

        <div class="card-actions">
          <my-button (click)="playCustom()">Play Animation</my-button>
        </div>

        <div class="demo-stage">
          <div #customBox class="demo-box gradient-rose" style="display: none;">
            <span>⚙️</span>
            <span>Custom!</span>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >await Motion.enter(el, MotionAnimations.BounceIn,
            {{ '{' }} duration: {{ customDuration }}, easing: '{{
              customEasing
            }}', delay: {{ customDelay }} {{ '}' }});</code
          >
        </div>
      </section>
    </div>
  `,
  styles: [MOTION_DEMO_STYLES],
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
