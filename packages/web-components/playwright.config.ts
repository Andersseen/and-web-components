import { defineConfig, devices } from '@playwright/test';

/**
 * Real-browser correctness suite for `@andersseen/web-components`.
 *
 * Runs against *built* package output (`dist/`) via the static server in
 * `e2e/serve.mjs` — the same eager `dist/components/all.js` bundle
 * `.storybook/preview.ts` uses — not source, not Storybook. See
 * `docs/SSD.md` §15 TD-15 and `docs/ROADMAP.md` R2.7.
 *
 * Port is overridable so the suite can run alongside something else already
 * on the default port, mirroring `apps/astro-landing/playwright.config.ts`.
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'node e2e/serve.mjs',
    url: `${BASE_URL}/e2e/fixtures/select-form.html`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) },
  },
});
