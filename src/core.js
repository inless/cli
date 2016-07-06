
import process from 'process';
import path from 'path';
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
actions.use(require('./actions/files.js'));
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
		case 'init route': {
			UI.info('Copying files...');
			let params = {};
			ui.prompt([
				{
					type: 'input',
					name: 'name',
					message: 'Name: ',
					validate(value) {
						return !!value.match(/^[a-z0-9\-]+$/g);
					}
				},
				{
					type: 'input',
					name: 'path',
					message: 'Path: ',
					validate(value) {
						return !!value.match(/^\/[a-z0-9\-_\/\:]+$/ig);
					}
				},
				{
					type: 'confirm',
					name: 'redirect',
					message: 'Redirect? ',
					default: false
				},
				{
					type: 'input',
					name: 'redirectURI',
					message: 'Redirect url ',
					when(data) {
						return data.redirect;
					}
				},
				{
					type: 'checkbox',
					name: 'access',
					message: 'Access: ',
					default: [
						'any'
					],
					choices: [
						'any',
						'user',
						'admin'
					]
				}
			]).then((data)=> {
				if(typeof data.access == 'string') {
					data.access = [data.access];
				}
				if(data.redirect) {
					data.redirect = data.redirectURI;
					delete data.redirectURI;
				}
				params = data;
				return actions.run(
					'unpack', 
					command.split(' ')[1], 
					path.resolve(_to, 'src', 'routes', params.name)
				);
			}).then((data)=> {
				return actions.run(
					'read json', 
					path.resolve(_to, 'src', 'configs', 'routes.json')
				);
			}).then((data)=> {
				data.push(params);
				return actions.run(
					'write json', 
					path.resolve(_to, 'src', 'configs', 'routes.json'),
					data
				);
			}).then(data=> {
				UI.log('done.');
			}).catch(error=> {
				UI.error(error);
			});
		} break;
		case 'init application':
		case 'init component':
		case 'init library':
		case 'init modificator':
		case 'init plugin':
		case 'init ui-kit': {
			UI.info('Copying files...');
			actions.run('unpack', command.split(' ')[1], _to).then(data=> {
				UI.info('Installation node modules...');
				return actions.run('npm install', _to);
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

