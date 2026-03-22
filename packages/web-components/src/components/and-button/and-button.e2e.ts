import { newE2EPage } from '@stencil/core/testing';

describe('and-button e2e', () => {
  it('renders and clicks successfully', async () => {
    const page = await newE2EPage();
    await page.setContent('<and-button>E2E Test</and-button>');

    const element = await page.find('and-button');
    expect(element).toHaveClass('hydrated');

    const button = await page.find('and-button >>> button');
    expect(button).not.toBeNull();

    // Verify default rendering properties
    expect(button.textContent).toContain('E2E Test');
  });

  it('renders as anchor when href is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<and-button href="https://example.com">Link</and-button>');

    const anchor = await page.find('and-button >>> a');
    expect(anchor).not.toBeNull();
    
    // Check that button doesn't exist
    const button = await page.find('and-button >>> button');
    expect(button).toBeNull();
  });
});
