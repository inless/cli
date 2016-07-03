
import process from 'process';
import colors from 'colors';
import CLI from './classes/cli.class.js';
import UI from './classes/ui.class.js';
import Actions from './classes/actions.class.js';

const _to = process.cwd();
const configs = require('../configs/cli-stack.json');

let ui = new UI();
let cli = new CLI(configs);
let actions = new Actions();

actions.use(require('./actions/unpack.js'));

let handler;

(handler = (command = null)=> {
	if(command) {
		command = command.toLowerCase();
	}
	switch(command) {
		case 'init': {
			ui.prompt({
				type: 'list',
				name: 'type',
				message: 'Create module. Select type: ',
				default: 'Component',
				choices: [
					'Application',
					'Component',
					'Library',
					'Modificator',
					'Plugin',
					'Route',
					'UI-Kit'
				]
			}).then(({type})=> {
				handler(`init ${type}`);
			}).catch(error=> {
				console.log(error);
			});
		} break;
		case 'init application':
		case 'init component':
		case 'init library':
		case 'init modificator':
		case 'init plugin':
		case 'init route':
		case 'init ui-kit': {
			actions.run('unpack', command.split(' ')[1], _to).then(data=> {
				console.log('done.');
			});
		} break;
		default: {
			if(command) {
				console.log(`Wrong command: ${colors.inverse(command)}. Try again`);
			}
			cli.getCommand(!command).then(handler).catch(error=>console.log(colors.bold(`${error}.`)));
		}
	}
})();

