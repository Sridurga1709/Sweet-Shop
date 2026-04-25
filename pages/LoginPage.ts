import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#exampleInputEmail');
    this.passwordInput = page.locator('#exampleInputPassword');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.alert, .error, [class*="invalid"], .text-danger').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.loginButton.click();
  }

  async loginWithPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.loginButton.click();
  }

  async expectEmailValidationError(): Promise<void> {
    const emailEl = this.emailInput;
    const validity = await emailEl.evaluate((el: HTMLInputElement) => ({
      valueMissing: el.validity.valueMissing,
      typeMismatch: el.validity.typeMismatch,
    }));
    expect(validity.valueMissing || validity.typeMismatch).toBe(true);
  }

  async expectPasswordValidationError(): Promise<void> {
    const validity = await this.passwordInput.evaluate((el: HTMLInputElement) => ({
      valueMissing: el.validity.valueMissing,
    }));
    expect(validity.valueMissing).toBe(true);
  }

  async expectFieldInvalid(locator: Locator): Promise<void> {
    await expect(locator).toHaveAttribute('required', '');
    const isInvalid = await locator.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
