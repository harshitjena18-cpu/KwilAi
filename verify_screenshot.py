import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Waiting for server...")
        try:
            for i in range(30):
                try:
                    page.goto("http://localhost:5173/app/search", timeout=2000)
                    break
                except Exception:
                    time.sleep(1)
            else:
                print("Server failed to start")
                return

            # Wait for content
            page.wait_for_selector("text=Search", timeout=5000)

            # Take screenshot of Search Page (showing chips)
            page.screenshot(path="search_page.png")
            print("Screenshot saved: search_page.png")

            # Go to Profile Page
            page.goto("http://localhost:5173/app/profile")
            # Wait for content (switches)
            page.wait_for_selector("text=Profile", timeout=5000)
            # Give it a moment to render switches
            time.sleep(1)

            # Take screenshot of Profile Page (showing switches)
            page.screenshot(path="profile_page.png")
            print("Screenshot saved: profile_page.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
