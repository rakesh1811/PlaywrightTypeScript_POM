import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** "Checkout: Overview" screen */
export class CheckoutOverviewPage extends BasePage {
  readonly pageTitle: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle    = this.xpath("//span[@class='title']");
    // following-sibling: find the label, then take the value written right after it
    this.paymentInfo  = this.xpath("//div[text()='Payment Information:']/following-sibling::div[1]");
    this.shippingInfo = this.xpath("//div[text()='Shipping Information:']/following-sibling::div[1]");
    this.itemTotal    = this.xpath("//div[@class='summary_subtotal_label']");
    this.tax          = this.xpath("//div[@class='summary_tax_label']");
    this.total        = this.xpath("//div[contains(@class,'summary_total_label')]");
    this.finishButton = this.xpath("//button[@id='finish']");
  }

  /** Read payment, shipping and price details from the screen */
  async getOrderSummary() {
    return {
      payment:   await this.getText(this.paymentInfo),
      shipping:  await this.getText(this.shippingInfo),
      itemTotal: await this.getText(this.itemTotal),
      tax:       await this.getText(this.tax),
      total:     await this.getText(this.total),
    };
  }

  async clickFinish() {
    await this.finishButton.click();
  }
}
