import { Browser, Page } from "puppeteer";
import BrowserNavigator from "../BrowserNavigator";
const config = require('../../config.json');
import puppeteer from "puppeteer";
import { IGoodReadsBrowser } from "../types";

export default class GoodReadsBrowser extends BrowserNavigator {

    constructor(browser: Browser, page: Page) {
        super(browser, page);
        this.browser = browser;
        this.activePage = page;
    }

    public static async init(): Promise<IGoodReadsBrowser | undefined> {
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            return new GoodReadsBrowser(browser, page);
        } catch (e: any) {
            console.error(e);
        }
    }


    public async getGenreOptions(): Promise<any> {
        try {
            console.clear()
            console.log("Getting available genres...")
            await this.navigateToURL(`${config.baseURL}${config.genreListPath}`);
            const data = await this.activePage.evaluate(() => {
                let results: any[] = [];
                let items: NodeList = document.querySelectorAll('.category');
                if (items) {
                    items.forEach((item: any) => {
                        results.push({
                            value: item.querySelector("a").getAttribute('href'),
                            name: item.querySelector("a").querySelector("h4").textContent.replace(/\n/g, "")
                        });
                    });
                }
                return results;
            })

            return data;
        } catch (e) {
            console.error(e)
        }
    }

    public async getRandomBookForGenre(genreURL: string): Promise<string | undefined> {
        console.clear()
        console.log("Selecting a book for you...")
        try {
            await this.navigateToURL(`${config.baseURL}${genreURL}`);
            let data = await this.activePage.evaluate(() => {
                const items: any = document.querySelectorAll('.answerWrapper');
                if (items) {
                    const randIndex: number = Math.floor(Math.random() * items.length);
                    const goodReadsID: string = items[randIndex].firstElementChild.getAttribute('data-resource-id');
                    const url = `https://www.goodreads.com/buy_buttons/12/follow?book_id=${goodReadsID}`;
                    return url;
                }
            })
            return data;

        } catch (e) {
            console.error(e);
        }
    }

}
