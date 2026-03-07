import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MotionController } from '@andersseen/motion';
import { AnimGroup, ALL_ANIM_GROUPS } from '../data/animation-catalogue';

@Component({
  selector: 'app-attribute-demo',
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

      <!-- ── Developer Quick Start ── -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Quick Start</span>
          <h2 class="text-xl font-bold mb-1">How To Use {{ '@' }}andersseen/motion</h2>
          <p class="text-sm text-muted-foreground">
            Framework-agnostic — works with vanilla JS, Angular, React, Vue, Svelte, Astro, or any HTML page.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article class="rounded-xl border border-border bg-muted/30 p-4">
            <h3 class="text-sm font-semibold mb-2">1) Install</h3>
            <pre class="rounded-lg border border-border bg-card p-3 overflow-x-auto text-xs leading-relaxed"><code>{{ snippetInstall }}</code></pre>
          </article>

          <article class="rounded-xl border border-border bg-muted/30 p-4">
            <h3 class="text-sm font-semibold mb-2">2) Initialize</h3>
            <pre class="rounded-lg border border-border bg-card p-3 overflow-x-auto text-xs leading-relaxed"><code>{{ snippetInitMotion }}</code></pre>
          </article>

          <article class="rounded-xl border border-border bg-muted/30 p-4">
            <h3 class="text-sm font-semibold mb-2">3) HTML Attributes</h3>
            <pre class="rounded-lg border border-border bg-card p-3 overflow-x-auto text-xs leading-relaxed"><code>{{ snippetAttributes }}</code></pre>
          </article>

          <article class="rounded-xl border border-border bg-muted/30 p-4">
            <h3 class="text-sm font-semibold mb-2">4) Programmatic Replay</h3>
            <pre class="rounded-lg border border-border bg-card p-3 overflow-x-auto text-xs leading-relaxed"><code>{{ snippetControllerReplay }}</code></pre>
          </article>
        </div>
      </section>

      <!-- ── Trigger Mode Demos (Enter / Hover / Tap) ── -->
      <section class="border border-border rounded-xl p-6 bg-card" #triggerSection>
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Trigger Modes</span>
          <h2 class="text-xl font-bold mb-1">Enter · Hover · Tap</h2>
          <p class="text-sm text-muted-foreground">
            Three trigger types via <code class="text-xs">and-motion-trigger</code>. Default is <code class="text-xs">enter</code> (viewport).
          </p>
        </div>

        <div class="flex gap-4 flex-wrap">
          <div
            and-motion="fade-up"
            and-motion-trigger="enter"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-primary to-primary/80"
          >
            <span class="text-2xl">👁️</span>
            <span class="text-xs">Enter</span>
            <span class="text-[10px] opacity-70">fade-up</span>
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
            and-motion="slide-right"
            and-motion-trigger="enter"
            and-motion-duration="900ms"
            and-motion-delay="200ms"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700"
          >
            <span class="text-2xl">⏱️</span>
            <span class="text-xs">900ms</span>
            <span class="text-[10px] opacity-70">slide-right</span>
          </div>
        </div>
      </section>

      <!-- ── All Animation Groups ── -->
      @for (group of groups; track group.label) {
        <section class="border border-border rounded-xl p-6 bg-card">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span
                class="inline-block text-xs font-semibold uppercase tracking-wider text-white px-2.5 py-1 rounded-full mb-2 bg-gradient-to-r"
                [class]="group.color"
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
            @for (anim of group.items; track anim) {
              <div
                [attr.and-motion]="anim"
                [attr.data-anim-group]="group.label"
                class="relative flex flex-col items-center justify-center gap-1 min-w-[100px] h-[90px] rounded-xl text-white font-semibold text-xs shadow-md overflow-hidden bg-gradient-to-br"
                [class]="group.color"
              >
                <span class="font-mono text-[10px] leading-tight text-center px-1 opacity-90">{{ anim }}</span>
                <button
                  (click)="playCard($event)"
                  class="mt-1 flex items-center gap-0.5 text-[10px] font-medium text-white/90 bg-white/20 hover:bg-white/30 rounded-md px-2 py-0.5 transition-colors cursor-pointer"
                >
                  ▶ Play
                </button>
              </div>
            }
          </div>
        </section>
      }

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

  readonly snippetInstall = `pnpm add @andersseen/motion`;

  readonly snippetInitMotion = `import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

// Auto-scan document.body for [and-motion] elements
const cleanup = initMotion({ once: false });

// Call cleanup() on SPA unmount or when done`;

  readonly snippetAttributes = `<div
  and-motion="fade-up"
  and-motion-duration="700ms"
  and-motion-delay="120ms"
  and-motion-easing="ease-out"
>
  Animated card
</div>`;

  readonly snippetControllerReplay = `import { MotionController } from '@andersseen/motion';

const mc = new MotionController({
  root: document.getElementById('app'),
  once: false,
});

// Programmatic replay
function replay(el) {
  el.removeAttribute('and-motion-state');
  void el.offsetWidth; // force reflow
  el.setAttribute('and-motion-state', 'active');
}

// Cleanup
mc.destroy();`;

  ngAfterViewInit() {
    // MotionController ONLY scoped to the trigger-mode demos (enter/hover/tap)
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
    const card = (event.target as HTMLElement).closest<HTMLElement>('[and-motion]');
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

  private playElement(el: HTMLElement): void {
    const animName = el.getAttribute('and-motion') || '';
    if (!animName) return;

    // Reset any in-progress animation
    el.removeAttribute('and-motion-state');
    void el.offsetWidth;

    // Trigger animation
    el.setAttribute('and-motion-state', 'active');

    // Clean up when animation ends
    const ac = new AbortController();
    this.abortControllers.push(ac);

    el.addEventListener(
      'animationend',
      () => {
        el.removeAttribute('and-motion-state');
        el.style.opacity = '';
        el.style.transform = '';
      },
      { once: true, signal: ac.signal },
    );

    // Fallback timeout
    const fallbackMs = this.getAnimDuration(el) + 200;
    const t = window.setTimeout(() => {
      el.removeAttribute('and-motion-state');
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
