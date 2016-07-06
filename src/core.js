
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
actions.use(require('./actions/npm.js'));

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
				UI.log(error);
			});
		} break;
		case 'init application':
		case 'init component':
		case 'init library':
		case 'init modificator':
		case 'init plugin':
		case 'init route':
		case 'init ui-kit': {
			UI.info('Copying files...');
			actions.run('unpack', command.split(' ')[1], _to).then(data=> {
				UI.info('Installation node modules...');
				return actions.run('npm install', _to);
			// }).then(data=> {
			// 	UI.info('Installation inless dependencies...');
			// 	return actions.run('npm install', _to);
			}).then(data=> {
				UI.log('done.');
			}).catch(error=> {
				UI.error(error);
			});
		} break;
		default: {
			if(command) {
				UI.log(`Wrong command: ${colors.inverse(command)}. Try again`);
			}
			cli.getCommand(!command).then(handler).catch(error=>UI.log(colors.bold(`${error}.`)));
		}
	}
})();

