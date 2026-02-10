import { Component, h, State, Element, Prop } from '@stencil/core';

@Component({
  tag: 'my-carousel',
  styleUrl: 'my-carousel.css',
  shadow: true,
})
export class MyCarousel {
  @Element() el: HTMLElement;

  @Prop() autoplay: boolean = false;
  @Prop() interval: number = 3000;

  @State() activeIndex: number = 0;

  private slideCount: number = 0;
  private autoplayTimer: any;

  componentDidLoad() {
    this.slideCount = this.el.querySelectorAll('my-carousel-item').length;
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  private startAutoplay() {
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  }

  private nextSlide = () => {
    this.activeIndex = (this.activeIndex + 1) % this.slideCount;
  };

  private prevSlide = () => {
    this.activeIndex = (this.activeIndex - 1 + this.slideCount) % this.slideCount;
  };

  private handleMouseEnter = () => {
    if (this.autoplay) this.stopAutoplay();
  };

  private handleMouseLeave = () => {
    if (this.autoplay) this.startAutoplay();
  };

  render() {
    return (
      <div class="carousel" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div class="carousel-track-container">
          <div class="carousel-track" style={{ transform: `translateX(-${this.activeIndex * 100}%)` }}>
            <slot></slot>
          </div>
        </div>

        <button class="carousel-control prev" onClick={this.prevSlide}>
          <my-icon name="chevron-left" size={16} class="h-4 w-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button class="carousel-control next" onClick={this.nextSlide}>
          <my-icon name="chevron-right" size={16} class="h-4 w-4" />
          <span class="sr-only">Next</span>
        </button>
      </div>
    );
  }
}
