import { ChoiceCollection } from "inquirer";
import AmazonBrowser from "./lib/AmazonBrowser";
import GoodReadsBrowser from "./lib/GoodReadsBrowser";
import UserCLI from "./lib/UserCLI";


// Wrapper function to provide top level await.
const runProgram = async () => {
    try {

        const goodReadsBrowser = await GoodReadsBrowser.init();
        if (!goodReadsBrowser) {
            throw 'Error Instantiating Browser.'
        }
        const genreList: ChoiceCollection = await goodReadsBrowser.getGenreOptions();
        const { genreSelection } = await UserCLI.getAnswers(genreList);
        const randomBookURL = await goodReadsBrowser.getRandomBookForGenre(genreSelection);
        await goodReadsBrowser.close();

        if (!randomBookURL) {
            throw 'Error Retrieving Random Book URL';
        }
        const amazonBrowser = await AmazonBrowser.init();

        if (!amazonBrowser) {
            throw 'Error instantiating Amazon Browser.';
        }
        await amazonBrowser.navigateToProductPage(randomBookURL);
        await amazonBrowser.addProductToCart();
        setTimeout(async () => {
            await amazonBrowser.navigateToCheckoutPage();
            await amazonBrowser.proceedToCheckout();
            await amazonBrowser.disconnect()
            console.clear();
            console.log("All done! Enjoy your book. 📕📕📕")
        }, 2000)
    } catch (e) {
        console.error(e)
        process.exit(1);
    }
}

runProgram();
