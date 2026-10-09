import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** "Checkout: Your Information" screen */
export class CheckoutInfoPage extends BasePage {
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle      = this.xpath("//span[@class='title']");
    this.firstNameInput = this.xpath("//input[@id='first-name']");
    this.lastNameInput  = this.xpath("//input[@id='last-name']");
    this.zipInput       = this.xpath("//input[@id='postal-code']");
    this.continueButton = this.xpath("//input[@id='continue']");
  }

  async fillDetails(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
