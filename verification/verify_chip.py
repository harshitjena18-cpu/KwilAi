from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to search page...")
            page.goto("http://localhost:5173/app/search")

            print("Waiting for 'Vegan' chip...")
            page.wait_for_selector("text=Vegan", timeout=10000)

            # Use exact match for name to distinguish "Vegan" from "Vegan dinner"
            vegan_chip = page.get_by_role("button", name="Vegan", exact=True)

            if vegan_chip.count() == 0:
                print("Error: Vegan chip not found as a button! Trying without exact match...")
                # Try finding it and seeing what it is
                all_vegan_buttons = page.get_by_role("button", name="Vegan").all()
                for i, btn in enumerate(all_vegan_buttons):
                    print(f"Button {i}: text='{btn.inner_text()}' aria-pressed='{btn.get_attribute('aria-pressed')}'")
            else:
                print("Success: found 'Vegan' chip button.")

                # Verify aria-pressed is initially false
                is_pressed = vegan_chip.get_attribute("aria-pressed")
                print(f"Initial aria-pressed: {is_pressed}")

                if is_pressed != "false":
                     print("WARNING: Expected aria-pressed to be 'false'")

                # Click it
                print("Clicking 'Vegan' chip...")
                vegan_chip.click()

                # Wait for update (React re-render)
                page.wait_for_timeout(1000)

                # Verify aria-pressed is now true
                is_pressed_after = vegan_chip.get_attribute("aria-pressed")
                print(f"Post-click aria-pressed: {is_pressed_after}")

                if is_pressed_after != "true":
                     print("WARNING: Expected aria-pressed to be 'true'")

            # Take screenshot of the filters area
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
