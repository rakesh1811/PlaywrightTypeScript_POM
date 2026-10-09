import { Page, Locator } from '@playwright/test';

/**
 * BasePage = parent class for every page object.
 * Common actions used by all pages live here, so we don't repeat code.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Open a URL (relative paths use baseURL from playwright.config.ts) */
  async open(path: string = '/') {
    await this.page.goto(path);
  }

  /** Build a locator from an XPath string */
  xpath(expression: string): Locator {
    return this.page.locator(`xpath=${expression}`);
  }

  /** Get visible text of an element, trimmed */
  async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }
}
