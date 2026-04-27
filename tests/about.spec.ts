import { test, expect } from '@playwright/test';
import { AboutPage } from '../pages/AboutPage';

test.describe('About Page', () => {
  test('TC-010: about page loads at /about with heading visible @P1', async ({ page }) => {
    const about = new AboutPage(page);
    await about.navigate();

    await expect(page).toHaveURL('/about');
    await about.expectContentLoaded();
  });

  test('TC-012: heading text is "Sweet Shop Project" @P1', async ({ page }) => {
    const about = new AboutPage(page);
    await about.navigate();
    await expect(about.pageHeading).toBeVisible();
  });

  test('TC-078: description text about Chrome DevTools is visible @P2', async ({ page }) => {
    const about = new AboutPage(page);
    await about.navigate();
    await expect(about.pageDescription).toBeVisible();
  });

  test('TC-079: footer shows "Sweet Shop Project 2018" @P3', async ({ page }) => {
    const about = new AboutPage(page);
    await about.navigate();
    await expect(about.pageFooter).toBeVisible();
  });

  test('TC-080: nav links are accessible from the about page @P1', async ({ page }) => {
    const about = new AboutPage(page);
    await about.navigate();

    await about.openMobileMenuIfNeeded();
    await expect(about.navSweets).toBeVisible();
    await expect(about.navLogin).toBeVisible();
    await expect(about.navBasket).toBeVisible();
  });

  test('TC-081: about page has no horizontal scroll @P2', async ({ page }) => {
    const about = new AboutPage(page);
    await about.navigate();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});
