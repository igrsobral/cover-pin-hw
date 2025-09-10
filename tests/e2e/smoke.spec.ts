import { test, expect } from '../setup';

test.describe('Smoke Tests', () => {
  test('should load the application', async ({ page }) => {
    // given
    await page.goto('/');

    // when
    await page.waitForLoadState('networkidle');

    // then
    await expect(page).toHaveTitle(/Mini Seller Console|Vite \+ React/);
  });

  test('should have basic navigation elements', async ({ page }) => {
    // given
    await page.goto('/');

    // when
    await page.waitForLoadState('networkidle');

    // then
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
