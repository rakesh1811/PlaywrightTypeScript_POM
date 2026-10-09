import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** "Checkout: Complete!" (Thank you) screen */
export class CheckoutCompletePage extends BasePage {
  readonly pageTitle: Locator;
  readonly thankYouHeader: Locator;
  readonly thankYouText: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle      = this.xpath("//span[@class='title']");
    this.thankYouHeader = this.xpath("//h2[@class='complete-header']");
    this.thankYouText   = this.xpath("//div[@class='complete-text']");
  }

  /** Save a full-page screenshot, returns the file path */
  async takeScreenshot(fileName: string): Promise<string> {
    const path = `screenshots/${fileName}`;
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }
}
