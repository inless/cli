
import cli from 'cli';
import colors from 'colors';
import normalize from '../libs/normalizeCommand.js';
import UI from './ui.class.js';

let ui = new UI();

export default class CLI {
	constructor(configs = []) {
		this.configs = configs;
	}
	getCommand(params=true, always=false) {
		return new Promise((resolve, reject)=> {
			let run = (args)=> {
				let data = normalize(args, this.configs);
				this.validation(data).then(data=> {
					resolve(data);
				}).catch(reject);
			}
			let getCommand = ()=> {
				this.readCommand(always).then((args)=> {
					run(args);
				});
			}
			if(params) {
				this.getArguments().then((args = [])=> {
					if(args.length) {
						run(args);
					} else {
						getCommand();
					}
				});
			} else {
				getCommand();
			}
		})
	}
	readCommand(always=false) {
		return new Promise((resolve, reject)=> {
			ui.prompt({
				type: "input",
				name: "command",
				message: "inless:> "
			}).then(({command=null})=> {
				if(!command && always) {
					this.readCommand(always).then(resolve);
				} else {
					resolve(command.split(' '));
				}
			});
		});
	}
	validation(data) {
		return new Promise((resolve, reject)=> {
			let min = data.corresponds.reduce((a,b)=> a<b?a:b);
			let command = data.commands.join(' ');
			if(min < Infinity) {
				ui.prompt({
					type: "confirm",
					name: "answer",
					message: `Are you sure would like input ${colors.inverse(command)}`,
					default: min > 1
				}).then(({answer})=> {
					if(answer) {
						resolve(command);
					} else {
						reject('Canceled');
					}
				})
			} else {
				resolve(command);
			}
		});
	}
	getArguments() {
		var options = cli.parse({
			// port: ['p', 'Listen on this port', 'number', 8080]
		});
		return new Promise((resolve, reject)=> {
			cli.main((args, options)=> {
				resolve(args);
			});
		});
	}
}