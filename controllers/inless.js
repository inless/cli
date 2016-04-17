
const stack = require('../configs/cli-stack.json');

var Cli = require('../classes/cli.class.js');
var cli = require('cli');

var helper = new Cli(stack);

var options = cli.parse({
	// port: ['p', 'Listen on this port', 'number', 8080]
});

cli.main(function(args, options) {
	var query = helper.normalize(args);
	this.ok(query);
});

