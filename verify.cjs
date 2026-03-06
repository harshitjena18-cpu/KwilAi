const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to our local file
  await page.goto('file://' + process.cwd() + '/test.html');

  // Find the interactive chip
  const interactiveChip = page.locator('#interactive [role="button"]');

  // Wait for it to be visible
  await interactiveChip.waitFor();

  // Focus it via keyboard
  await page.keyboard.press('Tab');

  // Take screenshot with focus
  await page.screenshot({ path: '/home/jules/verification/verification.png' });

  // Now test the remove button focus
  await page.keyboard.press('Tab');

  await page.screenshot({ path: '/home/jules/verification/verification-remove-focus.png' });

  await browser.close();
})();
