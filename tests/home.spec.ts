import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BasketPage } from '../pages/BasketPage';

test.describe('Home Page', () => {
  test('TC-006: homepage loads with all key elements @P2', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();

    await expect(page).toHaveURL('/');
    await home.expectHeadingVisible();
    await expect(home.browseButton).toBeVisible();
    await expect(home.navSweets).toBeVisible();
    await expect(home.navBasket).toBeVisible();
  });

  test('TC-007: Browse Sweets button navigates to sweets page @P2', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();
    await home.clickBrowseSweets();
    await expect(page).toHaveURL('/sweets');
  });

  test('TC-008: Add to Basket from homepage featured product @P1', async ({ page }) => {
    test.slow(); // basket page render can be slow under parallel Netlify load
    const home = new HomePage(page);
    await home.navigate();

    const productName = await home.addFeaturedProductToBasket(0);
    // Wait for counter to confirm JS has updated localStorage before navigating
    await expect(home.basketCounter).toContainText('1');

    // Verify item appears in basket
    const basket = new BasketPage(page);
    await basket.navigate();
    await basket.expectItemInBasket(productName);

    // Counter should have incremented
    await page.goto('/');
    const count = await home.getBasketCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-009: featured products display correct information @P2', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();

    const count = await home.getFeaturedProductCount();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      const card = home.featuredProducts.nth(i);
      await expect(card.locator('h4')).toBeVisible();
      await expect(card.getByText('Add to Basket')).toBeVisible();
      // Price is anywhere inside the card — find any £ amount
      const cardText = await card.innerText();
      expect(cardText).toMatch(/£[\d.]+/);
    }
  });
});
