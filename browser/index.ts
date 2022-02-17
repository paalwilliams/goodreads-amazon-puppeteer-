import { Browser, ElementHandle, Page } from "puppeteer";
const config = require('../config.json');
import cli from '../cli';
const puppeteer = require('puppeteer');

export const init = async (): Promise<Browser> => {
    try {
        console.log("Opening Chrome Instance");
        const browser: Browser = await puppeteer.launch({ headless: false, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
        return browser;

    } catch (error: any) {
        return error;
    }

}

export const openPage = async (browser: Browser, url: string): Promise<Page> => {
    try {
        const page: Page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url)
        return page
    } catch (e: any) {
        console.log(e);
        return e;
    }
}

interface GenreData {
    value: string,
    name: string,
}

export const getGenres = async (page: Page): Promise<GenreData[]> => {
    let data = await page.evaluate(() => {
        let results: GenreData[] = []
        let items: NodeList = document.querySelectorAll('.category')
        if (items) {
            items.forEach((item: any) => {
                results.push({
                    value: item.querySelector("a").getAttribute('href'),
                    name: item.querySelector("a").querySelector("h4").textContent.replace(/\n/g, "")
                })
            })
        }
        return results
    })
    return data;
}

export const getGenreSelection = async (): Promise<any> => {
    try {
        let b: Browser = await init();
        let page = await openPage(b, `${config.baseURL}${config.genreListPath}`);
        if (page) {
            let genres = await getGenres(page);
            b.close();
            let { genreSelection } = await cli.promptUserGenreSelection(genres);
            return genreSelection;
        }
    }
    catch (e: any) {
        console.log(e)
        return e;
    }
}

// Should return only a url and not navigate to it.

export const getRandomBookURL = async (genreSelectionPath: string): Promise<any> => {
    try {
        const b = await init();
        const page = await openPage(b, `${config.baseURL}${genreSelectionPath}`);
        if (page) {
            let data = await page.evaluate(() => {
                const items: any = document.querySelectorAll('.answerWrapper')
                if (items) {
                    const randIndex = Math.floor(Math.random() * items.length)
                    const goodReadsID = items[randIndex].firstElementChild.getAttribute('data-resource-id')
                    const url = `https://www.goodreads.com/buy_buttons/12/follow?book_id=${goodReadsID}`
                    return url;
                }
            })
            if (data) {
                await page.goto(data);
                return { data, page };
            }
        }

    } catch (error) {
        console.log(error)
    }

}

export const addBookToCart = async (page: Page, url: string): Promise<void> => {
    try {
        await page.goto(url)
        const addTocartButton: ElementHandle<Element> | null = await page.$('[id^=add-to-cart-button]')
        if (addTocartButton) {
            await page.click('[id^=add-to-cart-button]')
            console.log("Book Added to Cart");
            await goToCart(page, "https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1")
        }
        else {
            console.log('There is no add to cart button.');
        }

    } catch (error: any) {
        console.log(error)
    }
}

export const goToCart = async (page: Page, url: string) => {
    await page.goto(url)

}

const browser = {
    getGenreSelection,
    getRandomBookURL,
    addBookToCart
}

export default browser;
