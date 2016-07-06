
import colors from 'colors';
import inquirer from 'inquirer';
import winston from 'winston';

var logger = new winston.Logger({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({
			timestamp: ()=> colors.grey(`[${(new Date).toISOString().split('T')[1].slice(0,-1)}]`)
		})
	]
});


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
		logger.info(...(new Array(...arguments)).map(e=> ((typeof e) == 'string') ?   colors.green(e) : e));
	}
	static info() {
		logger.info(...(new Array(...arguments)).map(e=> ((typeof e) == 'string') ?   colors.cyan(e) : e));
	}
	static warn() {
		logger.warn(...(new Array(...arguments)).map(e=> ((typeof e) == 'string') ? colors.orange(e) : e));
	}
	static error() {
		logger.error(...(new Array(...arguments)).map(e=> ((typeof e) == 'string') ?   colors.red(e) : e));
	}
	static debug() {
		logger.debug(...(new Array(...arguments)).map(e=> ((typeof e) == 'string') ?  colors.grey(e) : e));
	}
}
