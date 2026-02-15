from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Fade Demo
        print("Navigating to /motion/fade...")
        page.goto("http://localhost:4200/motion/fade")
        page.wait_for_selector("h1:has-text('Fade Animations')")
        page.screenshot(path="verification/fade_demo.png")
        print("Screenshot saved to verification/fade_demo.png")

        # Verify Scale Demo
        print("Navigating to /motion/scale...")
        page.goto("http://localhost:4200/motion/scale")
        page.wait_for_selector("h1:has-text('Scale & Rotate')")
        page.screenshot(path="verification/scale_demo.png")
        print("Screenshot saved to verification/scale_demo.png")

        browser.close()

if __name__ == "__main__":
    run()
