import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AboutPage extends BasePage {
  readonly promoBanner: Locator;
  readonly pageContent: Locator;

  constructor(page: Page) {
    super(page);
    this.promoBanner = page.getByText(/20% off/i);
    this.pageContent = page.locator('main, .container').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto('/about');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectPromoBannerVisible(): Promise<void> {
    await expect(this.promoBanner).toBeVisible();
  }

  async expectContentLoaded(): Promise<void> {
    await expect(this.pageContent).toBeVisible();
  }
}
