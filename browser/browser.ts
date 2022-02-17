import { Browser, Page } from "puppeteer";
const config = require('../config.json');
import cli from '../cli';
const puppeteer = require('puppeteer');

export const init = async () => {
    console.log("Opening Chrome Instance");

    const browser: Browser = await puppeteer.launch({ headless: false });
    return browser;

}

export const openPage = async (browser: Browser, url: string) => {
    try {
        const page: Page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url)
        return page
    } catch (e: any) {
        console.log(e);
    }
}

export const getGenres = async (page: Page) => {
    let data = await page.evaluate(() => {
        let results: any[] = []
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
    return data || []
}

export const getGenreSelection = async () => {

    try {
        let b = await init();
        let page = await openPage(b, `${config.baseURL}${config.genreListPath}`);
        if (page) {
            let genres = await getGenres(page);
            b.close();
            let { genreSelection } = await cli.promptUserGenreSelection(genres);
            return genreSelection;
        }

    }
    catch (e) {
        console.log(e)
    }
}

export const getRandomBookURL = async (genreSelectionPath: string) => {
    try {
        let b = await init();
        let page = await openPage(b, `${config.baseURL}${genreSelectionPath}`);
        if (page) {
            let data = await page.evaluate(() => {
                let results: any[] = []
                let items: any = document.querySelectorAll('.answerWrapper')
                if (items) {
                    var randIndex = Math.floor(Math.random() * items.length)
                    let goodReadsID = items[randIndex].firstElementChild.getAttribute('data-resource-id')
                    let url = `https://www.goodreads.com/buy_buttons/12/follow?book_id=${goodReadsID}`
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

export const addBookToCart = async (page: Page, url: string) => {
    await page.goto(url)
    let addTocartButton = await page.$('[id^=add-to-cart-button]')
    if (addTocartButton) {
        await page.click('[id^=add-to-cart-button]')

    }
    else {
        console.log('no add to cart button')
    }
}

const browser = {
    init,
    openPage,
    getGenres,
    getGenreSelection,
    getRandomBookURL,
    addBookToCart
}

export default browser;



// // await page.goto(URL);

// let data = await page.evaluate(() => {
//     let results: any[] = []
//     let items = document.querySelectorAll('.category')
//     if (items) {
//         items.forEach((item: any) => {
//             console.log()
//             if (item) {
//                 results.push({
//                     genreString: item.querySelector("a").querySelector("h4").textContent.replace("\n", "")
//                 })
//             }

//         })
//     }
//     return results
// })

// console.log(data)
// await page.screenshot({ path: 'example.png' });

//     // await browser.close();