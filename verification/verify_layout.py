from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        print("Navigating to http://localhost:4200")
        page.goto("http://localhost:4200")

        # Wait for the app container to be visible
        page.wait_for_selector(".app-container")

        # Check if attribute exists
        element = page.locator(".app-container")
        attr = element.get_attribute("and-layout")
        print(f"app-container and-layout attribute: {attr}")

        if "vertical" not in attr:
             print("ERROR: and-layout='vertical' not found on app-container")

        # Check computed style for app-container (should be flex column)
        # and-layout="vertical" sets display:flex and flex-direction:column
        display = element.evaluate("el => window.getComputedStyle(el).display")
        flex_direction = element.evaluate("el => window.getComputedStyle(el).flexDirection")

        print(f"Computed display: {display}")
        print(f"Computed flex-direction: {flex_direction}")

        # Check content-area for padding
        content_area = page.locator(".content-area")
        content_attr = content_area.get_attribute("and-layout")
        print(f"content-area and-layout attribute: {content_attr}")

        # p:xl corresponds to 2rem (32px) usually, let's check computed padding
        padding = content_area.evaluate("el => window.getComputedStyle(el).padding")
        print(f"Computed padding: {padding}")

        page.screenshot(path="verification/layout.png")
        print("Screenshot saved to verification/layout.png")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
