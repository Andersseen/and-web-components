import { Component, h, Host, State, Element, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────────────────── */

const carouselClass = 'relative overflow-hidden rounded-lg';

const trackContainerClass = 'overflow-hidden';

const trackClass = 'flex transition-transform duration-300 ease-out';

const controlBaseClass = [
  'absolute top-1/2 -translate-y-1/2 z-10',
  'inline-flex h-10 w-10 items-center justify-center rounded-full',
  'bg-background/80 text-foreground border border-border',
  'shadow-sm backdrop-blur-sm transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ');

const dotBaseClass = [
  'h-2 w-2 rounded-full border-none cursor-pointer transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-carousel',
  styleUrl: 'and-carousel.css',
  shadow: true,
})
export class AndCarousel {
  @Element() el: HTMLElement;

  /** Whether the carousel auto-advances. */
  @Prop({ reflect: true }) autoplay: boolean = false;

  /** Interval in ms between auto-advances. */
  @Prop() interval: number = 3000;

  /** ARIA label for the carousel region. */
  @Prop() label: string = 'Carousel';

  /** Emitted when the active slide changes. */
  @Event({ bubbles: true, composed: true }) andSlideChange: EventEmitter<number>;

  @State() private activeIndex: number = 0;

  private slideCount: number = 0;
  private autoplayTimer: ReturnType<typeof setInterval> | undefined;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentDidLoad() {
    this.slideCount = this.el.querySelectorAll('and-carousel-item').length;
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  /* ── Autoplay ───────────────────────────────────────────────────── */

  private startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => this.goToNext(), this.interval);
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  /* ── Navigation ─────────────────────────────────────────────────── */

  private goToNext = () => {
    if (this.slideCount === 0) return;
    this.setActiveIndex((this.activeIndex + 1) % this.slideCount);
  };

  private goToPrev = () => {
    if (this.slideCount === 0) return;
    this.setActiveIndex((this.activeIndex - 1 + this.slideCount) % this.slideCount);
  };

  private goToSlide = (index: number) => {
    this.setActiveIndex(index);
  };

  private setActiveIndex(index: number) {
    this.activeIndex = index;
    this.andSlideChange.emit(index);
  }

  /* ── Interaction ────────────────────────────────────────────────── */

  private handleMouseEnter = () => {
    if (this.autoplay) this.stopAutoplay();
  };

  private handleMouseLeave = () => {
    if (this.autoplay) this.startAutoplay();
  };

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        this.goToPrev();
        break;
      case 'ArrowRight':
        ev.preventDefault();
        this.goToNext();
        break;
    }
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const dots = Array.from({ length: this.slideCount }, (_, i) => i);

    return (
      <Host>
        <section
          class={carouselClass}
          role="region"
          aria-roledescription="carousel"
          aria-label={this.label}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div class={trackContainerClass}>
            <div
              class={trackClass}
              style={{ transform: `translateX(-${this.activeIndex * 100}%)` }}
              aria-live={this.autoplay ? 'off' : 'polite'}
            >
              <slot />
            </div>
          </div>

          {/* Previous */}
          <button
            class={cn(controlBaseClass, 'left-2')}
            onClick={this.goToPrev}
            aria-label="Previous slide"
          >
            <and-icon name="chevron-left" size={16} class="h-4 w-4" />
          </button>

          {/* Next */}
          <button
            class={cn(controlBaseClass, 'right-2')}
            onClick={this.goToNext}
            aria-label="Next slide"
          >
            <and-icon name="chevron-right" size={16} class="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          {this.slideCount > 1 && (
            <div
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
              role="tablist"
              aria-label="Slide indicators"
            >
              {dots.map(i => (
                <button
                  key={i}
                  role="tab"
                  class={cn(
                    dotBaseClass,
                    i === this.activeIndex ? 'bg-foreground' : 'bg-muted-foreground/40',
                  )}
                  aria-selected={i === this.activeIndex ? 'true' : 'false'}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => this.goToSlide(i)}
                />
              ))}
            </div>
          )}
        </section>
      </Host>
    );
  }
}
