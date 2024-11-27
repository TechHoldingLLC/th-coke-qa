import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";

const config = {
  adminUrl: "https://admin.dev.hospitality.thinfra.net/login",
  email: "prabhav.joshi@techholding.co",
  password: "Test@@123",
  incorrectPassword: "Test@123",
  expectedTitle: "TBD",
};

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  loginPage = new adminLoginPage(page);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0001 - Verify that users are presented with a login page", async () => {
  try {
    // Navigate to the Admin Portal
    await loginPage.navigate(config.adminUrl);

    // Verify that the login Page is visible
    const isVisible = await loginPage.isLoginPageVisible();
    expect(isVisible).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0002 - Verify that users can enter their credentials", async () => {
  try {
    
    await loginPage.navigate(config.adminUrl);

    // Enter email and password into the LoginPage
    await loginPage.enterEmail(config.email);
    await loginPage.enterPassword(config.password);

    // Validate  entered values are correct
    const enteredEmail = await loginPage.getEnteredEmail();
    const enteredPassword = await loginPage.getEnteredPassword();

    expect(enteredEmail).toBe(config.email);
    expect(enteredPassword).toBe(config.password);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0003 - Verify that admins who have appropriate access can access the system", async () => {
  try {
    // Navigate to the Admin Portal
    await loginPage.navigate(config.adminUrl);

    // Enter Valid Email and Valid Password
    await loginPage.login(config.email, config.password);

    // Validate Successful Login
    await page.waitForTimeout(5000);
    expect(await loginPage.isCokeLogoVisible()).toBe(true);
  } catch (error: any) {
    `Test failed: ${error.message}`;
    throw error;
  }
});

test("TC0004 - Verify that non-admins - those without appropriate access - cannot access the system.", async () => {
  try {
    // Navigate to the Admin Portal
    await loginPage.navigate(config.adminUrl);

    // Enter Valid Email and Invalid Password
    await loginPage.loginInvalid(config.email, config.incorrectPassword);

    // Validate the Error message
    const message: string | null = await loginPage.getErrorMessage();
    await expect(message).toEqual(
      "You don't have access to this system. If you feel this is an error please contact your system administrator."
    );
  } catch (error: any) {
    `Test failed: ${error.message}`;
    throw error;
  }
});
