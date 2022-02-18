import { Browser, Page } from "puppeteer";
import puppeteer from 'puppeteer';
import { IAmazonBrowser, IBrowserNavigator, IGoodReadsBrowser } from "../types";

export default class BrowserNavigator {

    public browser: Browser;
    public activePage: Page;


    constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.activePage = page;
    }

    public static async init(): Promise<IBrowserNavigator | IAmazonBrowser | IGoodReadsBrowser | undefined | Error> {
        try {
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
            const page = await browser.newPage();
            return new BrowserNavigator(browser, page);
        } catch (e) {
            console.error(e);
        }
    }

    public async navigateToURL(url: string): Promise<void> {
        try {
            await this.activePage?.goto(url);
        } catch (e) {
            console.error(e);
        }
    }

    public async close() {
        try {
            await this.browser.close();
        } catch (e) {
            console.error(e);
        }
    }

    public async disconnect() {
        try {
            await this.browser.disconnect();
        } catch (e) {
            console.error(e);
        }
    }
}