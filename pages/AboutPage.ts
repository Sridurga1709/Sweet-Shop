import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AboutPage extends BasePage {
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;
  readonly pageFooter: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Sweet Shop Project' });
    this.pageDescription = page.getByText(/intentionally broken web application/i);
    this.pageFooter = page.getByText(/Sweet Shop Project 2018/i);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/about');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectContentLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }
}
