import { Component, h, Host, State, Element, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { createCarousel, type CarouselReturn, createIdGenerator } from '@andersseen/headless-components';
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
  styleUrls: ['and-carousel.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCarousel {
  @Element() el!: HTMLElement;

  /** Whether the carousel auto-advances. */
  @Prop({ reflect: true }) autoplay: boolean = false;

  /** Interval in ms between auto-advances. */
  @Prop() interval: number = 3000;

  /** ARIA label for the carousel region. */
  @Prop() label: string = 'Carousel';

  /** Emitted when the active slide changes. */
  @Event({ bubbles: true, composed: true }) andSlideChange!: EventEmitter<number>;

  @State() private renderTick = 0;
  private carouselLogic!: CarouselReturn;
  private autoplayTimer: ReturnType<typeof setInterval> | undefined;
  private trackId: string = createIdGenerator('carousel')('track');
  private unsubscribe!: () => void;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.carouselLogic = createCarousel({
      autoplay: this.autoplay,
      onIndexChange: (index: number) => {
        this.andSlideChange.emit(index);
      },
    });
    this.unsubscribe = this.carouselLogic.subscribe(() => {
      this.renderTick++;
    });
  }

  componentDidLoad() {
    const count = this.el.querySelectorAll('and-carousel-item').length;
    this.carouselLogic.actions.setSlideCount(count);
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
    this.unsubscribe?.();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('autoplay')
  autoplayChanged(newValue: boolean) {
    this.carouselLogic.actions.setAutoplay(newValue);
    if (newValue) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  /* ── Autoplay ───────────────────────────────────────────────────── */

  private startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => this.carouselLogic.actions.goToNext(), this.interval);
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  /* ── Interaction ────────────────────────────────────────────────── */

  private handleMouseEnter = () => {
    if (this.autoplay) {
      this.stopAutoplay();
    }
  };

  private handleMouseLeave = () => {
    if (this.autoplay) {
      this.startAutoplay();
    }
  };

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        this.carouselLogic.actions.goToPrev();
        break;
      case 'ArrowRight':
        ev.preventDefault();
        this.carouselLogic.actions.goToNext();
        break;
    }
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const state = this.carouselLogic.state;
    const dots = Array.from({ length: state.slideCount }, (_, i) => i);
    const trackProps = this.carouselLogic.getTrackProps(this.trackId);
    const prevProps = this.carouselLogic.getPrevButtonProps(this.trackId);
    const nextProps = this.carouselLogic.getNextButtonProps(this.trackId);

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
              id={this.trackId}
              class={trackClass}
              style={{ transform: `translateX(-${state.activeIndex * 100}%)` }}
              {...trackProps}
            >
              <slot />
            </div>
          </div>

          {/* Previous */}
          <button
            class={cn(controlBaseClass, 'left-2')}
            onClick={() => this.carouselLogic.actions.goToPrev()}
            {...prevProps}
          >
            <and-icon name="chevron-left" size={16} class="h-4 w-4" />
          </button>

          {/* Next */}
          <button
            class={cn(controlBaseClass, 'right-2')}
            onClick={() => this.carouselLogic.actions.goToNext()}
            {...nextProps}
          >
            <and-icon name="chevron-right" size={16} class="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          {state.slideCount > 1 && (
            <div
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
              role="tablist"
              aria-label="Slide indicators"
            >
              {dots.map(i => (
                <button
                  key={i}
                  role="tab"
                  class={cn(dotBaseClass, i === state.activeIndex ? 'bg-foreground' : 'bg-muted-foreground/40')}
                  aria-selected={i === state.activeIndex ? 'true' : 'false'}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => this.carouselLogic.actions.goToSlide(i)}
                />
              ))}
            </div>
          )}
        </section>
      </Host>
    );
  }
}
