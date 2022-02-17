import { init, openPage, getGenres, getGenreSelection, getRandomBookURL, addBookToCart } from './browser/browser';
import cli from './cli';
const config = require('./config.json');
const runProgram = async () => {
    let selectedGenre = await getGenreSelection();
    if (selectedGenre) {
        let x = await getRandomBookURL(selectedGenre)
        if (x) {
            let { data, page } = x;
            await addBookToCart(page, data);
        }

    }

}


runProgram()





