import { getGenreSelection, getRandomBookURL, addBookToCart, init } from './browser';

const runProgram = async (): Promise<void> => {
    try {
        let browser = await init();
        let selectedGenre: string = await getGenreSelection(browser);
        let randomBookData = await getRandomBookURL(selectedGenre, browser);
        let { data, page } = randomBookData;
        await addBookToCart(page, data);
    } catch (error: any) {
        console.log(error)

    }
}


runProgram();