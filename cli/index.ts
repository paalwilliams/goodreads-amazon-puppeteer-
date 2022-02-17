import inquirer from 'inquirer'

const promptUserGenreSelection = async (choices: any[]) => {

    const answers = await inquirer
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