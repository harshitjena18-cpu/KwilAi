from playwright.sync_api import sync_playwright
import time

def test_kwil_chip():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("file:///home/jules/verification/test.html")

        # Wait for simulated focus class to be added
        time.sleep(1)

        # Take screenshot
        page.screenshot(path="/home/jules/verification/verification.png")
        browser.close()

if __name__ == "__main__":
    test_kwil_chip()
