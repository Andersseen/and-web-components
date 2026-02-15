import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-stagger-demo',
  imports: [CommonModule, MyButton],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Staggered Entrance</h1>
        <p>
          Animate a list of items with incremental delays for a cascading
          effect.
        </p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Pattern</span>
          <h2>Stagger List</h2>
          <p>
            Each item enters with an increasing delay, creating a cascading
            wave.
          </p>
        </div>

        <div class="card-actions">
          <my-button (click)="playStagger()">Play Stagger</my-button>
          <my-button variant="outline" (click)="resetStagger()"
            >Reset</my-button
          >
        </div>

        <div class="demo-stage">
          <div class="stagger-list">
            <div #staggerItem1 class="stagger-item" style="display: none;">
              <div class="stagger-dot gradient-blue"></div>
              <span>Item 1</span>
            </div>
            <div #staggerItem2 class="stagger-item" style="display: none;">
              <div class="stagger-dot gradient-purple"></div>
              <span>Item 2</span>
            </div>
            <div #staggerItem3 class="stagger-item" style="display: none;">
              <div class="stagger-dot gradient-green"></div>
              <span>Item 3</span>
            </div>
            <div #staggerItem4 class="stagger-item" style="display: none;">
              <div class="stagger-dot gradient-amber"></div>
              <span>Item 4</span>
            </div>
            <div #staggerItem5 class="stagger-item" style="display: none;">
              <div class="stagger-dot gradient-rose"></div>
              <span>Item 5</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >items.forEach((el, i) =&gt; Motion.enter(el,
            MotionAnimations.SlideInLeft, {{ '{' }} delay: i * 80
            {{ '}' }}));</code
          >
        </div>
      </section>
    </div>
  `,
  styles: [
    MOTION_DEMO_STYLES,
    `
      .stagger-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 400px;
      }

      .stagger-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background: var(--background, #fff);
        border: 1px solid var(--border, #e4e4e7);
        font-weight: 500;
        color: var(--foreground);
      }

      .stagger-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }
    `,
  ],
})
export default class StaggerDemoComponent implements AfterViewInit {
  @ViewChild('staggerItem1') staggerItem1!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem2') staggerItem2!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem3') staggerItem3!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem4') staggerItem4!: ElementRef<HTMLElement>;
  @ViewChild('staggerItem5') staggerItem5!: ElementRef<HTMLElement>;

  ngAfterViewInit() {}

  async playStagger() {
    const items = [
      this.staggerItem1,
      this.staggerItem2,
      this.staggerItem3,
      this.staggerItem4,
      this.staggerItem5,
    ];

    // Reset all first
    items.forEach((item) => {
      item.nativeElement.style.display = 'none';
    });

    // Animate with staggered delays
    items.forEach((item, i) => {
      Motion.enter(item.nativeElement, MotionAnimations.SlideInLeft, {
        delay: i * 80,
      });
    });
  }

  resetStagger() {
    const items = [
      this.staggerItem1,
      this.staggerItem2,
      this.staggerItem3,
      this.staggerItem4,
      this.staggerItem5,
    ];
    items.forEach((item) => {
      item.nativeElement.style.display = 'none';
    });
  }
}
