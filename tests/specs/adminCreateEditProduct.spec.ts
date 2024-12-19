import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProductPage } from "../pageObjects/adminCreateEditProduct";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditProductPage: adminCreateEditProductPage;
const productNameValidationMessage = "Product name cannot be empty";
const productDescriptionValidationMessage = "Description cannot be empty";
const programValidationMessage = "Please select program";
const totalQuantityValidationMessage = "Please fill total quantity";

test.beforeEach(async()=>{
    browser = await chromium.launch({headless: false, channel: "chrome"});
    page = await browser.newPage();
    basePage = new BasePage(page);
    loginPage = new adminLoginPage(page);
    createEditProductPage = new adminCreateEditProductPage(page);
    await basePage.navigateTo(config.adminPortalUrl);
    await loginPage.login(config.email, config.password);
    await basePage.clickElement(createEditProductPage.productsButton);
    await basePage.clickElement(createEditProductPage.addProductButton);
});

test.afterEach(async()=>{
    await browser.close();
});

test("TC0028 - Verify that the user is able to create a product",async()=>{
    console.log(await createEditProductPage.productNameInput.count());
    await createEditProductPage.productNameInput.focus();
    await basePage.waitForElementVisible(createEditProductPage.productNameInput);
    await basePage.enterValuesInElement(createEditProductPage.productNameInput, "Automated product");
    //await basePage.enterValuesInElement(createEditProductPage.productDescriptionInput, "Automated description");
    console.log("entered name: ",await createEditProductPage.productNameInput.inputValue());
    //console.log(await createEditProductPage.productDescriptionInput.inputValue());

    await page.waitForTimeout(3000);
});