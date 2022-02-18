import { ChoiceCollection } from "inquirer";
import AmazonBrowser from "./AmazonBrowser/AmazonBrowser";
import HeadlessBrowser from "./BrowserNavigator/BrowserNavigator";
import GoodReadsBrowser from "./GoodReadsBrowser/GoodReadsBrowser";
import UserCLI from "./UserCLI/UserCLI";

// Wrapper function to provide top level await.
const runProgram = async () => {
    try {
        const goodReadsBrowser = await GoodReadsBrowser.init();
        if (!goodReadsBrowser) {
            throw 'Error Instantiating Browser.'
        }
        const genreList: ChoiceCollection = await goodReadsBrowser.getGenreOptions()
        const { genreSelection } = await UserCLI.getAnswers(genreList);
        const randomBookURL = await goodReadsBrowser.getRandomBookForGenre(genreSelection);
        await goodReadsBrowser.close();

        if (!randomBookURL) {
            throw 'Error Retrieving Random Book URL';
        }

        const amazonBrowser = await AmazonBrowser.init();

        if (!amazonBrowser) {
            throw 'Error instantiating Amazon Browser.'
        }
        await amazonBrowser.navigateToProductPage(randomBookURL);
        await amazonBrowser.addProductToCart();
        setTimeout(async () => {
            await amazonBrowser.navigateToCheckoutPage();
        }, 2000)

    } catch (error) {
        console.log(error)
        process.exit();
    }
}

runProgram();