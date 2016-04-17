
const stack = require('../configs/cli-stack.json');

const Cli = require('../classes/cli.class.js');
const Actions = require('../classes/actions.class.js');

var cli = new Cli(stack);
var action = new Actions();


action.use(require('./actions/unpack.js'));
action.use(require('./actions/npm.js'));


cli.start(function(command) {
	switch(command[0]) {
		case 'init':
			action.run('unpack', command.slice(1)).then((data)=> {
				action.run('npm init').then((data)=> {
					action.run('npm install').then((data)=> {
						this.ok('success');
					});
				});
			});
		break;
		case 'add':
			action.run('npm add', command.slice(1)).then((data)=> {
				console.log(data);
			});
		break;
	}
});

