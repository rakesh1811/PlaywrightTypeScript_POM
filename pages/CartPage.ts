import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** "Your Cart" screen */
export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle      = this.xpath("//span[@class='title']");
    this.cartItemNames  = this.xpath("//div[@class='cart_item']//div[contains(@class,'inventory_item_name')]");
    this.checkoutButton = this.xpath("//button[@id='checkout']");
  }

  async getCartItemNames(): Promise<string[]> {
    return (await this.cartItemNames.allInnerTexts()).map(n => n.trim());
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}
