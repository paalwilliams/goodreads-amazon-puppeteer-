import inquirer, { Answers, ChoiceCollection } from 'inquirer'



export default class UserCLI {


    public static async getAnswers(choices: any): Promise<Answers> {
        try {
            const answers: Answers = await inquirer
                .prompt([
                    {
                        type: "list",
                        name: "genreSelection",
                        message: "Select a Genre",
                        choices: choices
                    }
                ])
            return answers;

        } catch (error: any) {
            return error;
        }

    }

}
// const promptUserGenreSelection = async (choices: any[]): Promise<Answers> => {

//     const answers: Answers = await inquirer
//         .prompt([
//             {
//                 type: "list",
//                 name: "genreSelection",
//                 message: "Select a Genre",
//                 choices: choices
//             }
//         ])
//     return answers;
// }

// const cli = {
//     promptUserGenreSelection
// }

// export default cli