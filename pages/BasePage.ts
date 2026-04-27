import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navSweets: Locator;
  readonly navAbout: Locator;
  readonly navLogin: Locator;
  readonly navBasket: Locator;
  readonly navLogo: Locator;
  readonly basketCounter: Locator;
  readonly hamburgerToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLogo = page.getByRole('link', { name: 'Sweet Shop' });
    this.navSweets = page.getByRole('link', { name: 'Sweets' }).first();
    this.navAbout = page.getByRole('link', { name: 'About' }).first();
    this.navLogin = page.getByRole('link', { name: 'Login' });
    this.navBasket = page.locator('a[href="/basket"]');
    this.basketCounter = page.locator('a[href="/basket"]');
    this.hamburgerToggle = page.locator('.navbar-toggler');
  }

  async openMobileMenuIfNeeded(): Promise<void> {
    // Use getComputedStyle so CSS media queries are respected (avoids false positives on desktop)
    const hamburgerRendered = await this.hamburgerToggle.evaluate((el: Element) =>
      window.getComputedStyle(el).display !== 'none'
    ).catch(() => false);

    if (!hamburgerRendered) return;

    // Ensure Bootstrap JS is initialised before interacting with the collapse
    await this.page.waitForLoadState('domcontentloaded');
    const menu = this.page.locator('.navbar-collapse');
    const classes = await menu.getAttribute('class') ?? '';
    if (!classes.includes('show')) {
      await this.hamburgerToggle.click();
      await expect(menu).toHaveClass(/show/, { timeout: 10000 });
    }
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
    await this.openMobileMenuIfNeeded();
    return this.navLogin.isVisible();
  }

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(title, 'i'));
  }
}
