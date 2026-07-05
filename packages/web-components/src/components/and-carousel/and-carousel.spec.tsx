import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-carousel';
import './and-carousel-item';
import '../and-icon/and-icon';

describe('and-carousel', () => {
  it('renders carousel region with default aria-label', async () => {
    const { root } = await render(
      <and-carousel>
        <and-carousel-item>Slide 1</and-carousel-item>
      </and-carousel>,
    );

    const section = root.shadowRoot.querySelector('section');
    expect(section).toBeTruthy();
    expect(section.getAttribute('role')).toBe('region');
    expect(section.getAttribute('aria-roledescription')).toBe('carousel');
    expect(section.getAttribute('aria-label')).toBe('Carousel');
  });

  it('counts carousel items and renders dot indicators', async () => {
    const { root, waitForChanges } = await render(
      <and-carousel>
        <and-carousel-item>Slide 1</and-carousel-item>
        <and-carousel-item>Slide 2</and-carousel-item>
        <and-carousel-item>Slide 3</and-carousel-item>
      </and-carousel>,
    );
    await waitForChanges();

    const dots = root.shadowRoot.querySelectorAll('[role="tab"]');
    expect(dots.length).toBe(3);
  });

  it('advances to next slide and emits andSlideChange', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-carousel>
        <and-carousel-item>Slide 1</and-carousel-item>
        <and-carousel-item>Slide 2</and-carousel-item>
      </and-carousel>,
    );
    await waitForChanges();

    const slideChangeSpy = spyOnEvent('andSlideChange');
    const nextButton = root.shadowRoot.querySelector('button[aria-label="Next slide"]') as HTMLElement;
    nextButton.click();
    await waitForChanges();

    expect(slideChangeSpy).toHaveReceivedEventTimes(1);
    expect(slideChangeSpy).toHaveReceivedEventDetail(1);

    const track = root.shadowRoot.querySelector('.flex.transition-transform') as HTMLElement;
    expect(track.style.transform).toContain('translateX(-100%)');
  });

  it('goes to slide when a dot indicator is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-carousel>
        <and-carousel-item>Slide 1</and-carousel-item>
        <and-carousel-item>Slide 2</and-carousel-item>
        <and-carousel-item>Slide 3</and-carousel-item>
      </and-carousel>,
    );
    await waitForChanges();

    const slideChangeSpy = spyOnEvent('andSlideChange');
    const dot = root.shadowRoot.querySelector('button[aria-label="Go to slide 3"]') as HTMLElement;
    dot.click();
    await waitForChanges();

    expect(slideChangeSpy).toHaveReceivedEventTimes(1);
    expect(slideChangeSpy).toHaveReceivedEventDetail(2);
  });

  it('navigates with arrow keys', async () => {
    const { root, waitForChanges } = await render(
      <and-carousel>
        <and-carousel-item>Slide 1</and-carousel-item>
        <and-carousel-item>Slide 2</and-carousel-item>
      </and-carousel>,
    );
    await waitForChanges();

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitForChanges();

    const track = root.shadowRoot.querySelector('.flex.transition-transform') as HTMLElement;
    expect(track.style.transform).toContain('translateX(-100%)');
  });
});
