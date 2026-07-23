import { test, expect } from '@playwright/test';

test.describe('Landing Page Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle('And Web Components - Framework-agnostic UI Ecosystem');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      'Andersseen web component ecosystem: framework-agnostic UI libraries for web components, headless logic, icons, motion, and layout.',
    );
  });

  test('all main sections are visible', async ({ page }) => {
    // Hero section
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#hero h1')).toContainText('One UI ecosystem.');

    // Features section
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('#features')).toContainText('Everything You Need');

    // Showcase section
    await expect(page.locator('#showcase')).toBeVisible();
    await expect(page.locator('#showcase')).toContainText('See It In Action');

    // Behaviors section
    await expect(page.locator('#behaviors')).toBeVisible();
    await expect(page.locator('#behaviors')).toContainText('Enhance HTML You Already Have');

    // Ecosystem section
    await expect(page.locator('#ecosystem')).toBeVisible();
    await expect(page.locator('#ecosystem')).toContainText('Modular By Design');

    // AI tools section
    await expect(page.locator('#ai-tools')).toBeVisible();
    await expect(page.locator('#ai-tools')).toContainText('Built for AI-Native Development');

    // Footer section
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Andersseen');
  });
});
