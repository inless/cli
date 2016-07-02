
const stack = require('../configs/cli-stack.json');

const Cli = require('../classes/cli.class.js');
const Actions = require('../classes/actions.class.js');

var cli = new Cli(stack);
var action = new Actions();


action.use(require('./actions/unpack.js'));
action.use(require('./actions/npm.js'));

// init app
// restore
// restore local
// add name url

// remove name
// run mode
// test test_name

// TODO: check if not exists directory 'node_modules/inless_dependencies' make it.
// TODO: must use "git-download" module for download modules (only for ssh://...)
// TODO: remake README.md from dependecies

require('./ui.js');

1?0:
cli.start(function(command) {
	console.log('>', command);
	switch(command[0]) {
		case 'init':
			action.run('unpack', command.slice(1)).then((data)=> {
				return action.run('npm install');
			}).then((data)=> {
				return action.run('reinstall dependencies');
			}).then((data)=> {
				console.log('complete');
			}).catch((err)=> {
				console.trace(err);
			});
		break;
		case 'restore':
			(command[1] == 'local' ?
				action.run('reinstall dependencies') :
				action.run('npm install').then((data)=> {
					return action.run('reinstall dependencies');
				})
			).then((data)=> {
				console.log(data);
			}).catch((err)=> {
				console.trace(err);
			});
		break;
		case 'add':
			action.run('install module', [command[2], command[1]]).then((data)=> {
				console.log(data);
			}).catch((err)=> {
				console.trace(err);
			});
		break;
		case 'remove':
			action.run('npm remove', command.slice(1)).then((data)=> {
				console.log('success');
			}).catch((err)=> {
				console.trace(err);
			});
		break;
		default:
			cli.wrong(`wrong command: ${command.join(' ')}`);
	}
});




