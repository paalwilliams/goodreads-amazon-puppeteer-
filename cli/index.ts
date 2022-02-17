import inquirer, { Answers } from 'inquirer'

const promptUserGenreSelection = async (choices: any[]): Promise<Answers> => {

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
}

const cli = {
    promptUserGenreSelection
}

export default cli