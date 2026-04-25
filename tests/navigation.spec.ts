import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { SweetsPage } from '../pages/SweetsPage';

test.describe('Navigation @P1', () => {
  test('TC-001: all nav links route to correct pages', async ({ page }) => {
    const nav = new BasePage(page);
    await page.goto('/');

    await nav.navSweets.click();
    await expect(page).toHaveURL('/sweets');

    await nav.navAbout.click();
    await expect(page).toHaveURL('/about');

    // navigate back to check login
    await page.goto('/');
    await nav.navLogin.click();
    await expect(page).toHaveURL('/login');

    await nav.navBasket.click();
    await expect(page).toHaveURL('/basket');
  });

  test('TC-002: logo click returns to homepage from any page @P2', async ({ page }) => {
    const nav = new BasePage(page);

    for (const path of ['/sweets', '/login', '/basket']) {
      await page.goto(path);
      await nav.navLogo.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('TC-003: basket counter updates when product is added @P1', async ({ page }) => {
    const sweets = new SweetsPage(page);
    await sweets.navigate();

    const before = await sweets.getBasketCount();
    expect(before).toBe(0);

    await sweets.addProductByIndex(0);

    // Wait for the basket counter to reflect the update (uses Playwright auto-retry)
    await expect(sweets.basketCounter).toContainText('1');
    const after = await sweets.getBasketCount();
    expect(after).toBe(1);
  });

  test('TC-004: basket counter persists across page navigation @P1', async ({ page }) => {
    test.slow(); // Netlify may be slow under parallel load — triple timeouts
    const sweets = new SweetsPage(page);
    await sweets.navigate();
    await sweets.addProductByIndex(0);
    await expect(sweets.basketCounter).toContainText('1');
    await sweets.addProductByIndex(1);
    await expect(sweets.basketCounter).toContainText('2');

    const nav = new BasePage(page);
    for (const path of ['/about', '/login', '/sweets']) {
      await page.goto(path);
      await expect(nav.basketCounter).toContainText('2');
    }
  });

  test('TC-005: About link on basket page navigates correctly @P2', async ({ page }) => {
    // Known defect: About link on /basket navigates to /bout instead of /about
    test.fail();
    await page.goto('/basket');
    const nav = new BasePage(page);
    await nav.navAbout.click();
    await expect(page).toHaveURL('/about');
  });
});
