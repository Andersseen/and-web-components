import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionController } from '@andersseen/motion';

/* ───── Animation catalogue (mirrors core.css) ───── */

interface AnimGroup {
  label: string;
  tag: string;
  color: string;
  items: string[];
}

const ANIM_GROUPS: AnimGroup[] = [
  {
    label: 'Attention Seekers',
    tag: 'Attention',
    color: 'from-amber-500 to-orange-600',
    items: [
      'pulse',
      'rubber-band',
      'shake-x',
      'shake-y',
      'head-shake',
      'swing',
      'tada',
      'wobble',
      'jello',
      'heart-beat',
      'flash',
      'bounce',
    ],
  },
  {
    label: 'Fading Entrances',
    tag: 'Fade In',
    color: 'from-sky-500 to-blue-600',
    items: [
      'fade-in',
      'fade-in-down',
      'fade-in-down-big',
      'fade-in-left',
      'fade-in-left-big',
      'fade-in-right',
      'fade-in-right-big',
      'fade-in-up',
      'fade-in-up-big',
      'fade-in-top-left',
      'fade-in-top-right',
      'fade-in-bottom-left',
      'fade-in-bottom-right',
    ],
  },
  {
    label: 'Fading Exits',
    tag: 'Fade Out',
    color: 'from-slate-500 to-slate-700',
    items: [
      'fade-out',
      'fade-out-down',
      'fade-out-down-big',
      'fade-out-left',
      'fade-out-left-big',
      'fade-out-right',
      'fade-out-right-big',
      'fade-out-up',
      'fade-out-up-big',
    ],
  },
  {
    label: 'Sliding Entrances',
    tag: 'Slide In',
    color: 'from-emerald-500 to-green-600',
    items: [
      'slide-in-up',
      'slide-in-down',
      'slide-in-left',
      'slide-in-right',
    ],
  },
  {
    label: 'Sliding Exits',
    tag: 'Slide Out',
    color: 'from-emerald-700 to-green-900',
    items: [
      'slide-out-up',
      'slide-out-down',
      'slide-out-left',
      'slide-out-right',
    ],
  },
  {
    label: 'Zooming Entrances',
    tag: 'Zoom In',
    color: 'from-violet-500 to-purple-600',
    items: [
      'zoom-in',
      'zoom-in-down',
      'zoom-in-left',
      'zoom-in-right',
      'zoom-in-up',
    ],
  },
  {
    label: 'Zooming Exits',
    tag: 'Zoom Out',
    color: 'from-violet-700 to-purple-900',
    items: [
      'zoom-out',
      'zoom-out-down',
      'zoom-out-left',
      'zoom-out-right',
      'zoom-out-up',
    ],
  },
  {
    label: 'Bouncing Entrances',
    tag: 'Bounce In',
    color: 'from-rose-500 to-pink-600',
    items: [
      'bounce-in',
      'bounce-in-down',
      'bounce-in-left',
      'bounce-in-right',
      'bounce-in-up',
    ],
  },
  {
    label: 'Bouncing Exits',
    tag: 'Bounce Out',
    color: 'from-rose-700 to-pink-900',
    items: [
      'bounce-out',
      'bounce-out-down',
      'bounce-out-left',
      'bounce-out-right',
      'bounce-out-up',
    ],
  },
  {
    label: 'Flippers',
    tag: 'Flip',
    color: 'from-cyan-500 to-teal-600',
    items: ['flip', 'flip-in-x', 'flip-in-y', 'flip-out-x', 'flip-out-y'],
  },
  {
    label: 'Rotating Entrances',
    tag: 'Rotate In',
    color: 'from-indigo-500 to-indigo-700',
    items: [
      'rotate-in',
      'rotate-in-down-left',
      'rotate-in-down-right',
      'rotate-in-up-left',
      'rotate-in-up-right',
    ],
  },
  {
    label: 'Rotating Exits',
    tag: 'Rotate Out',
    color: 'from-indigo-700 to-indigo-900',
    items: [
      'rotate-out',
      'rotate-out-down-left',
      'rotate-out-down-right',
      'rotate-out-up-left',
      'rotate-out-up-right',
    ],
  },
  {
    label: 'Light Speed',
    tag: 'Speed',
    color: 'from-yellow-400 to-amber-500',
    items: [
      'light-speed-in-right',
      'light-speed-in-left',
      'light-speed-out-right',
      'light-speed-out-left',
    ],
  },
  {
    label: 'Back Entrances',
    tag: 'Back In',
    color: 'from-fuchsia-500 to-fuchsia-700',
    items: [
      'back-in-down',
      'back-in-left',
      'back-in-right',
      'back-in-up',
    ],
  },
  {
    label: 'Back Exits',
    tag: 'Back Out',
    color: 'from-fuchsia-700 to-fuchsia-900',
    items: [
      'back-out-down',
      'back-out-left',
      'back-out-right',
      'back-out-up',
    ],
  },
  {
    label: 'Specials',
    tag: 'Special',
    color: 'from-red-500 to-red-700',
    items: ['hinge', 'jack-in-the-box', 'roll-in', 'roll-out'],
  },
  {
    label: 'Interaction Helpers',
    tag: 'Interaction',
    color: 'from-lime-500 to-green-600',
    items: ['scale-up', 'scale-down'],
  },
];

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
          <code class="bg-muted px-1.5 py-0.5 rounded border border-border text-xs">@andersseen/motion</code>
          — click <strong>Replay</strong> to retrigger any animation.
        </p>
      </div>

      <!-- ── Trigger Mode Demos (Enter / Hover / Tap) ── -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Trigger Modes</span>
          <h2 class="text-xl font-bold mb-1">Enter · Hover · Tap</h2>
          <p class="text-sm text-muted-foreground">
            The controller supports three trigger types via <code class="text-xs">and-motion-trigger</code>.
          </p>
        </div>

        <div class="flex gap-4 flex-wrap">
          <!-- Enter -->
          <div
            and-motion="fade-in-up"
            and-motion-trigger="enter"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg bg-gradient-to-br from-primary to-primary/80"
          >
            <span class="text-2xl">👁️</span>
            <span class="text-xs">Enter</span>
            <span class="text-[10px] opacity-70">fade-in-up</span>
          </div>

          <!-- Hover -->
          <div
            and-motion="pulse"
            and-motion-trigger="hover"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg cursor-pointer bg-gradient-to-br from-secondary to-secondary/80"
          >
            <span class="text-2xl">🖱️</span>
            <span class="text-xs">Hover me</span>
            <span class="text-[10px] opacity-70">pulse</span>
          </div>

          <!-- Tap -->
          <div
            and-motion="rubber-band"
            and-motion-trigger="tap"
            class="flex flex-col items-center justify-center gap-1 w-[110px] h-[110px] rounded-xl text-white font-semibold text-sm shadow-lg cursor-pointer select-none bg-gradient-to-br from-destructive to-destructive/80"
          >
            <span class="text-2xl">👆</span>
            <span class="text-xs">Tap me</span>
            <span class="text-[10px] opacity-70">rubber-band</span>
          </div>

          <!-- Custom Duration -->
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

      <!-- ── Animation Category Sections ── -->
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
              (click)="replayGroup(group)"
              class="text-xs font-medium text-primary hover:text-primary/80 border border-primary/30 rounded-lg px-3 py-1.5 transition-colors hover:bg-primary/5"
            >
              ↻ Replay All
            </button>
          </div>

          <div class="flex gap-3 flex-wrap">
            <div
              *ngFor="let anim of group.items"
              [attr.and-motion]="anim"
              [attr.and-motion-trigger]="'enter'"
              [attr.data-anim-group]="group.label"
              class="relative flex flex-col items-center justify-center gap-1 min-w-[100px] h-[90px] rounded-xl text-white font-semibold text-xs shadow-md overflow-hidden bg-gradient-to-br cursor-pointer"
              [ngClass]="group.color"
              (click)="replaySingle($event)"
            >
              <span class="font-mono text-[10px] leading-tight text-center px-1 opacity-90">{{ anim }}</span>
              <span class="text-[9px] opacity-60 mt-0.5">click to replay</span>
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

  groups = ANIM_GROUPS;
  totalCount = ANIM_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  private controller?: MotionController;

  ngAfterViewInit() {
    // Small timeout lets Angular flush the DOM before we scan
    setTimeout(() => {
      this.controller = new MotionController({
        root: this.demoRoot.nativeElement,
        once: false, // allow replay
      });
    }, 50);
  }

  ngOnDestroy() {
    this.controller?.destroy();
  }

  /** Replay a single animation card by re-toggling its state attribute. */
  replaySingle(event: Event): void {
    const el = event.currentTarget as HTMLElement;
    this.replayElement(el);
  }

  /** Replay every card in a group. */
  replayGroup(group: AnimGroup): void {
    const root = this.demoRoot.nativeElement;
    const cards = root.querySelectorAll<HTMLElement>(
      `[data-anim-group="${group.label}"]`,
    );
    cards.forEach((el, i) => {
      // Stagger the replays for visual clarity
      setTimeout(() => this.replayElement(el), i * 60);
    });
  }

  private replayElement(el: HTMLElement): void {
    // Remove state → reset opacity → wait a frame → re-activate
    el.removeAttribute('and-motion-state');
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '';
        el.setAttribute('and-motion-state', 'active');
      });
    });
  }
}
