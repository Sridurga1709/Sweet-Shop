import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly browseButton: Locator;
  readonly welcomeHeading: Locator;
  readonly featuredProducts: Locator;
  readonly saleBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.browseButton = page.getByRole('link', { name: 'Browse Sweets' });
    this.welcomeHeading = page.getByText('Welcome to the sweet shop!');
    this.featuredProducts = page.locator('.card');
    this.saleBanner = page.locator('img[src*="sale"], img[src*="banner"], .jumbotron img').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async clickBrowseSweets(): Promise<void> {
    await this.browseButton.click();
    await this.page.waitForURL('/sweets');
  }

  async getFeaturedProductCount(): Promise<number> {
    return this.featuredProducts.count();
  }

  async addFeaturedProductToBasket(index = 0): Promise<string> {
    const card = this.featuredProducts.nth(index);
    const name = await card.locator('h4').innerText();
    await card.getByText('Add to Basket').click();
    return name;
  }

  async expectHeadingVisible(): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
  }

  async expectFeaturedProductsLoaded(count = 4): Promise<void> {
    await expect(this.featuredProducts).toHaveCount(count);
  }
}
