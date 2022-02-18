import { Browser, ElementHandle, Page } from "puppeteer";
import BrowserNavigator from "../BrowserNavigator/BrowserNavigator";
import puppeteer from "puppeteer";
const config = require('../config.json');

export default class AmazonBrowser extends BrowserNavigator {

    constructor(browser: Browser, activePage: Page) {
        super(browser, activePage);
    }

    public static async init() {
        try {
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
            const page = await browser.newPage();
            return new AmazonBrowser(browser, page);
        } catch (error: any) {
            console.log(error);
        }
    }

    public async navigateToProductPage(productPageURL: string) {
        try {
            await this.navigateToURL(productPageURL);
        } catch (error) {
            console.log(error)
        }
    }
    public async addProductToCart() {
        try {
            const addTocartButton: ElementHandle<Element> | null = await this.activePage.$('[id^=add-to-cart-button]')
            if (!addTocartButton) {
                // If there is no add to cart button, we are most likely on the product page.
                // We should click the link of the first result, which should take us to the product listing page, and we can continue on from there.
                await this.resultsPageToProductListing();
            }
            await this.activePage.click('[id^=add-to-cart-button]');
        } catch (error) {
            console.log(error)
        }

    }

    public async resultsPageToProductListing() {
        try {
            let productListingLink = await this.activePage.evaluate(() => {
                return document.querySelector('[cel_widget_id^=MAIN-SEARCH_RESULTS]')?.querySelector('h2 a.a-link-normal')?.getAttribute('href');
            })
            if (!productListingLink) {
                throw new Error("Unable to get product listing link.")
            }
            await this.navigateToURL(`${config.amazonBaseURL}${productListingLink}`);
        } catch (error) {
            console.log(error)
        }
    }

    public async navigateToCheckoutPage() {
        try {
            await this.navigateToURL(config.amazonCheckoutURL);
        } catch (error) {
            console.log(error);
        }
    }
}