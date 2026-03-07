import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:6006/iframe.html?id=components-accordion--default&viewMode=story', { waitUntil: 'networkidle0' });

  const results = await page.evaluate(() => {
    let hasHiddenClass = false;
    let hasThemeVars = false;

    // Check all stylesheets for .hidden and --primary variables
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule.selectorText === '.hidden') hasHiddenClass = true;
          if (rule.selectorText === ':root' || rule.selectorText?.includes('.dark')) {
            if (rule.style?.getPropertyValue('--primary')) {
              hasThemeVars = true;
            }
          }
        }
      } catch (e) {
        // CORS error on external stylesheets
      }
    }

    const iconElement = document
      .querySelector('and-accordion')
      ?.querySelector('and-accordion-item')
      ?.shadowRoot?.querySelector('and-accordion-trigger')
      ?.shadowRoot?.querySelector('and-icon');

    const bodyStyles = window.getComputedStyle(document.body);

    return {
      hasHiddenClass,
      hasThemeVars,
      iconIsRegistered: customElements.get('and-icon') !== undefined,
      iconTagNamePresent: !!iconElement,
      bodyFont: bodyStyles.fontFamily,
      bodyBg: bodyStyles.backgroundColor,
    };
  });

  console.log('RESULTS:', results);
  await browser.close();
})();
