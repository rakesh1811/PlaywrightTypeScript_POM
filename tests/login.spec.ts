import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Public demo site with published practice users (standard_user / secret_sauce)
test.describe('SauceDemo login', () => {
  test('valid user can log in', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('locked user sees an error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('locked_out_user', 'secret_sauce');
    await login.expectError('locked out');
  });
});
