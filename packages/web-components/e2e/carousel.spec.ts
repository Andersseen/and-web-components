import { test, expect } from '@playwright/test';

test.describe('and-carousel — manual (no autoplay)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/carousel.html');
  });

  test('starts on the first slide with a coherent dot-indicator state', async ({ page }) => {
    const carousel = page.locator('and-carousel#basic');
    const dots = carousel.getByRole('tab');

    await expect(dots).toHaveCount(3);
    await expect(dots.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(dots.nth(1)).toHaveAttribute('aria-selected', 'false');
  });

  test('Next advances the active slide and emits andSlideChange', async ({ page }) => {
    const carousel = page.locator('and-carousel#basic');
    const changes: number[] = [];
    await page.exposeFunction('recordSlideChange', (i: number) => changes.push(i));
    await page.evaluate(() => {
      document
        .querySelector('and-carousel#basic')
        ?.addEventListener('andSlideChange', e => (window as any).recordSlideChange((e as CustomEvent).detail));
    });

    await carousel.getByRole('button', { name: 'Next slide' }).click();

    await expect(carousel.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => changes).toEqual([1]);
  });

  test('Previous from the first slide loops to the last slide (no boundary clamping)', async ({ page }) => {
    const carousel = page.locator('and-carousel#basic');
    const prevButton = carousel.getByRole('button', { name: 'Previous slide' });

    // Loop behavior means the control is never disabled at a boundary.
    await expect(prevButton).toBeEnabled();
    await prevButton.click();

    await expect(carousel.getByRole('tab').nth(2)).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a dot indicator jumps directly to that slide', async ({ page }) => {
    const carousel = page.locator('and-carousel#basic');
    await carousel.getByRole('tab', { name: 'Go to slide 3' }).click();

    await expect(carousel.getByRole('tab').nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(carousel.getByRole('tab').nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  test('ArrowLeft/ArrowRight navigate when focus is inside the carousel', async ({ page }) => {
    const carousel = page.locator('and-carousel#basic');
    await carousel.getByRole('button', { name: 'Next slide' }).focus();

    await page.keyboard.press('ArrowRight');
    await expect(carousel.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowLeft');
    await expect(carousel.getByRole('tab').nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('no autoplay pause/play control is rendered when autoplay is off', async ({ page }) => {
    const carousel = page.locator('and-carousel#basic');
    await expect(carousel.getByRole('button', { name: /pause carousel|play carousel/i })).toHaveCount(0);
  });
});

test.describe('and-carousel — autoplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/carousel.html');
  });

  test('shows a pause/play control that toggles its pressed state and label', async ({ page }) => {
    const carousel = page.locator('and-carousel#autoplay');
    const pauseButton = carousel.getByRole('button', { name: 'Pause carousel' });

    await expect(pauseButton).toHaveAttribute('aria-pressed', 'false');
    await pauseButton.click();

    const playButton = carousel.getByRole('button', { name: 'Play carousel' });
    await expect(playButton).toHaveAttribute('aria-pressed', 'true');
  });
});
