import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Page shown after a successful login (inventory / Products) */
export class ProductsPage extends BasePage {
  // ----- Locators (XPath) -----
  readonly pageTitle: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle    = this.xpath("//span[@class='title']");
    this.productItems = this.xpath("//div[@class='inventory_item']");
    // note: on saucedemo the class is "inventory_item_name " (with a space), so we use contains()
    this.productNames = this.xpath("//div[contains(@class,'inventory_item_name')]");
    this.cartBadge    = this.xpath("//span[@class='shopping_cart_badge']");
    this.cartLink     = this.xpath("//a[@class='shopping_cart_link']");   // basket icon (top right)
  }

  /** "Add to cart" button of ONE product, found by product name */
  addToCartButton(productName: string): Locator {
    return this.xpath(
      `//div[contains(@class,'inventory_item_name') and normalize-space()='${productName}']` +
      `/ancestor::div[@class='inventory_item']//button[text()='Add to cart']`
    );
  }

  /** "Remove" button of ONE product (shown after it is added to the cart) */
  removeButton(productName: string): Locator {
    return this.xpath(
      `//div[contains(@class,'inventory_item_name') and normalize-space()='${productName}']` +
      `/ancestor::div[@class='inventory_item']//button[text()='Remove']`
    );
  }

  // ----- Actions -----

  /** Read the names of all products on the page */
  async getAllProductNames(): Promise<string[]> {
    // Step 1: wait until the first product name is visible (page loaded)
    await this.productNames.first().waitFor();

    // Step 2: count how many product names are on the page
    const count = await this.productNames.count();

    // Step 3: read each name one by one and put it in the list
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).innerText();   // nth(0) = 1st, nth(1) = 2nd ...
      names.push(name.trim());                                    // remove extra spaces and add
    }

    return names;   // ['Sauce Labs Backpack', 'Sauce Labs Bike Light', ...]
  }

  /** true if the product is in the list, false if not */
  async isProductAvailable(productName: string): Promise<boolean> {
    const names = await this.getAllProductNames();
    return names.includes(productName);
  }

  /** Click "Add to cart" for the given product */
  async addToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }

  /** Click the basket icon -> goes to "Your Cart" */
  async openCart() {
    await this.cartLink.click();
  }
}
