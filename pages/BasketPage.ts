import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasketPage extends BasePage {
  readonly basketHeading: Locator;
  readonly emptyBasketLink: Locator;

  // Delivery options
  readonly collectRadio: Locator;
  readonly standardShippingRadio: Locator;
  readonly orderTotal: Locator;

  // Promo code
  readonly promoCodeInput: Locator;
  readonly redeemButton: Locator;

  // Billing form — label-based selectors (Bootstrap for/id pattern)
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly citySelect: Locator;
  readonly zipInput: Locator;

  // Payment form
  readonly cardNameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expirationInput: Locator;
  readonly cvvInput: Locator;

  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.basketHeading = page.getByRole('heading', { name: /your basket/i }).first();
    this.emptyBasketLink = page.getByText(/empty basket/i);

    // Bootstrap custom-control radios — click the label, not the hidden input
    this.collectRadio = page.locator('label').filter({ hasText: 'Collect (FREE)' });
    this.standardShippingRadio = page.locator('label').filter({ hasText: 'Standard Shipping (£1.99)' });

    // Total is displayed in a <strong> element
    this.orderTotal = page.locator('strong').filter({ hasText: '£' }).first();

    this.promoCodeInput = page.getByPlaceholder('Promo code');
    this.redeemButton = page.getByRole('button', { name: /redeem/i });

    // Billing — use id selectors; first/last name both have id="name" (HTML bug)
    this.firstNameInput = page.locator('input#name').first();
    this.lastNameInput = page.locator('input#name').last();
    this.emailInput = page.locator('#email');
    this.addressInput = page.locator('#address');
    this.countrySelect = page.locator('#country');
    this.citySelect = page.locator('#city');
    this.zipInput = page.locator('#zip');

    // Payment — id selectors (CVV label for attr is wrong in HTML, use id directly)
    this.cardNameInput = page.locator('#cc-name');
    this.cardNumberInput = page.locator('#cc-number');
    this.expirationInput = page.locator('#cc-expiration');
    this.cvvInput = page.locator('#cc-cvv');

    this.checkoutButton = page.getByRole('button', { name: /continue to checkout/i });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/basket');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectCollect(): Promise<void> {
    await this.collectRadio.click();
  }

  async selectStandardShipping(): Promise<void> {
    await this.standardShippingRadio.click();
  }

  async getOrderTotalText(): Promise<string> {
    return (await this.orderTotal.innerText()).trim();
  }

  async getOrderTotalValue(): Promise<number> {
    const text = await this.getOrderTotalText();
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.promoCodeInput.fill(code);
    await this.redeemButton.click();
  }

  async clickEmptyBasket(): Promise<void> {
    await this.emptyBasketLink.click();
  }

  async fillBillingForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.citySelect.selectOption(data.city);
    await this.zipInput.fill(data.zip);
  }

  async fillPaymentForm(data: {
    cardName: string;
    cardNumber: string;
    expiration: string;
    cvv: string;
  }): Promise<void> {
    await this.cardNameInput.fill(data.cardName);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expirationInput.fill(data.expiration);
    await this.cvvInput.fill(data.cvv);
  }

  async fillFullCheckoutForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    cardName: string;
    cardNumber: string;
    expiration: string;
    cvv: string;
  }): Promise<void> {
    await this.fillBillingForm(data);
    await this.fillPaymentForm(data);
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectItemInBasket(productName: string): Promise<void> {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async isFieldInvalid(input: Locator): Promise<boolean> {
    return input.evaluate((el: HTMLInputElement) => !el.validity.valid);
  }
}
