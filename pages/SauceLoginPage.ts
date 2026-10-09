import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login page of https://www.saucedemo.com/
 * All locators use XPath.
 */
export class SauceLoginPage extends BasePage {
  // ----- Locators (XPath) -----
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly usernamesBlock: Locator;   // "Accepted usernames are:" box
  readonly passwordBlock: Locator;    // "Password for all users:" box
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput  = this.xpath("//input[@id='user-name']");
    this.passwordInput  = this.xpath("//input[@id='password']");
    this.loginButton    = this.xpath("//input[@id='login-button']");
    this.usernamesBlock = this.xpath("//div[@id='login_credentials']");
    this.passwordBlock  = this.xpath("//div[@class='login_password']");
    this.errorMessage   = this.xpath("//h3[@data-test='error']");
  }

  // ----- Actions -----

  /** Launch the login page */
  async goto() {
    await this.open('/');
  }

  /**
   * Read all usernames printed on the page.
   * Page text looks like:
   *   Accepted usernames are:
   *   standard_user
   *   locked_out_user ...
   */
  async getAllUsernamesFromPage(): Promise<string[]> {
    // Step 1: read the whole text of the box
    const text = await this.getText(this.usernamesBlock);

    // Step 2: cut the text into lines
    const lines = text.split('\n');

    // Step 3: keep only the real usernames
    const usernames: string[] = [];
    for (const line of lines) {
      const value = line.trim();                 // remove extra spaces

      if (value === '') continue;                // skip empty lines
      if (value.includes('Accepted')) continue;  // skip the heading "Accepted usernames are:"

      usernames.push(value);                     // add the username to the list
    }

    return usernames;   // ['standard_user', 'locked_out_user', ...]
  }

  /** Read one username from the page (default: first one = standard_user) */
  async getUsernameFromPage(index: number = 0): Promise<string> {
    const users = await this.getAllUsernamesFromPage();
    return users[index];
  }

  /**
   * Read the password printed on the page.
   * Page text looks like:
   *   Password for all users:
   *   secret_sauce
   */
  async getPasswordFromPage(): Promise<string> {
    // Step 1: read the whole text of the box
    const text = await this.getText(this.passwordBlock);

    // Step 2: cut the text into lines
    const lines = text.split('\n');

    // Step 3: find the password line
    let password = '';
    for (const line of lines) {
      const value = line.trim();                 // remove extra spaces

      if (value === '') continue;                // skip empty lines
      if (value.includes('Password')) continue;  // skip the heading "Password for all users:"

      password = value;                          // this line is the password
    }

    return password;   // 'secret_sauce'
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  /** One-step login */
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
