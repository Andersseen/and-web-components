import { describe, it, expect, vi } from 'vitest';
import { createCarousel } from '../carousel';

describe('createCarousel', () => {
  it('returns expected default state and methods', () => {
    const carousel = createCarousel();
    expect(carousel.state.activeIndex).toBe(0);
    expect(carousel.state.slideCount).toBe(0);
    expect(carousel.state.autoplay).toBe(false);
    expect(carousel.actions).toBeDefined();
    expect(carousel.queries).toBeDefined();
    expect(carousel.getTrackProps).toBeDefined();
    expect(carousel.getSlideProps).toBeDefined();
    expect(carousel.getPrevButtonProps).toBeDefined();
    expect(carousel.getNextButtonProps).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const carousel = createCarousel({
      slideCount: 5,
      defaultIndex: 2,
      autoplay: true,
    });
    expect(carousel.state.activeIndex).toBe(2);
    expect(carousel.state.slideCount).toBe(5);
    expect(carousel.state.autoplay).toBe(true);
  });

  it('clamps default index to slide count on init', () => {
    const carousel = createCarousel({ slideCount: 3, defaultIndex: 5 });
    expect(carousel.state.activeIndex).toBe(2);
  });

  it('wraps negative default index on init', () => {
    const carousel = createCarousel({ slideCount: 3, defaultIndex: -1 });
    expect(carousel.state.activeIndex).toBe(2);
  });

  it('can navigate to next and previous slides', () => {
    const carousel = createCarousel({ slideCount: 3, defaultIndex: 0 });
    carousel.actions.goToNext();
    expect(carousel.state.activeIndex).toBe(1);
    carousel.actions.goToPrev();
    expect(carousel.state.activeIndex).toBe(0);
  });

  it('wraps around when navigating past bounds', () => {
    const carousel = createCarousel({ slideCount: 3, defaultIndex: 0 });
    carousel.actions.goToPrev();
    expect(carousel.state.activeIndex).toBe(2);
    carousel.actions.goToNext();
    expect(carousel.state.activeIndex).toBe(0);
  });

  it('can navigate directly to a slide', () => {
    const carousel = createCarousel({ slideCount: 5, defaultIndex: 0 });
    carousel.actions.goToSlide(3);
    expect(carousel.state.activeIndex).toBe(3);
  });

  it('wraps direct navigation', () => {
    const carousel = createCarousel({ slideCount: 3, defaultIndex: 0 });
    carousel.actions.goToSlide(-1);
    expect(carousel.state.activeIndex).toBe(2);
    carousel.actions.goToSlide(6);
    expect(carousel.state.activeIndex).toBe(0);
  });

  it('does nothing when slide count is zero', () => {
    const carousel = createCarousel();
    carousel.actions.goToNext();
    carousel.actions.goToPrev();
    carousel.actions.goToSlide(2);
    expect(carousel.state.activeIndex).toBe(0);
  });

  it('can update slide count and reset active index when out of bounds', () => {
    const carousel = createCarousel({ slideCount: 5, defaultIndex: 4 });
    carousel.actions.setSlideCount(3);
    expect(carousel.state.slideCount).toBe(3);
    expect(carousel.state.activeIndex).toBe(0);
  });

  it('keeps active index when still in bounds after slide count change', () => {
    const carousel = createCarousel({ slideCount: 5, defaultIndex: 2 });
    carousel.actions.setSlideCount(4);
    expect(carousel.state.activeIndex).toBe(2);
  });

  it('can toggle autoplay', () => {
    const carousel = createCarousel();
    carousel.actions.setAutoplay(true);
    expect(carousel.state.autoplay).toBe(true);
    carousel.actions.setAutoplay(false);
    expect(carousel.state.autoplay).toBe(false);
  });

  it('calls onIndexChange callback when index changes', () => {
    const onIndexChange = vi.fn();
    const carousel = createCarousel({
      slideCount: 3,
      defaultIndex: 0,
      onIndexChange,
    });
    carousel.actions.goToNext();
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not call onIndexChange if index does not change', () => {
    const onIndexChange = vi.fn();
    const carousel = createCarousel({
      slideCount: 1,
      defaultIndex: 0,
      onIndexChange,
    });
    carousel.actions.goToNext();
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it('provides correct track props', () => {
    const carousel = createCarousel({ autoplay: true });
    const props = carousel.getTrackProps('track-1');
    expect(props['aria-live']).toBe('off');
    expect(props['aria-label']).toBe('Slides');
  });

  it('provides polite aria-live when autoplay is off', () => {
    const carousel = createCarousel({ autoplay: false });
    const props = carousel.getTrackProps('track-1');
    expect(props['aria-live']).toBe('polite');
  });

  it('provides correct slide props', () => {
    const carousel = createCarousel({ slideCount: 2, defaultIndex: 0 });

    const activeProps = carousel.getSlideProps(0);
    expect(activeProps.role).toBe('group');
    expect(activeProps['aria-roledescription']).toBe('slide');
    expect(activeProps['aria-label']).toBe('Slide 1');
    expect(activeProps['aria-hidden']).toBe(false);

    const hiddenProps = carousel.getSlideProps(1);
    expect(hiddenProps['aria-hidden']).toBe(true);
  });

  it('can override slide label', () => {
    const carousel = createCarousel({ slideCount: 1 });
    const props = carousel.getSlideProps(0, 'Intro');
    expect(props['aria-label']).toBe('Intro');
  });

  it('provides correct control props', () => {
    const carousel = createCarousel();
    const prevProps = carousel.getPrevButtonProps('track-1');
    expect(prevProps['aria-controls']).toBe('track-1');
    expect(prevProps['aria-label']).toBe('Previous slide');

    const nextProps = carousel.getNextButtonProps('track-1');
    expect(nextProps['aria-controls']).toBe('track-1');
    expect(nextProps['aria-label']).toBe('Next slide');
  });

  it('provides correct isActive query', () => {
    const carousel = createCarousel({ slideCount: 3, defaultIndex: 1 });
    expect(carousel.queries.isActive(1)).toBe(true);
    expect(carousel.queries.isActive(0)).toBe(false);
  });

  it('notifies subscribers on state changes', () => {
    const carousel = createCarousel({ slideCount: 3 });
    const callback = vi.fn();
    const unsubscribe = carousel.subscribe(callback);

    carousel.actions.goToNext();
    expect(callback).toHaveBeenCalled();

    unsubscribe();
    carousel.actions.goToNext();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
