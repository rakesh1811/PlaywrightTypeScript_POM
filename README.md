# SL_POM: Playwright + TypeScript Page Object Model framework

Project folder: `C:\Users\Rakesh\Documents\SL_POM`

## 1. What was done for you

| Step | What | Status |
|---|---|---|
| 1 | Created project folder `Documents\SL_POM` | Done by Claude |
| 2 | Created `package.json` (project info, npm scripts, dependencies) | Done by Claude |
| 3 | Created `playwright.config.ts` (browsers, timeout, reports, screenshots) | Done by Claude |
| 4 | Created `tsconfig.json` (TypeScript compiler settings) | Done by Claude |
| 5 | Created `.gitignore` (keeps node_modules and reports out of Git) | Done by Claude |
| 6 | Created sample tests: `tests/example.spec.ts`, `tests/login.spec.ts` | Done by Claude |
| 7 | Created a Page Object: `pages/LoginPage.ts` | Done by Claude |
| 8 | Checked that the code compiles and all 12 tests are discovered (2 files x 3 browsers) | Done by Claude |
| 9 | Install packages and browsers (`npm install`, `npx playwright install`) | **You do this (section 2)** |

Nothing else on your PC was changed: no system settings, no global installs, no other folders.

## 2. Steps you run (one time)

Open the folder in VS Code: **File → Open Folder → Documents\SL_POM**.
Then open the terminal: **Terminal → New Terminal** (Ctrl + `).

```bash
# 1) Check Node.js is installed (need v18 or newer; v20/v22 LTS recommended)
node -v
npm -v
#    If "node is not recognized": install the LTS version from https://nodejs.org, restart VS Code

# 2) Install project packages (@playwright/test, typescript, @types/node) into node_modules
npm install

# 3) Download the browsers Playwright drives (Chromium, Firefox, WebKit)
npx playwright install

# 4) Run all tests
npx playwright test

# 5) Open the HTML report
npx playwright show-report
```

Also install the VS Code extension **"Playwright Test for VSCode"** (by Microsoft). It adds a Testing panel with run and debug buttons next to each test.

> If PowerShell says *"running scripts is disabled on this system"* when you run `npx`, switch the VS Code terminal to **Command Prompt** (the dropdown next to the + in the terminal) or run once in PowerShell:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

## 3. Daily commands

| Command | What it does |
|---|---|
| `npm test` | Run all tests (Chrome only by default, headless) |
| `npm run test:chrome` | Run only on Chromium |
| `npm run test:headed` | Run with the browser visible |
| `npm run test:ui` | Open UI mode, the best way to learn and debug |
| `npm run test:debug` | Step through a test with the Inspector |
| `npm run report` | Open the last HTML report |
| `npm run codegen` | Record clicks and get generated code (opens saucedemo.com) |
| `npx playwright test tests/login.spec.ts` | Run one file |
| `npx playwright test -g "valid user"` | Run tests whose name matches |

## 3a. Change log

- **Config update:** `npm test` now runs on **Chrome only**, with longer timeouts (60s per test, 45s for page load) and 1 retry.
  Why: on this PC, Firefox in headless mode fails with a graphics error (`RenderCompositorSWGL failed`), and running 3 browsers in parallel caused timeouts. The test code itself was fine, since all Chromium tests passed.
  To test other browsers later: `npx playwright test --project=firefox` after removing the `//` in front of that line in `playwright.config.ts`.

## 4. Project structure

```
SL_POM/
├── package.json          # dependencies + npm scripts
├── playwright.config.ts  # Playwright settings
├── tsconfig.json         # TypeScript settings
├── .gitignore
├── pages/
│   └── LoginPage.ts      # Page Object (locators + actions)
├── tests/
│   ├── example.spec.ts   # basic: goto, title, click link
│   └── login.spec.ts     # POM-based login tests on saucedemo.com
├── node_modules/         # created by npm install (do not edit)
├── playwright-report/    # created after a run (HTML report)
└── test-results/         # screenshots / videos / traces of failures
```

## 4a. POM framework: SauceDemo (XPath)

Run it with the browser visible **in slow motion** (1 second pause before every action): `npm run test:pom`
Change the speed in `playwright.config.ts` → project `chromium-slow` → `slowMo: 1000` (2000 = slower).
To go one step at a time and click ▶ yourself: `npx playwright test tests/saucedemo-pom.spec.ts --project=chromium-slow --debug`

```
pages/BasePage.ts         -> parent class: open(), xpath(), getText()
pages/SauceLoginPage.ts   -> login page: XPath locators + actions
pages/ProductsPage.ts     -> products: read names, add to cart, basket link
pages/CartPage.ts         -> Your Cart: items + Checkout button
pages/CheckoutInfoPage.ts -> Checkout: Your Information (first/last name, zip)
pages/CheckoutOverviewPage.ts -> Checkout: Overview (payment, shipping, prices, Finish)
pages/CheckoutCompletePage.ts -> Thank you screen + screenshot
utils/testData.ts         -> random first name, last name, 6-digit zip
fixtures/pageFixtures.ts  -> creates page objects automatically for each test
screenshots/thank-you.png -> created by the test (also attached in the HTML report)
tests/saucedemo-pom.spec.ts -> the tests
```

Flow of the main test:
1. Launch browser → open `baseURL` (https://www.saucedemo.com, set in `playwright.config.ts`)
2. Read usernames from `//div[@id='login_credentials']` → take the first (`standard_user`)
3. Read the password from `//div[@class='login_password']` → last line (`secret_sauce`)
4. Fill `//input[@id='user-name']` and `//input[@id='password']`, click `//input[@id='login-button']`
5. Verify the URL contains `inventory.html` and the title `//span[@class='title']` = "Products"
6. Print all product names; if "Sauce Labs Bike Light" is there, click its Add to cart, otherwise print "Product not available"
7. Basket `//a[@class='shopping_cart_link']` → Your Cart → `//button[@id='checkout']`
8. Fill a random first name, last name and 6-digit zip → `//input[@id='continue']`
9. Overview: print Payment / Shipping (`//div[text()='Payment Information:']/following-sibling::div[1]`), item total, tax, total → `//button[@id='finish']`
10. Thank you screen: screenshot `screenshots/thank-you.png` and print `//h2[@class='complete-header']`

XPath cheat sheet:
| XPath | Means |
|---|---|
| `//input[@id='user-name']` | any `<input>` whose id is user-name |
| `//div[@class='login_password']` | div with exact class |
| `//div[contains(@class,'inventory')]` | class contains text |
| `//button[text()='Add to cart']` | exact visible text |
| `//button[contains(text(),'Add')]` | text contains |
| `(//div[@class='inventory_item'])[1]` | first match |
| `//div[text()='Payment Information:']/following-sibling::div[1]` | the element right after the label |
| `//div[...]/ancestor::div[@class='inventory_item']` | go UP to the parent card |
| `//div[@class='inventory_item']//button` | button inside the item |

In Playwright: `page.locator("xpath=//input[@id='user-name']")` (or just `page.locator("//input...")`, since Playwright detects `//` automatically).
Note: Playwright recommends `getByRole` / `getByTestId` over XPath for real projects, because they break less when the page changes. XPath is fine for learning and interviews.

## 5. Key concepts to learn (in order)

1. **Test structure**: `test('name', async ({ page }) => { ... })`, `test.describe` to group tests, and `test.beforeEach` for setup.
2. **`async / await`**: every Playwright action returns a Promise, so always `await` it.
3. **Locators**: prefer `page.getByRole()`, `getByLabel()`, `getByPlaceholder()`, `getByText()`, `getByTestId()`. Use `page.locator('css')` as a fallback.
4. **Actions**: `click()`, `fill()`, `check()`, `selectOption()`, `press()`, `hover()`.
5. **Assertions (auto-waiting)**: `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`, `toHaveTitle()`. Don't use fixed waits like `waitForTimeout`.
6. **Page Object Model**: one class per page (see `pages/LoginPage.ts`).
7. **Config**: projects (browsers), `baseURL`, retries, reporters, trace.
8. **Debugging**: UI mode, `--debug`, Trace Viewer (`npx playwright show-trace trace.zip`).
9. **Next**: fixtures, API testing (`request`), data-driven tests, CI with GitHub Actions or Jenkins.

## 6. Coming from Cypress, quick map

| Cypress | Playwright |
|---|---|
| `cy.visit(url)` | `await page.goto(url)` |
| `cy.get('sel')` | `page.locator('sel')` |
| `cy.contains('text')` | `page.getByText('text')` |
| `.type('abc')` | `await locator.fill('abc')` |
| `.should('be.visible')` | `await expect(locator).toBeVisible()` |
| `.should('have.text', 'x')` | `await expect(locator).toHaveText('x')` |
| `cy.intercept()` | `await page.route()` |
| `cypress.config.js` | `playwright.config.ts` |
| Chrome-family + Firefox | Chromium, Firefox, **WebKit (Safari)**; multi-tab and multi-domain supported |

## 7. Equivalent "official" way (for reference)

Instead of these files you can scaffold with `npm init playwright@latest`. It asks TypeScript/JavaScript, the tests folder, GitHub Actions, and whether to install browsers, and creates almost the same structure.
