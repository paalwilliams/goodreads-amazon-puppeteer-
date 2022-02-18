import { Browser, ElementHandle, Page } from "puppeteer";
import BrowserNavigator from "../BrowserNavigator";
import puppeteer from "puppeteer";
import { IAmazonBrowser } from "../types";
const config = require('../../config.json');


export default class AmazonBrowser extends BrowserNavigator {

    constructor(browser: Browser, activePage: Page) {
        super(browser, activePage);
    }

    public static async init(): Promise<IAmazonBrowser | undefined> {
        try {
            console.clear();
            console.log("Opening Amazon browser...");
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null, ignoreDefaultArgs: ["--enable-automation"] });
            const page = await browser.newPage();
            return new AmazonBrowser(browser, page);
        } catch (e) {
            console.error(e);
        }
    }

    public async navigateToProductPage(productPageURL: string): Promise<void> {
        try {
            console.clear();
            console.log("Navigating to product page...");
            await this.navigateToURL(productPageURL);
        } catch (e) {
            console.error(e);
        }
    }
    public async addProductToCart(): Promise<void> {
        try {
            console.clear()
            console.log("Adding product to cart...");
            // Select add to cart button and click
            const addTocartButton: ElementHandle<Element> | null = await this.activePage.$('[id^=add-to-cart-button]');
            if (!addTocartButton) {
                // If there is no add to cart button, we are most likely on the search results page.
                // We want to click the link of the first result, which should take us to the product listing page 
                // We can continue on from there.
                await this.resultsPageToProductListing();
            }
            await this.activePage.click('[id^=add-to-cart-button]');
        } catch (e) {
            console.error(e);
        }

    }

    public async resultsPageToProductListing(): Promise<void> {
        try {
            console.clear();
            console.log("Navigating to the product listing page...");
            let productListingLink = await this.activePage.evaluate(() => {
                return document.querySelector('[cel_widget_id^=MAIN-SEARCH_RESULTS]')
                    ?.querySelector('h2 a.a-link-normal')
                    ?.getAttribute('href');
            })
            if (!productListingLink) {
                throw "Unable to get product listing link.";
            }
            await this.navigateToURL(`${config.amazonBaseURL}${productListingLink}`);
        } catch (e) {
            console.error(e);
        }
    }

    public async navigateToCheckoutPage(): Promise<void> {
        try {
            console.clear();
            console.log("Navigating to the checkout page...");
            await this.navigateToURL(config.amazonCheckoutURL);
        } catch (e) {
            console.error(e);
        }
    }

    public async proceedToCheckout(): Promise<void> {
        await this.activePage.click("input[name=proceedToRetailCheckout]");

    }
}