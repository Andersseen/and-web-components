---
title: Headless Core — Carousel
description:
  createCarousel — active-slide index with wraparound, plus ARIA for the track
  and slide-navigation controls. Powers the styled Carousel component.
---

Powers [Carousel](/components/carousel/) internally. No autoplay timer, no
swipe/drag handling, and no transform/scroll math — those are real DOM/timing
concerns the consuming component owns. This factory only tracks which index is
active and hands back the ARIA wiring.

## Usage

```ts
import { createCarousel } from '@andersseen/headless-components/carousel';

const carousel = createCarousel({
  slideCount: 5,
  defaultIndex: 0,
  onIndexChange: index => console.log('Active slide:', index),
});

carousel.actions.goToNext();
carousel.queries.isActive(1); // true after the call above
```

## Config

| Option          | Type                      | Default | Notes                                                                            |
| --------------- | ------------------------- | ------- | -------------------------------------------------------------------------------- |
| `slideCount`    | `number`                  | `0`     |                                                                                  |
| `defaultIndex`  | `number`                  | `0`     | Normalized modulo `slideCount` on creation.                                      |
| `autoplay`      | `boolean`                 | `false` | Just a state flag — starting/stopping a timer from it is up to you.              |
| `interval`      | `number` (ms)             | —       | Accepted by the config type; not read internally — same reasoning as `autoplay`. |
| `onIndexChange` | `(index: number) => void` | —       |                                                                                  |

## State

`activeIndex`, `slideCount`, `autoplay`.

## Actions & queries

| Member                              | Signature                     | Notes                                                                             |
| ----------------------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| `actions.goToNext()` / `goToPrev()` | `() => void`                  | Wraps around at either end.                                                       |
| `actions.goToSlide(index)`          | `(index: number) => void`     | Also wraps — negative or out-of-range indexes are normalized modulo `slideCount`. |
| `actions.setSlideCount(count)`      | `(count: number) => void`     | Resets `activeIndex` to `0` if it's now out of range.                             |
| `actions.setAutoplay(v)`            | `(autoplay: boolean) => void` |                                                                                   |
| `queries.isActive(index)`           | `(index: number) => boolean`  |                                                                                   |

## Prop-getters

| Getter                                                        | Returns                                                                                                                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `getTrackProps(trackId)`                                      | `aria-live` (`'off'` while `autoplay`, else `'polite'`), `aria-label: 'Slides'`                                                           |
| `getSlideProps(index, label?)`                                | `role: 'group'`, `aria-roledescription: 'slide'`, `aria-label` (defaults to `Slide N`), `aria-hidden` (`true` for every non-active slide) |
| `getPrevButtonProps(trackId)` / `getNextButtonProps(trackId)` | `aria-controls: trackId`, `aria-label`                                                                                                    |

`aria-live` switching off during autoplay is deliberate — a screen reader
shouldn't announce every auto-advance, only manual navigation.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="carousel-demo-prev" variant="outline">Prev</and-button>
    <and-button id="carousel-demo-next">Next</and-button>
  </div>
  <pre id="carousel-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runCarouselDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('carousel-demo-output');
    if (!H || !output) return;

    const carousel = H.createCarousel({ slideCount: 3 });

    const render = () => {
      output.textContent =
        'carousel.state →\n' + JSON.stringify(carousel.state, null, 2) +
        '\n\ncarousel.getSlideProps(carousel.state.activeIndex) →\n' +
        JSON.stringify(carousel.getSlideProps(carousel.state.activeIndex), null, 2);
    };
    carousel.subscribe(render);
    render();

    document.getElementById('carousel-demo-prev')?.addEventListener('click', () => carousel.actions.goToPrev());
    document.getElementById('carousel-demo-next')?.addEventListener('click', () => carousel.actions.goToNext());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCarouselDemo);
  } else {
    runCarouselDemo();
  }
</script>

## Next steps

[Primitives](/headless/primitives/) — every factory above follows the same
`state`/`subscribe`/`actions`/`queries`/prop-getter shape this one does.
