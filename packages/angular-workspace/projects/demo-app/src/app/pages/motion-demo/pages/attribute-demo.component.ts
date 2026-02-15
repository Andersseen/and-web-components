import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionDirective } from '@my-lib/motion-core';
import { MOTION_DEMO_STYLES } from '../shared-styles';

@Component({
  selector: 'app-attribute-demo',
  imports: [CommonModule],
  template: `
    <div class="motion-page" #demoRoot>
      <div class="motion-header">
        <h1>Attribute API</h1>
        <p>Declare animations directly in HTML — zero TypeScript required.</p>
      </div>

      <!-- ========== Enter Trigger ========== -->
      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Enter</span>
          <h2>Scroll Into View</h2>
          <p>Elements animate automatically when they enter the viewport.</p>
        </div>

        <div class="demo-stage">
          <div class="enter-grid">
            <div my-motion="fade-in" class="demo-box gradient-blue">
              <span>👋</span>
              <span>Fade</span>
            </div>
            <div my-motion="scale-in" class="demo-box gradient-purple">
              <span>✨</span>
              <span>Scale</span>
            </div>
            <div my-motion="bounce-in" class="demo-box gradient-green">
              <span>🎉</span>
              <span>Bounce</span>
            </div>
            <div my-motion="rotate-in" class="demo-box gradient-amber">
              <span>🔄</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code>&lt;div my-motion="fade-in"&gt;Hello&lt;/div&gt;</code>
        </div>
      </section>

      <!-- ========== Hover Trigger ========== -->
      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Hover</span>
          <h2>Hover Effects</h2>
          <p>Combine enter and leave animations on mouse hover.</p>
        </div>

        <div class="demo-stage">
          <div class="hover-grid">
            <div
              my-motion="scale-in"
              my-motion-trigger="hover"
              my-motion-leave="scale-out"
              class="hover-card gradient-teal"
            >
              <span>🎯</span>
              <span>Scale</span>
            </div>
            <div
              my-motion="rotate-in"
              my-motion-trigger="hover"
              my-motion-leave="scale-out"
              my-motion-duration="250"
              class="hover-card gradient-rose"
            >
              <span>🔄</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >&lt;div my-motion="scale-in" my-motion-trigger="hover"
            my-motion-leave="scale-out"&gt;Card&lt;/div&gt;</code
          >
        </div>
      </section>

      <!-- ========== Tap Trigger ========== -->
      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Tap</span>
          <h2>Click / Tap</h2>
          <p>
            Trigger animations on click or tap — great for buttons and
            interactive elements.
          </p>
        </div>

        <div class="demo-stage">
          <div class="tap-grid">
            <div
              my-motion="bounce-in"
              my-motion-trigger="tap"
              class="tap-card gradient-blue"
            >
              <span>💥</span>
              <span>Bounce</span>
            </div>
            <div
              my-motion="scale-in"
              my-motion-trigger="tap"
              my-motion-duration="150"
              class="tap-card gradient-purple"
            >
              <span>🎯</span>
              <span>Scale</span>
            </div>
            <div
              my-motion="rotate-in"
              my-motion-trigger="tap"
              my-motion-duration="250"
              class="tap-card gradient-green"
            >
              <span>🌀</span>
              <span>Rotate</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >&lt;button my-motion="bounce-in" my-motion-trigger="tap"&gt;Click
            me&lt;/button&gt;</code
          >
        </div>
      </section>

      <!-- ========== Custom Options ========== -->
      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Options</span>
          <h2>Custom Duration, Easing & Delay</h2>
          <p>Fine-tune animations with extra attributes — no JS needed.</p>
        </div>

        <div class="demo-stage">
          <div class="enter-grid">
            <div
              my-motion="slide-in-left"
              my-motion-duration="800"
              my-motion-easing="ease-in-out"
              class="demo-box gradient-rose"
            >
              <span>⚙️</span>
              <span>Slow</span>
            </div>
            <div
              my-motion="slide-in-right"
              my-motion-duration="300"
              my-motion-delay="400"
              class="demo-box gradient-teal"
            >
              <span>⏱</span>
              <span>Delayed</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >&lt;div my-motion="slide-in-left" my-motion-duration="800"
            my-motion-easing="ease-in-out"&gt;...&lt;/div&gt;</code
          >
        </div>
      </section>

      <!-- ========== Stagger ========== -->
      <section class="motion-card">
        <div class="card-header">
          <span class="card-badge">Pattern</span>
          <h2>Stagger</h2>
          <p>
            Add <code>my-motion-stagger</code> on the parent to cascade children
            with incremental delays.
          </p>
        </div>

        <div class="demo-stage">
          <div class="stagger-list" my-motion-stagger="100">
            <div my-motion="slide-in-left" class="stagger-item">
              <div class="stagger-dot gradient-blue"></div>
              <span>Item 1</span>
            </div>
            <div my-motion="slide-in-left" class="stagger-item">
              <div class="stagger-dot gradient-purple"></div>
              <span>Item 2</span>
            </div>
            <div my-motion="slide-in-left" class="stagger-item">
              <div class="stagger-dot gradient-green"></div>
              <span>Item 3</span>
            </div>
            <div my-motion="slide-in-left" class="stagger-item">
              <div class="stagger-dot gradient-amber"></div>
              <span>Item 4</span>
            </div>
            <div my-motion="slide-in-left" class="stagger-item">
              <div class="stagger-dot gradient-rose"></div>
              <span>Item 5</span>
            </div>
          </div>
        </div>

        <div class="code-snippet">
          <code
            >&lt;ul my-motion-stagger="100"&gt; &lt;li
            my-motion="slide-in-left"&gt;Item&lt;/li&gt; ... &lt;/ul&gt;</code
          >
        </div>
      </section>

      <!-- API Note -->
      <div class="a11y-note">
        <span>💡</span>
        <p>
          Initialize once with <code>MotionDirective.init()</code>. For advanced
          control, use the TypeScript <code>Motion</code> class directly. Both
          approaches respect <code>prefers-reduced-motion</code>.
        </p>
      </div>
    </div>
  `,
  styles: [
    MOTION_DEMO_STYLES,
    `
      .enter-grid {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

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
export default class AttributeDemoComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('demoRoot') demoRoot!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Initialize the directive on this component's root element
    // Use a small timeout to let Angular finish rendering
    setTimeout(() => {
      MotionDirective.init(this.demoRoot.nativeElement);
    }, 50);
  }

  ngOnDestroy() {
    MotionDirective.destroy();
  }
}
