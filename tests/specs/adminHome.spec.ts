import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminHomePage } from "../pageObjects/adminHomePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let homePage: adminHomePage;
let basePage: BasePage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1380, height: 950 });
    basePage = new BasePage(page);
    loginPage = new adminLoginPage(page);
    homePage = new adminHomePage(page);
    await basePage.navigateTo(config.adminPortalUrl);
    await basePage.enterValuesInElement(loginPage.emailInput, config.email);
    await basePage.enterValuesInElement(loginPage.passwordInput, config.password);
    await basePage.clickElement(loginPage.loginButton);
});
test.afterEach(async () => {
    await browser.close();
});
test("TC00014- Verify that admins can initiate user invitations from the Users screen", async () => {
    // Generate random digits for email
    const randomDigits = await basePage.generateRandomDigits();
    // Create a dynamic email
    const gmail: string = `test123${randomDigits}@gmail.com`;
    try {  //Click on the Users button 
        await basePage.clickElement(homePage.usersButton);
        // Click on Invite User button
        await basePage.clickElement(homePage.inviteUserButton);
        // Enter email and click & select role, department, groups
        await basePage.enterValuesInElement(homePage.emailInput, gmail);
        await basePage.clickElement(homePage.roleSelect);
        await basePage.clickElement(homePage.roleDropdown);
        await basePage.clickElement(homePage.departmentSelect);
        await basePage.clickElement(homePage.departmentDropdown);
        await basePage.clickElement(homePage.groupsSelect);
        await basePage.clickElement(homePage.groupsDropdown);
        // Click on invite button
        await basePage.clickElement(homePage.inviteButton);
        // Validate success message after invitation
        await basePage.getElementText(homePage.inviteSuccessMessage);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});
test("TC0015 - Verify that admins are required to choose a role and region for new users", async () => {
    try {
        await basePage.clickElement(homePage.usersButton);
        await page.waitForTimeout(3000);
        await basePage.clickElement(homePage.inviteUserButton);
        // Enter email for invitation
        await basePage.enterValuesInElement(homePage.emailInput, config.inviteEmail);
        // Try to click on Invite button without selecting role/region
        await basePage.clickElement(homePage.inviteButton);
        // Validate error messages when required fields are not filled
        await basePage.getElementText(homePage.inviteRoleErrorMessage);
        await basePage.getElementText(homePage.inviteDepartmentErrorMessage);
        await basePage.getElementText(homePage.inviteGroupsErrorMessage);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});
test("TC0016 - Verify that the invited user is displayed in the user list", async () => {
    try {
        const randomDigits = await basePage.generateRandomDigits();
        const gmail: string = `test123${randomDigits}@gmail.com`;
        await basePage.clickElement(homePage.usersButton);
        await basePage.clickElement(homePage.inviteUserButton);
        // Enter the email for the new user
        await basePage.enterValuesInElement(homePage.emailInput, gmail);
        // click & select role, department, groups
        await basePage.clickElement(homePage.roleSelect);
        await basePage.clickElement(homePage.roleDropdown);
        await basePage.clickElement(homePage.departmentSelect);
        await basePage.clickElement(homePage.departmentDropdown);
        await basePage.clickElement(homePage.groupsSelect);
        await basePage.clickElement(homePage.groupsDropdown);
        // Click on Invite button
        await basePage.clickElement(homePage.inviteButton);
        // Wait for 3 seconds to allow invitation processing
        await page.waitForTimeout(3000);
        // Click on Users button again to view user list
        await basePage.clickElement(homePage.usersButton);
        await page.waitForTimeout(3000);
        // Get all the email items in the user list
        const emailItems = await homePage.emailListItems.all();
        // Get the first email element
        const firstEmailElement = emailItems[0];
        // Get text content (email) of the first element
        const firstEmailText = await firstEmailElement.textContent();
        // Verify that the invited email matches the generated email
        await expect(firstEmailText).toEqual(gmail);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});




