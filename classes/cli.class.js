
var cli = require('cli');
const dl = require('damerau-levenshtein-git');



var Cli = (function() {
	var Class = function(stack) {
		this.stack = stack || [];
	};
	Class.prototype = {
		start(cb) {
			cb = cb || function() {};
			var options = cli.parse({
				// port: ['p', 'Listen on this port', 'number', 8080]
			});
			cli.main((args, options)=> {
				var query = this.normalize(args);
				cb.call(cli, query);
			});
		},
		normalize(args, _stack, command) {
			args = args || [];
			_stack = _stack || this.stack;
			command = command || [];
			if(!args.length) {
				return command;
			} else {
				var param = _stack.map((e)=> {
					var ret = e.aliases.concat([e.command]).map((e)=> {
						var cmd = args[0];
						if(cmd.length < e.length) {
							cmd += new Array(e.length - cmd.length).fill(' ').join('');
						} else if(cmd.length < e.length) {
							cmd = cmd.substr(0, e.length);
						}
						return (cmd.length / dl(cmd, e) - 1);
					}).reduce((a,b)=> b>a?b:a);
					return Object.assign({
						correspond: ret
					}, e);
				}).reduce((a,b)=> {
					return b.correspond > a.correspond ? b : a;
				});
				if(param.childs) {
					return this.normalize(args.slice(1), param.childs, command.concat([param.command]));
				} else {
					return command.concat([param.command]).concat(args.slice(1));
				}
			}
		}
	};
	return Class;
})();




module.exports = Cli;






