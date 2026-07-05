/**
 * Headless Carousel Component
 *
 * Provides state management and accessibility for carousel/slider components.
 * Handles active slide tracking, autoplay, and ARIA semantics.
 */

import { createStore } from '../utils/store';
import type { EventCallback } from '../types/common';

export interface CarouselConfig {
  /** Total number of slides */
  slideCount?: number;
  /** Initially active slide index */
  defaultIndex?: number;
  /** Whether autoplay is enabled */
  autoplay?: boolean;
  /** Interval in ms between auto-advances */
  interval?: number;
  /** Callback when active slide changes */
  onIndexChange?: EventCallback<number>;
}

export interface CarouselState {
  activeIndex: number;
  slideCount: number;
  autoplay: boolean;
}

export interface CarouselTrackProps {
  'aria-live': 'off' | 'polite';
  'aria-label': string;
}

export interface CarouselSlideProps {
  'role': 'group';
  'aria-roledescription': 'slide';
  'aria-label': string;
  'aria-hidden': boolean;
}

export interface CarouselControlProps {
  'aria-controls': string;
  'aria-label': string;
}

export interface CarouselReturn {
  state: Readonly<CarouselState>;
  subscribe: (callback: (state: Readonly<CarouselState>) => void) => () => void;
  actions: {
    goToNext: () => void;
    goToPrev: () => void;
    goToSlide: (index: number) => void;
    setSlideCount: (count: number) => void;
    setAutoplay: (autoplay: boolean) => void;
  };
  queries: {
    isActive: (index: number) => boolean;
  };
  getTrackProps: (trackId: string) => CarouselTrackProps;
  getSlideProps: (index: number, label?: string) => CarouselSlideProps;
  getPrevButtonProps: (trackId: string) => CarouselControlProps;
  getNextButtonProps: (trackId: string) => CarouselControlProps;
}

export function createCarousel(config: CarouselConfig = {}): CarouselReturn {
  const slideCount = config.slideCount ?? 0;
  const rawDefaultIndex = config.defaultIndex ?? 0;
  const normalizedDefaultIndex = slideCount === 0 ? 0 : ((rawDefaultIndex % slideCount) + slideCount) % slideCount;

  const store = createStore<CarouselState>({
    activeIndex: normalizedDefaultIndex,
    slideCount,
    autoplay: config.autoplay ?? false,
  });

  const setActiveIndex = (index: number) => {
    const { slideCount } = store.state;
    if (slideCount === 0) {
      return;
    }
    const clamped = ((index % slideCount) + slideCount) % slideCount;
    if (clamped === store.state.activeIndex) {
      return;
    }
    store.setState({ activeIndex: clamped });
    config.onIndexChange?.(clamped);
  };

  const goToNext = () => setActiveIndex(store.state.activeIndex + 1);
  const goToPrev = () => setActiveIndex(store.state.activeIndex - 1);
  const goToSlide = (index: number) => setActiveIndex(index);

  const setSlideCount = (count: number) => {
    store.setState({ slideCount: count });
    if (store.state.activeIndex >= count && count > 0) {
      setActiveIndex(0);
    }
  };

  const setAutoplay = (autoplay: boolean) => {
    store.setState({ autoplay });
  };

  const isActive = (index: number) => index === store.state.activeIndex;

  const getTrackProps = (_trackId: string): CarouselTrackProps => ({
    'aria-live': store.state.autoplay ? 'off' : 'polite',
    'aria-label': 'Slides',
  });

  const getSlideProps = (index: number, label?: string): CarouselSlideProps => ({
    'role': 'group',
    'aria-roledescription': 'slide',
    'aria-label': label ?? `Slide ${index + 1}`,
    'aria-hidden': !isActive(index),
  });

  const getPrevButtonProps = (trackId: string): CarouselControlProps => ({
    'aria-controls': trackId,
    'aria-label': 'Previous slide',
  });

  const getNextButtonProps = (trackId: string): CarouselControlProps => ({
    'aria-controls': trackId,
    'aria-label': 'Next slide',
  });

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => store.subscribe(state => callback(state)),
    actions: { goToNext, goToPrev, goToSlide, setSlideCount, setAutoplay },
    queries: { isActive },
    getTrackProps,
    getSlideProps,
    getPrevButtonProps,
    getNextButtonProps,
  };
}
