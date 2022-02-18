import inquirer from 'inquirer'
import { IGenreSelection } from "../types";

export default class UserCLI {

    public static async getAnswers(choices: any): Promise<any> {
        try {
            console.clear();
            const answers: IGenreSelection = await inquirer
                .prompt([
                    {
                        type: "list",
                        name: "genreSelection",
                        message: "Select a Genre",
                        choices: choices
                    }
                ]);
            return answers;
        } catch (e) {
            console.error(e);
        }
    }
}