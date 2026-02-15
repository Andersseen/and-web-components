import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-tap-demo',
  imports: [CommonModule],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Tap Effects</h1>
        <p>
          Trigger animations on click/tap. Returns a cleanup function to prevent
          memory leaks.
        </p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Interaction</span>
          <h2>Tap Cards</h2>
          <p>Click any card to trigger its bound animation.</p>
        </div>

        <div class="demo-stage">
          <div class="tap-grid">
            <div #tapBox1 class="tap-card gradient-blue">
              <span>💥</span>
              <span>Scale</span>
            </div>
            <div #tapBox2 class="tap-card gradient-purple">
              <span>🎉</span>
              <span>Bounce</span>
            </div>
            <div #tapBox3 class="tap-card gradient-green">
              <span>🌀</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >const unbind = Motion.bindTap(el, MotionAnimations.BounceIn,
            {{ '{' }} duration: 150 {{ '}' }});</code
          >
        </div>
      </section>
    </div>
  `,
  styles: [
    MOTION_DEMO_STYLES,
    `
      .tap-grid {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .tap-card {
        width: 100px;
        height: 100px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        color: #fff;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        transition: box-shadow 0.15s;
      }

      .tap-card span:first-child {
        font-size: 1.5rem;
      }

      .tap-card:active {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
