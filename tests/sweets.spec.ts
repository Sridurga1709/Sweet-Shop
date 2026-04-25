import { test, expect } from '@playwright/test';
import { SweetsPage } from '../pages/SweetsPage';
import { BasketPage } from '../pages/BasketPage';
import { PRODUCTS, TOTAL_PRODUCT_COUNT } from '../test-data/products';

test.describe('Sweets Page', () => {
  test('TC-011: all 16 products are displayed @P1', async ({ page }) => {
    const sweets = new SweetsPage(page);
    await sweets.navigate();
    await sweets.expectProductCount(TOTAL_PRODUCT_COUNT);
  });

  test('TC-011b: every product card has name, price, and Add to Basket button @P1', async ({ page }) => {
    const sweets = new SweetsPage(page);
    await sweets.navigate();
    await sweets.expectAllProductsHaveButton();

    const count = await sweets.getProductCount();
    for (let i = 0; i < count; i++) {
      const card = sweets.productCards.nth(i);
      await expect(card.locator('h4')).toBeVisible();
      const texts = await card.locator('p').allInnerTexts();
      const hasPrice = texts.some(t => /£[\d.]+/.test(t));
      expect(hasPrice).toBe(true);
    }
  });

  test('TC-013: adding Sherbert Straws updates basket correctly @P1', async ({ page }) => {
    test.slow(); // basket page render can be slow under parallel Netlify load
    const sweets = new SweetsPage(page);
    await sweets.navigate();
    await sweets.addProductByName(PRODUCTS.sherbertStraws.name);
    // Wait for counter to confirm JS has updated localStorage before navigating
    await expect(sweets.basketCounter).toContainText('1');

    const basket = new BasketPage(page);
    await basket.navigate();
    await basket.expectItemInBasket(PRODUCTS.sherbertStraws.name);
  });

  test('TC-014: adding multiple different products accumulates correctly @P1', async ({ page }) => {
    test.slow(); // basket page render can be slow under parallel Netlify load
    const sweets = new SweetsPage(page);
    await sweets.navigate();
    await sweets.addProductByName(PRODUCTS.chocolateCups.name);
    await sweets.addProductByName(PRODUCTS.bonBons.name);
    // Wait for counter to confirm both items are in localStorage before navigating
    await expect(sweets.basketCounter).toContainText('2');

    const basket = new BasketPage(page);
    await basket.navigate();
    await basket.expectItemInBasket(PRODUCTS.chocolateCups.name);
    await basket.expectItemInBasket(PRODUCTS.bonBons.name);
  });

  test('TC-015: basket counter increments with multiple additions @P1', async ({ page }) => {
    test.slow(); // Netlify may be slow under parallel load — triple timeouts
    const sweets = new SweetsPage(page);
    await sweets.navigate();

    // Add 3 distinct products and check counter
    await sweets.addProductByIndex(0);
    await sweets.addProductByIndex(1);
    await sweets.addProductByIndex(2);
    await expect(sweets.basketCounter).toContainText('3');
    const countAfter3 = await sweets.getBasketCount();
    expect(countAfter3).toBe(3);

    // Add 2 more distinct products and check counter reaches 5
    await sweets.addProductByIndex(3);
    await sweets.addProductByIndex(4);
    await expect(sweets.basketCounter).toContainText('5');
    const countAfter5 = await sweets.getBasketCount();
    expect(countAfter5).toBe(5);
  });
});
