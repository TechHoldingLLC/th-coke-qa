import { Locator, Page } from "@playwright/test";

export class adminCreateEditProductPage {
    private page: Page;
    public productsButton: Locator;
    public addProductButton: Locator;
    public productNameInput: Locator;
    public productDescriptionInput: Locator;
    public productNameValidation: Locator;
    public productDescriptionValidation: Locator;
    public programValidation: Locator;
    public totalQuantityValidation: Locator;

    constructor(page:Page){
        this.page = page;
        this.productsButton = page.locator("//a[@href='/products']");
        this.addProductButton = page.locator("//a[@href='/products/create']");
        this.productNameInput = page.locator("//div[@id='radix-:rae:']/descendant::input").first();
        this.productDescriptionInput = page.locator("//div[@role='dialog'][1]//div[@class='ql-editor ql-blank']");
        this.productNameValidation = page.locator("//span[text()='Product name cannot be empty']");
        this.productDescriptionValidation = page.locator("//span[text()='Description cannot be empty']");
        this.programValidation = page.locator("//span[text()='Please select program']");
        this.totalQuantityValidation = page.locator("//span[text()='Please fill total quantity']");
    }
}