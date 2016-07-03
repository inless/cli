
import inquirer from 'inquirer';
import winston from 'winston';

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
	static log() {
		winston.log(...arguments);
	}
	static info() {
		winston.info(...arguments);
	}
	static warn() {
		winston.warn(...arguments);
	}
	static error() {
		winston.error(...arguments);
	}
	static debug() {
		winston.debug(...arguments);
	}
}
