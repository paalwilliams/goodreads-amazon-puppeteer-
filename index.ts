import { getGenreSelection, getRandomBookURL, addBookToCart } from './browser';

const runProgram = async (): Promise<void> => {
    let selectedGenre: string = await getGenreSelection();
    if (selectedGenre) {
        let randomBookData = await getRandomBookURL(selectedGenre);
        if (randomBookData) {
            let { data, page } = randomBookData;
            await addBookToCart(page, data);
        }
    }
}


runProgram();