import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { SweetsPage } from '../pages/SweetsPage';

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe('Responsive Design', () => {
  test('TC-066: navbar collapses on mobile @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Hamburger toggle should be visible on mobile
    const hamburger = page.locator('.navbar-toggler, [data-toggle="collapse"], button.navbar-toggler');
    await expect(hamburger).toBeVisible();

    // Nav links should be hidden (collapsed) initially
    const navLinks = page.locator('.navbar-collapse');
    const isExpanded = await navLinks.getAttribute('class');
    expect(isExpanded).not.toContain('show');
  });

  test('TC-067: hamburger menu opens and closes correctly @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    // Wait for Bootstrap CDN scripts to fully initialise before interacting
    await page.waitForLoadState('networkidle');

    const hamburger = page.locator('.navbar-toggler');
    await hamburger.click();

    const menu = page.locator('.navbar-collapse');
    await expect(menu).toHaveClass(/show/);

    // Links inside are now visible (use first() — appears in nav and possibly footer)
    await expect(page.getByRole('link', { name: 'Sweets' }).first()).toBeVisible();

    // Close menu — allow extra time under parallel load for Bootstrap animation
    await hamburger.click();
    await expect(menu).not.toHaveClass(/show/, { timeout: 8000 });
  });

  test('TC-068: product cards stack on mobile @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/sweets');
    await page.waitForLoadState('domcontentloaded');

    // No horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
  });

  test('TC-069: basket form is usable on mobile @P1', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/basket');
    await page.waitForLoadState('domcontentloaded');

    // Scroll the billing form into view and check it's interactable
    const firstNameInput = page.locator('input#name').first();
    await firstNameInput.scrollIntoViewIfNeeded();
    await expect(firstNameInput).toBeVisible();

    const inputBox = await firstNameInput.boundingBox();
    expect(inputBox).not.toBeNull();
    expect(inputBox!.width).toBeGreaterThan(100);
  });

  test('TC-070: no horizontal scroll on any page at mobile viewport @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);

    for (const path of ['/', '/sweets', '/about', '/login', '/basket']) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    }
  });

  test('TC-072: layout renders correctly on tablet @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/sweets');
    await page.waitForLoadState('domcontentloaded');

    // Products should be visible
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test('TC-073: layout renders correctly on desktop @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);

    for (const path of ['/', '/sweets', '/about', '/login', '/basket']) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const nav = new BasePage(page);
      await expect(nav.navSweets).toBeVisible();
      await expect(nav.navBasket).toBeVisible();
    }
  });

  test('TC-076: basket counter is visible at all breakpoints @P2', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/sweets');
    const sweets = new SweetsPage(page);
    await sweets.addProductByIndex(0);

    for (const [breakpoint, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // SweetShop uses navbar-expand-lg so hamburger appears on mobile AND tablet
      const hamburger = page.locator('.navbar-toggler');
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await expect(page.locator('.navbar-collapse')).toHaveClass(/show/);
        await expect(page.locator('.navbar-collapse a[href="/basket"]')).toBeVisible();
      } else {
        await expect(page.locator('a[href="/basket"]')).toBeVisible();
      }
    }
  });

  test('TC-077: nav links accessible at all breakpoints @P1', async ({ page }) => {
    for (const [breakpoint, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Open hamburger if visible — SweetShop collapses nav on mobile AND tablet
      const hamburger = page.locator('.navbar-toggler');
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await expect(page.locator('.navbar-collapse')).toHaveClass(/show/);
      }

      await expect(page.getByRole('link', { name: 'Sweets' }).first()).toBeVisible();
    }
  });
});
