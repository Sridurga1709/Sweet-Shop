import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SweetsPage extends BasePage {
  readonly productCards: Locator;
  readonly addToBasketButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.card');
    this.addToBasketButtons = page.getByRole('button', { name: 'Add to Basket' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/sweets');
    await this.page.waitForLoadState('networkidle');
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async addProductByName(name: string): Promise<void> {
    const card = this.productCards.filter({ hasText: name });
    await card.getByText('Add to Basket').click();
  }

  async addProductByIndex(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    const name = await card.locator('h4').innerText();
    await card.getByText('Add to Basket').click();
    return name;
  }

  async addMultipleProducts(count: number): Promise<string[]> {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await this.addProductByIndex(i);
      names.push(name);
    }
    return names;
  }

  async getProductPrice(name: string): Promise<string> {
    const card = this.productCards.filter({ hasText: name });
    const priceText = await card.locator('p').last().innerText();
    return priceText.trim();
  }

  async expectProductCount(count: number): Promise<void> {
    await expect(this.productCards).toHaveCount(count);
  }

  async expectProductVisible(name: string): Promise<void> {
    await expect(this.productCards.filter({ hasText: name })).toBeVisible();
  }

  async expectAllProductsHaveButton(): Promise<void> {
    const count = await this.productCards.count();
    for (let i = 0; i < count; i++) {
      await expect(
        this.productCards.nth(i).getByText('Add to Basket')
      ).toBeVisible();
    }
  }
}
