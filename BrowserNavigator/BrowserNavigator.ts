import { Browser, Page } from "puppeteer";
import puppeteer from 'puppeteer';

export default class BrowserNavigator {

    public browser: Browser;
    public activePage: Page;


    constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.activePage = page;
    }

    public static async init() {
        try {
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
            const page = await browser.newPage();
            return new BrowserNavigator(browser, page);
        } catch (error: any) {
            console.log(error);
        }
    }

    public async navigateToURL(url: string) {
        try {
            await this.activePage?.goto(url)
        } catch (error: any) {
            console.log(error)
        }
    }

    public async close() {
        try {
            await this.browser.close();
        } catch (error) {
            console.log(error);
        }
    }
}