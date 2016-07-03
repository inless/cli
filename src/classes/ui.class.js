
import inquirer from 'inquirer';

export default class UI {
	constructor() {
		this.engine = inquirer;
	}
	prompt(commands = []) {
		if(!(commands instanceof Array)) {
			commands = [commands];
		}
		return inquirer.prompt(commands);
	}
}
