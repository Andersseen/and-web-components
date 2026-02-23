import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionController } from '@andersseen/motion';
import { AnimGroup, ALL_ANIM_GROUPS } from '../data/animation-catalogue';

/** Exit animation names */
const EXIT_PATTERNS = [
  'fade-out', 'slide-out', 'zoom-out', 'bounce-out', 'flip-out',
  'rotate-out', 'back-out', 'light-speed-out', 'roll-out', 'hinge',
];
function isExitAnimation(name: string): boolean {
  return EXIT_PATTERNS.some((p) => name.startsWith(p) || name === p);
}

@Component({
  selector: 'app-attribute-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto flex flex-col gap-8 pb-16" #demoRoot>
      <!-- ── Header ── -->
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          Animation Showcase
        </h1>
        <p class="text-base text-muted-foreground">
          All {{ totalCount }} animations from
          <code class="bg-muted px-1.5 py-0.5 rounded border border-border text-xs">&#64;andersseen/motion</code>
          — click <strong>▶</strong> to play or use the trigger modes below.
        </p>
      </div>

      <!-- ── Trigger Mode Demos (Enter / Hover / Tap) ── -->
      <section class="border border-border rounded-xl p-6 bg-card" #triggerSection>
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Trigger Modes</span>
          <h2 class="text-xl font-bold mb-1">Enter · Hover · Tap</h2>
          <p class="text-sm text-muted-foreground">
            The controller supports three trigger types via <code class="text-xs">and-motion-trigger</code>.
          </p>
        </div>

        <div class="flex gap-4 flex-wrap">
          <div
            and-motion="fade-in-up"
            and-motion-trigger="enter"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-primary to-primary/80"
          >
            <span class="text-2xl">👁️</span>
            <span class="text-xs">Enter</span>
            <span class="text-[10px] opacity-70">fade-in-up</span>
          </div>

          <div
            and-motion="pulse"
            and-motion-trigger="hover"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg cursor-pointer bg-gradient-to-br from-secondary to-secondary/80"
          >
            <span class="text-2xl">🖱️</span>
            <span class="text-xs">Hover me</span>
            <span class="text-[10px] opacity-70">pulse</span>
          </div>

          <div
            and-motion="rubber-band"
            and-motion-trigger="tap"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg cursor-pointer select-none bg-gradient-to-br from-destructive to-destructive/80"
          >
            <span class="text-2xl">👆</span>
            <span class="text-xs">Tap me</span>
            <span class="text-[10px] opacity-70">rubber-band</span>
          </div>

          <div
            and-motion="slide-in-right"
            and-motion-trigger="enter"
            and-motion-duration="900ms"
            and-motion-delay="200ms"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700"
          >
            <span class="text-2xl">⏱️</span>
            <span class="text-xs">900ms</span>
            <span class="text-[10px] opacity-70">slide-in-right</span>
          </div>
        </div>
      </section>

      <!-- ── All Animation Groups ── -->
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

      <!-- ── API Note ── -->
      <div class="flex items-start gap-3 p-4 rounded-xl bg-muted border border-border">
        <span class="text-xl flex-shrink-0">💡</span>
        <div class="text-sm text-muted-foreground leading-relaxed">
          <p class="m-0 mb-1">
            Initialize with the class-based API:
          </p>
          <code class="bg-card px-1.5 py-0.5 rounded border border-border text-xs block">
            const mc = new MotionController({{ '{' }} root {{ '}' }});&nbsp;&nbsp;// later: mc.destroy();
          </code>
          <p class="m-0 mt-2">
            Or use the convenience wrapper:
            <code class="bg-card px-1.5 py-0.5 rounded border border-border text-xs">
              const cleanup = initMotion();
            </code>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export default class AttributeDemoComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('demoRoot') demoRoot!: ElementRef<HTMLElement>;
  @ViewChild('triggerSection') triggerSection!: ElementRef<HTMLElement>;

  groups = ALL_ANIM_GROUPS;
  totalCount = ALL_ANIM_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  private controller?: MotionController;
  private runningTimers: number[] = [];
  private abortControllers: AbortController[] = [];

  ngAfterViewInit() {
    // MotionController ONLY scoped to the trigger-mode demos (enter/hover/tap)
    // — NOT the gallery cards, which are played manually via ▶ Play buttons.
    setTimeout(() => {
      this.controller = new MotionController({
        root: this.triggerSection.nativeElement,
        once: false,
      });
    }, 50);
  }

  ngOnDestroy() {
    this.controller?.destroy();
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
   * Animate a single gallery card.
   *
   * 1. Set `and-motion` + `and-motion-state="active"` to trigger CSS animation.
   * 2. Listen for `animationend` to clean up reliably.
   * 3. After animation ends, restore card to idle (no motion attributes).
   */
  private playElement(el: HTMLElement): void {
    const animName = el.getAttribute('data-anim-name') || '';
    if (!animName) return;

    // ── 1. Reset any in-progress animation ──
    el.removeAttribute('and-motion');
    el.removeAttribute('and-motion-state');
    void el.offsetWidth; // force reflow

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
        el.style.opacity = '';
        el.style.transform = '';
      },
      { once: true, signal: ac.signal },
    );

    // Fallback timeout
    const fallbackMs = this.getAnimDuration(el) + 200;
    const t = window.setTimeout(() => {
      el.removeAttribute('and-motion-state');
      el.removeAttribute('and-motion');
      el.style.opacity = '';
      el.style.transform = '';
    }, fallbackMs);
    this.runningTimers.push(t);
  }

  private getAnimDuration(el: HTMLElement): number {
    const attr = el.getAttribute('and-motion-duration');
    if (attr) return parseFloat(attr);
    const computed = getComputedStyle(el).getPropertyValue('--and-motion-duration').trim();
    if (computed) return parseFloat(computed);
    return 300;
  }
}
