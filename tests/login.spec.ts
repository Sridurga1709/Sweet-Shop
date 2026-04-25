import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';
import { USERS } from '../test-data/users';

test.describe('Login Page', () => {
  test('TC-016: successful login with valid credentials @P1', async ({ page }) => {
    // Known defect: app redirects to UUID page for any credentials — session is never created
    test.fail();
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(USERS.oneOrder.email, USERS.oneOrder.password);
    await expect(login.navLogin).not.toBeVisible({ timeout: 5000 });
  });

  test('TC-017: after login, Login nav link is hidden @P1', async ({ page }) => {
    // Known defect: login does not create a session — Login link remains visible everywhere
    test.fail();
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(USERS.oneOrder.email, USERS.oneOrder.password);

    const nav = new BasePage(page);
    for (const path of ['/sweets', '/about', '/basket']) {
      await page.goto(path);
      const loginVisible = await nav.isLoginLinkVisible();
      expect(loginVisible).toBe(false);
    }
  });

  test('TC-018: login state persists across page navigation @P1', async ({ page }) => {
    // Known defect: login does not create a session — no auth state to persist
    test.fail();
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(USERS.oneOrder.email, USERS.oneOrder.password);

    const nav = new BasePage(page);
    for (const path of ['/sweets', '/about', '/login', '/basket']) {
      await page.goto(path);
      expect(await nav.isLoginLinkVisible()).toBe(false);
    }
  });

  test('TC-019: login state persists after page refresh @P1', async ({ page }) => {
    // Known defect: login does not create a session — refresh always shows logged-out state
    test.fail();
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(USERS.oneOrder.email, USERS.oneOrder.password);

    await page.goto('/sweets');
    await page.reload();

    const nav = new BasePage(page);
    expect(await nav.isLoginLinkVisible()).toBe(false);
  });

  test('TC-020: correct order count per account @P2', async ({ page }) => {
    // Known defect: all credentials redirect to the same UUID page — per-user order counts unverifiable
    test.fail();
    const accounts = [USERS.oneOrder, USERS.twoOrders, USERS.fiveOrders];
    for (const user of accounts) {
      const login = new LoginPage(page);
      await login.navigate();
      await login.login(user.email, user.password);

      const orderRows = page.locator('.order-row, .order-item');
      const visibleCount = await orderRows.count();
      expect(visibleCount).toBe(user.expectedOrders);

      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
    }
  });

  test('TC-021: wrong password shows error @P1', async ({ page }) => {
    // Known defect: app accepts any credentials — wrong password still redirects to UUID page
    test.fail();
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(USERS.invalidPassword.email!, USERS.invalidPassword.password!);

    await expect(page).toHaveURL('/login');
    await expect(login.navLogin).toBeVisible();
  });

  test('TC-022: empty fields show HTML5 validation @P1', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    // Verify email validity state directly (client-side, no network dependency)
    const emailInvalid = await login.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(emailInvalid).toBe(true);

    await login.submitEmpty();
    // Email input should still be on screen (form did not successfully navigate)
    await expect(login.emailInput).toBeVisible();
  });

  test('TC-023: badly formatted email shows validation error @P2', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.emailInput.fill('notanemail');
    await login.passwordInput.fill('qwerty');

    // Check type mismatch before clicking — avoids accessing element after navigation
    const isInvalid = await login.emailInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
    expect(isInvalid).toBe(true);

    await login.loginButton.click();
    // Email input should still be on screen (HTML5 validation blocked form submit)
    await expect(login.emailInput).toBeVisible();
  });

  test('TC-024: login with only password shows email error @P2', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.passwordInput.fill('qwerty');
    await login.loginButton.click();

    await login.expectEmailValidationError();
  });

  test('TC-025: login with only email shows password error @P2', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.emailInput.fill(USERS.oneOrder.email);
    await login.loginButton.click();

    await login.expectPasswordValidationError();
  });

  test('TC-026: social media icons are present on login page @P3', async ({ page }) => {
    await page.goto('/login');
    // Social icons use img alt attributes; known defect: all link to '#' instead of real URLs
    await expect(page.locator('a:has(img[alt="twitter"])')).toBeVisible();
    await expect(page.locator('a:has(img[alt="facebook"])')).toBeVisible();
    await expect(page.locator('a:has(img[alt="linkedin"])')).toBeVisible();
  });
});
