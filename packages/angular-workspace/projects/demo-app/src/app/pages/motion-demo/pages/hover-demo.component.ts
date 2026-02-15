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
  selector: 'app-hover-demo',
  imports: [CommonModule],
  template: `
    <div class="motion-page">
      <div class="motion-header">
        <h1>Hover Effects</h1>
        <p>
          Bind enter/leave animations to mouse hover — with automatic cleanup.
        </p>
      </div>

      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Interaction</span>
          <h2>Hover Cards</h2>
          <p>
            Hover over each card to trigger a different animation. Cleanup
            functions prevent memory leaks.
          </p>
        </div>

        <div class="demo-stage">
          <div class="hover-grid">
            <div #hoverBox1 class="hover-card gradient-amber">
              <span>🎯</span>
              <span>Scale</span>
            </div>
            <div #hoverBox2 class="hover-card gradient-teal">
              <span>🌊</span>
              <span>Slide</span>
            </div>
            <div #hoverBox3 class="hover-card gradient-rose">
              <span>🔄</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >const unbind = Motion.bindHover(el, MotionAnimations.ScaleIn,
            MotionAnimations.ScaleOut);</code
          >
        </div>
      </section>
    </div>
  `,
  styles: [
    MOTION_DEMO_STYLES,
    `
      .hover-grid {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .hover-card {
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        transition: box-shadow 0.2s;
      }

      .hover-card span:first-child {
        font-size: 1.5rem;
      }

      .hover-card:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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
