import { getGenreSelection, getRandomBookURL, addBookToCart } from './browser/browser';

const runProgram = async () => {
    let selectedGenre = await getGenreSelection();
    if (selectedGenre) {
        let randomBookData = await getRandomBookURL(selectedGenre)
        if (randomBookData) {
            let { data, page } = randomBookData;
            await addBookToCart(page, data);
        }
    }
}


runProgram()





