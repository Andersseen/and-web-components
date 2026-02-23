import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimGroup } from '../data/animation-catalogue';

/** Exit animation names end in -out or start with an out direction */
const EXIT_PATTERNS = [
  'fade-out', 'slide-out', 'zoom-out', 'bounce-out', 'flip-out',
  'rotate-out', 'back-out', 'light-speed-out', 'roll-out', 'hinge',
];

function isExitAnimation(name: string): boolean {
  return EXIT_PATTERNS.some((p) => name.startsWith(p) || name === p);
}

/**
 * Reusable component that renders a set of animation groups with a Play button.
 * Used by every per-category route page.
 *
 * Cards do NOT carry the `and-motion` attribute by default — it is only set
 * when the user clicks ▶ Play (or ▶ Play All).  This prevents the base CSS
 * rule `[and-motion]` from adding `animation-fill-mode: both` / `will-change`
 * on idle cards and, more importantly, prevents the MotionController's
 * IntersectionObserver from auto-triggering animations on page load.
 */
@Component({
  selector: 'app-category-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto flex flex-col gap-8 pb-16" #demoRoot>
      <!-- Header -->
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          {{ title }}
        </h1>
        <p class="text-base text-muted-foreground">
          {{ totalCount }} animations — click <strong>▶</strong> to play.
        </p>
      </div>

      <!-- Groups -->
      <ng-container *ngFor="let group of groups">
        <section class="border border-border rounded-xl p-6 bg-card">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span
                class="inline-block text-xs font-semibold uppercase tracking-wider text-white px-2.5 py-1 rounded-full mb-2 bg-gradient-to-r"
                [ngClass]="group.color"
              >{{ group.tag }}</span>
              <h2 class="text-xl font-bold">{{ group.label }}</h2>
            </div>
            <button
              (click)="playGroup(group)"
              class="text-xs font-medium text-primary hover:text-primary/80 border border-primary/30 rounded-lg px-3 py-1.5 transition-colors hover:bg-primary/5"
            >
              ▶ Play All
            </button>
          </div>

          <div class="flex gap-3 flex-wrap">
            <div
              *ngFor="let anim of group.items"
              [attr.data-anim-name]="anim"
              [attr.data-anim-group]="group.label"
              class="relative flex flex-col items-center justify-center gap-1 min-w-[100px] h-[90px] rounded-xl text-white font-semibold text-xs shadow-md overflow-hidden bg-gradient-to-br"
              [ngClass]="group.color"
            >
              <span class="font-mono text-[10px] leading-tight text-center px-1 opacity-90">{{ anim }}</span>
              <button
                (click)="playCard($event)"
                class="mt-1 flex items-center gap-0.5 text-[10px] font-medium text-white/90 bg-white/20 hover:bg-white/30 rounded-md px-2 py-0.5 transition-colors cursor-pointer"
              >
                ▶ Play
              </button>
            </div>
          </div>
        </section>
      </ng-container>
    </div>
  `,
})
export class CategoryDemoComponent implements OnDestroy {
  @ViewChild('demoRoot') demoRoot!: ElementRef<HTMLElement>;

  @Input() title = '';
  @Input() groups: AnimGroup[] = [];

  private runningTimers: number[] = [];
  private abortControllers: AbortController[] = [];

  get totalCount(): number {
    return this.groups.reduce((sum, g) => sum + g.items.length, 0);
  }

  ngOnDestroy() {
    this.runningTimers.forEach((t) => clearTimeout(t));
    this.abortControllers.forEach((ac) => ac.abort());
  }

  playCard(event: Event): void {
    event.stopPropagation();
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-anim-name]');
    if (card) this.playElement(card);
  }

  playGroup(group: AnimGroup): void {
    const root = this.demoRoot.nativeElement;
    const cards = root.querySelectorAll<HTMLElement>(
      `[data-anim-group="${group.label}"]`,
    );
    cards.forEach((el, i) => {
      const t = window.setTimeout(() => this.playElement(el), i * 80);
      this.runningTimers.push(t);
    });
  }

  /**
   * Animate a single demo card.
   *
   * 1. Set `and-motion` + `and-motion-state="active"` to trigger CSS animation.
   * 2. Listen for `animationend` to clean up reliably (no manual timeouts).
   * 3. For exit animations: after anim ends, restore the card to its normal state.
   */
  private playElement(el: HTMLElement): void {
    const animName = el.getAttribute('data-anim-name') || '';
    if (!animName) return;

    const isExit = isExitAnimation(animName);

    // ── 1. Reset any in-progress animation ──
    el.removeAttribute('and-motion');
    el.removeAttribute('and-motion-state');
    // Force reflow so the browser acknowledges the attribute removal
    void el.offsetWidth;

    // ── 2. Attach the animation attributes ──
    el.setAttribute('and-motion', animName);
    el.setAttribute('and-motion-state', 'active');

    // ── 3. Clean up when animation ends ──
    const ac = new AbortController();
    this.abortControllers.push(ac);

    el.addEventListener(
      'animationend',
      () => {
        el.removeAttribute('and-motion-state');
        el.removeAttribute('and-motion');
        // Ensure visibility is restored (exit animations may set opacity < 1)
        el.style.opacity = '';
        el.style.transform = '';
      },
      { once: true, signal: ac.signal },
    );

    // Fallback timeout in case animationend doesn't fire (e.g. display:none)
    const fallbackMs = this.getAnimDuration(el) + 200;
    const t = window.setTimeout(() => {
      el.removeAttribute('and-motion-state');
      el.removeAttribute('and-motion');
      el.style.opacity = '';
      el.style.transform = '';
    }, fallbackMs);
    this.runningTimers.push(t);
  }

  /** Read the effective animation duration from the element or CSS variable */
  private getAnimDuration(el: HTMLElement): number {
    const attr = el.getAttribute('and-motion-duration');
    if (attr) return parseFloat(attr);
    const computed = getComputedStyle(el).getPropertyValue('--and-motion-duration').trim();
    if (computed) return parseFloat(computed);
    return 300; // fallback
  }
}
