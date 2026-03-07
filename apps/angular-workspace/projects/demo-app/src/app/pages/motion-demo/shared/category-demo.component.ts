import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { AnimGroup } from '../data/animation-catalogue';

/** Exit animation names end in -out or start with an out direction */
const EXIT_PATTERNS = [
  'fade-out', 'slide-out', 'zoom-out', 'bounce-out', 'flip-out',
  'rotate-out', 'back-out', 'light-speed-out', 'roll-out', 'hinge',
];

function isExitAnimation(name: string): boolean {
  return EXIT_PATTERNS.some((p) => name.startsWith(p) || name === p);
}

@Component({
  selector: 'app-category-demo',
  standalone: true,
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

      <!-- Developer examples -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Code Examples</span>
          <h2 class="text-xl font-bold mb-1">Using Animations In Your Project</h2>
          <p class="text-sm text-muted-foreground">
            Pure HTML attributes — works with any framework or vanilla JS.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article class="rounded-xl border border-border bg-muted/30 p-4">
            <h3 class="text-sm font-semibold mb-2">HTML Markup</h3>
            <pre class="rounded-lg border border-border bg-card p-3 overflow-x-auto text-xs leading-relaxed"><code>{{ markupSnippet }}</code></pre>
          </article>

          <article class="rounded-xl border border-border bg-muted/30 p-4">
            <h3 class="text-sm font-semibold mb-2">Vanilla JS Controller</h3>
            <pre class="rounded-lg border border-border bg-card p-3 overflow-x-auto text-xs leading-relaxed"><code>{{ controllerSnippet }}</code></pre>
          </article>
        </div>
      </section>

      <!-- Groups -->
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
    </div>
  `,
})
export class CategoryDemoComponent implements OnDestroy {
  @ViewChild('demoRoot') demoRoot!: ElementRef<HTMLElement>;

  @Input() title = '';
  @Input() groups: AnimGroup[] = [];

  private runningTimers: number[] = [];
  private abortControllers: AbortController[] = [];

  get sampleAnimation(): string {
    return this.groups[0]?.items[0] || 'fade-up';
  }

  get markupSnippet(): string {
    return `<div
  and-motion="${this.sampleAnimation}"
  and-motion-duration="650ms"
>
  Animated card
</div>`;
  }

  get controllerSnippet(): string {
    return `import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

// Auto-scan & animate on viewport enter
const cleanup = initMotion({ once: false });

// Call cleanup() when done (SPA unmount, etc.)`;
  }

  get totalCount(): number {
    return this.groups.reduce((sum, g) => sum + g.items.length, 0);
  }

  ngOnDestroy() {
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
