import { Browser, ElementHandle, Page } from "puppeteer";
import BrowserNavigator from "../BrowserNavigator";
import puppeteer from "puppeteer";
import { IAmazonBrowser } from "../types";
const config = require('../../config.json');
const chromeLauncher = require("chrome-launcher/dist/chrome-launcher");
const util = require('util');
const request = require('request');

export default class AmazonBrowser extends BrowserNavigator {

    constructor(browser: Browser, activePage: Page) {
        super(browser, activePage);
    }
    public static async init(): Promise<any> {
        try {
            console.clear();
            console.log("Opening Amazon browser...");
            let chrome = await chromeLauncher.launch({
                userDataDir: false,
            })
            const resp = await util.promisify(request)(`http://localhost:${chrome.port}/json/version`);
            const { webSocketDebuggerUrl } = JSON.parse(resp.body);
            const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl, defaultViewport: null });
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
            // Select add to cart button and click checkout
            const addTocartButton: ElementHandle<Element> | null = await this.activePage.$('[id^=add-to-cart-button]');
            if (!addTocartButton) {
                throw 'No Add to Cart Button.'
            }
        } catch (error) {
            const nonPhysical = await this.activePage.evaluate(() => {
                const kindle = document.getElementById("productSubtitle")?.textContent?.toLowerCase().includes('kindle')
                const audible = document.getElementById("productBinding")?.textContent?.toLowerCase().includes('audible')
                return kindle || audible;
            })

            if (nonPhysical) {
                // If there is no add to cart button, we are most likely on the Kindle or Audible Edition Page.
                // We want to switch from the Kindle Edition to a physical copy so the 'Add To Cart' button appears.
                await this.switchToPhysicalEdition();

            }
            else {
                // If it is not the kindle edition, and there is no add to cart button, we are most likely on the search results page.
                // We want to click the link of the first result, which should take us to the product listing page 
                await this.resultsPageToProductListing();
            }
        }
        finally {
            await this.activePage.click('[id^=add-to-cart-button]');

        }

    }

    public async switchToPhysicalEdition(): Promise<void> {

        let [button] = await this.activePage.$x("//span[text()[contains(.,'Hardcover')  or contains(.,'Paperback')]]")

        let text = await this.activePage.evaluate(span => span.parentElement.getAttribute('href'), button);
        await this.navigateToURL(`${config.amazonBaseURL}${text}`);

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
            let [button] = await this.activePage.$x("//input[@name='proceedToRetailCheckout']")
            if (!button) {
                await this.navigateToURL(config.amazonCartURL);
            }
            await this.proceedToCheckout()
        } catch (e) {
            console.error(e);
        }
    }

    public async proceedToCheckout(): Promise<void> {
        try {
            await this.activePage.click("input[name=proceedToRetailCheckout]");
        } catch (e) {
            console.error(e);
        }

    }
}