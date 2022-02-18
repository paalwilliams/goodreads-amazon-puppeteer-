import { Answers } from "inquirer";
import { getGenreSelection, getRandomBookURL, addBookToCart } from './browser';

const runProgram = async (): Promise<void> => {
    let selectedGenrePath: string | void = await getGenreSelection();
    if (selectedGenrePath) {
        let randomBookData = await getRandomBookURL(selectedGenrePath);
        if (randomBookData) {
            let { data, page } = randomBookData;
            await addBookToCart(page, data);
        }
    }
}


runProgram();