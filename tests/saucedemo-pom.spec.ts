import { test, expect } from '../fixtures/pageFixtures';
import { randomCustomer } from '../utils/testData';

test.describe('SauceDemo Application', () => {

  test('end-to-end: login, add "Sauce Labs Bike Light" to cart and place the order', async ({
    loginPage, productsPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage, page,
  }, testInfo) => {
    const productToBuy = 'Sauce Labs Bike Light';

    await test.step('1. Launch browser and open saucedemo', async () => {
      await loginPage.goto();
      await expect(page).toHaveTitle('Swag Labs');
    });

    // values are read from the page, not hard-coded
    const username = await test.step('2. Read username from the page', async () => {
      const allUsers = await loginPage.getAllUsernamesFromPage();
      console.log('Usernames on page:', allUsers);
      return loginPage.getUsernameFromPage(0);          // standard_user
    });

    const password = await test.step('3. Read password from the page', async () => {
      return loginPage.getPasswordFromPage();           // secret_sauce
    });
    console.log(`Logging in with -> ${username} / ${password}`);

    await test.step('4. Enter credentials and click Login', async () => {
      await loginPage.login(username, password);
    });

    await test.step('5. Verify Products page is shown', async () => {
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(productsPage.pageTitle).toHaveText('Products');
    });

    await test.step('6. Read all product names', async () => {
      // get the list of product names from the page
      const allProducts = await productsPage.getAllProductNames();

      // print how many products there are
      console.log('Total products: ' + allProducts.length);

      // print each product name with a number
      for (let i = 0; i < allProducts.length; i++) {
        const number = i + 1;                 // list starts at 0, but we want to show 1, 2, 3...
        const name = allProducts[i];          // product at position i
        console.log(number + '. ' + name);
      }
    });

    const added = await test.step(`7. If "${productToBuy}" is available, add it to cart`, async () => {
      const available = await productsPage.isProductAvailable(productToBuy);

      if (available) {
        console.log(`"${productToBuy}" is available -> clicking Add to cart`);
        await productsPage.addToCart(productToBuy);

        // check it really went into the cart
        await expect(productsPage.removeButton(productToBuy)).toBeVisible();  // button changed to "Remove"
        await expect(productsPage.cartBadge).toHaveText('1');                 // cart icon shows 1
        console.log(`"${productToBuy}" added to cart successfully`);
        return true;
      } else {
        console.log('Product not available');
        return false;
      }
    });

    if (!added) return;   // nothing in the cart -> stop here

    await test.step('8. Click basket link -> Your Cart', async () => {
      await productsPage.openCart();
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
      console.log('Items in cart:', await cartPage.getCartItemNames());
      await expect(cartPage.cartItemNames).toHaveText([productToBuy]);
    });

    await test.step('9. Click Checkout -> Checkout: Your Information', async () => {
      await cartPage.clickCheckout();
      await expect(checkoutInfoPage.pageTitle).toHaveText('Checkout: Your Information');
    });

    await test.step('10. Enter random First name, Last name, 6-digit Zip and Continue', async () => {
      const customer = randomCustomer();
      console.log(`Customer -> ${customer.firstName} ${customer.lastName}, Zip: ${customer.zip}`);
      await checkoutInfoPage.fillDetails(customer.firstName, customer.lastName, customer.zip);
      await checkoutInfoPage.clickContinue();
    });

    await test.step('11. Checkout: Overview -> print payment, shipping, price and click Finish', async () => {
      await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');
      const summary = await checkoutOverviewPage.getOrderSummary();
      console.log('----- Order Summary -----');
      console.log(`Payment Information : ${summary.payment}`);
      console.log(`Shipping Information: ${summary.shipping}`);
      console.log(`${summary.itemTotal}`);
      console.log(`${summary.tax}`);
      console.log(`${summary.total}`);
      console.log('-------------------------');
      await checkoutOverviewPage.clickFinish();
    });

    await test.step('12. Thank you screen -> screenshot and print message', async () => {
      await expect(checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!');
      await expect(checkoutCompletePage.thankYouHeader).toBeVisible();

      const path = await checkoutCompletePage.takeScreenshot('thank-you.png');
      await testInfo.attach('Thank you screen', { path, contentType: 'image/png' });   // also shown in HTML report
      console.log(`Screenshot saved: ${path}`);

      const header = await checkoutCompletePage.getText(checkoutCompletePage.thankYouHeader);
      const text = await checkoutCompletePage.getText(checkoutCompletePage.thankYouText);
      console.log(`Message: ${header}`);
      console.log(`         ${text}`);
      await expect(checkoutCompletePage.thankYouHeader).toHaveText('Thank you for your order!');
    });
  });
  /*
    test('product that does not exist prints "Product not available"', async ({ loginPage, productsPage }) => {
      const productToBuy = 'Sauce Labs Flying Car';   // not on the site
      await loginPage.goto();
      await loginPage.login(await loginPage.getUsernameFromPage(0), await loginPage.getPasswordFromPage());
  
      if (await productsPage.isProductAvailable(productToBuy)) {
        await productsPage.addToCart(productToBuy);
      } else {
        console.log('Product not available');
      }
      await expect(productsPage.cartBadge).toHaveCount(0);   // nothing was added
    });
  
    test('locked_out_user (read from page) gets an error', async ({ loginPage }) => {
      await loginPage.goto();
      const username = await loginPage.getUsernameFromPage(1);   // locked_out_user
      const password = await loginPage.getPasswordFromPage();
      await loginPage.login(username, password);
      await expect(loginPage.errorMessage).toContainText('locked out');
    });*/
});
