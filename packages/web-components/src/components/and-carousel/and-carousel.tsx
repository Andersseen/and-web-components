import { Component, h, Host, State, Element, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { createCarousel, type CarouselReturn, createIdGenerator } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import {
  carouselClass,
  trackContainerClass,
  trackClass,
  controlBaseClass,
  dotBaseClass,
  playPauseClass,
} from './and-carousel-variants';

/**
 * Slideshow of `and-carousel-item` slides with previous/next controls,
 * dot indicators, and optional autoplay.
 *
 * When `autoplay` is on, a pause/play button is shown (required for WCAG
 * 2.2.2 — content that moves for more than 5s must be user-pausable, and
 * pausing only on `mouseenter` leaves keyboard and screen-reader users
 * with no way to stop it). Autoplay also pauses automatically while any
 * control inside the carousel has focus.
 *
 * @example
 * ```html
 * <and-carousel label="Featured products" autoplay="true">
 *   <and-carousel-item label="Slide 1">...</and-carousel-item>
 *   <and-carousel-item label="Slide 2">...</and-carousel-item>
 * </and-carousel>
 * ```
 */
@Component({
  tag: 'and-carousel',
  styleUrls: ['and-carousel.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCarousel {
  @Element() el!: HTMLElement;

  /** Whether the carousel auto-advances. A pause/play control is shown whenever this is true. */
  @Prop({ reflect: true }) autoplay: boolean = false;

  /** Interval in ms between auto-advances. */
  @Prop() interval: number = 3000;

  /** ARIA label for the carousel region. */
  @Prop() label: string = 'Carousel';

  /** Emitted when the active slide changes. */
  @Event({ bubbles: true, composed: true }) andSlideChange!: EventEmitter<number>;

  @State() private renderTick = 0;
  @State() private userPaused: boolean = false;
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
    if (newValue && !this.userPaused) {
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

  private togglePause = () => {
    this.userPaused = !this.userPaused;
    if (this.userPaused) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  };

  /* ── Interaction ────────────────────────────────────────────────── */

  private handlePauseTrigger = () => {
    if (this.autoplay && !this.userPaused) {
      this.stopAutoplay();
    }
  };

  private handleResumeTrigger = () => {
    if (this.autoplay && !this.userPaused) {
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
          onMouseEnter={this.handlePauseTrigger}
          onMouseLeave={this.handleResumeTrigger}
          onFocusin={this.handlePauseTrigger}
          onFocusout={this.handleResumeTrigger}
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

          {/* Pause/play — required so autoplay can be stopped without a mouse (WCAG 2.2.2) */}
          {this.autoplay && (
            <button
              type="button"
              class={playPauseClass}
              onClick={this.togglePause}
              aria-label={this.userPaused ? 'Play carousel' : 'Pause carousel'}
              aria-pressed={this.userPaused ? 'true' : 'false'}
            >
              <and-icon name={this.userPaused ? 'play' : 'pause'} size={14} class="h-3.5 w-3.5" />
            </button>
          )}

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
