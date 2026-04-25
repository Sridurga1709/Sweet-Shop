import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navSweets: Locator;
  readonly navAbout: Locator;
  readonly navLogin: Locator;
  readonly navBasket: Locator;
  readonly navLogo: Locator;
  readonly basketCounter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLogo = page.getByRole('link', { name: 'Sweet Shop' });
    this.navSweets = page.getByRole('link', { name: 'Sweets' }).first();
    this.navAbout = page.getByRole('link', { name: 'About' }).first();
    this.navLogin = page.getByRole('link', { name: 'Login' });
    this.navBasket = page.locator('a[href="/basket"]');
    this.basketCounter = page.locator('a[href="/basket"]');
  }

  async getBasketCount(): Promise<number> {
    const text = await this.basketCounter.innerText();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async goToHome(): Promise<void> {
    await this.navLogo.click();
    await this.page.waitForURL('/');
  }

  async goToSweets(): Promise<void> {
    await this.navSweets.click();
    await this.page.waitForURL('/sweets');
  }

  async goToAbout(): Promise<void> {
    await this.navAbout.click();
  }

  async goToLogin(): Promise<void> {
    await this.navLogin.click();
    await this.page.waitForURL('/login');
  }

  async goToBasket(): Promise<void> {
    await this.navBasket.click();
    await this.page.waitForURL('/basket');
  }

  async isLoginLinkVisible(): Promise<boolean> {
    return this.navLogin.isVisible();
  }

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(title, 'i'));
  }
}
