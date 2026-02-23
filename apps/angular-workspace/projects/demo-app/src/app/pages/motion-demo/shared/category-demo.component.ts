import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionController } from '@andersseen/motion';
import { AnimGroup } from '../data/animation-catalogue';

/**
 * Reusable component that renders a set of animation groups with replay.
 * Used by every per-category route page.
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
          {{ totalCount }} animations — click any card or
          <strong>Replay All</strong> to retrigger.
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
    </div>
  `,
})
export class CategoryDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('demoRoot') demoRoot!: ElementRef<HTMLElement>;

  @Input() title = '';
  @Input() groups: AnimGroup[] = [];

  get totalCount(): number {
    return this.groups.reduce((sum, g) => sum + g.items.length, 0);
  }

  private controller?: MotionController;

  ngAfterViewInit() {
    setTimeout(() => {
      this.controller = new MotionController({
        root: this.demoRoot.nativeElement,
        once: false,
      });
    }, 50);
  }

  ngOnDestroy() {
    this.controller?.destroy();
  }

  replaySingle(event: Event): void {
    const el = event.currentTarget as HTMLElement;
    this.replayElement(el);
  }

  replayGroup(group: AnimGroup): void {
    const root = this.demoRoot.nativeElement;
    const cards = root.querySelectorAll<HTMLElement>(
      `[data-anim-group="${group.label}"]`,
    );
    cards.forEach((el, i) => {
      setTimeout(() => this.replayElement(el), i * 60);
    });
  }

  private replayElement(el: HTMLElement): void {
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
