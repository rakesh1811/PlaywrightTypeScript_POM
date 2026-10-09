import { test as base } from '@playwright/test';
import { SauceLoginPage } from '../pages/SauceLoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

/**
 * Fixtures: create page objects automatically for every test.
 * In a test just write:  async ({ loginPage, productsPage, cartPage }) => { ... }
 */
type PageObjects = {
  loginPage: SauceLoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<PageObjects>({
  loginPage:            async ({ page }, use) => { await use(new SauceLoginPage(page)); },
  productsPage:         async ({ page }, use) => { await use(new ProductsPage(page)); },
  cartPage:             async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutInfoPage:     async ({ page }, use) => { await use(new CheckoutInfoPage(page)); },
  checkoutOverviewPage: async ({ page }, use) => { await use(new CheckoutOverviewPage(page)); },
  checkoutCompletePage: async ({ page }, use) => { await use(new CheckoutCompletePage(page)); },
});

export { expect } from '@playwright/test';
