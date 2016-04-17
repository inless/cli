
const dl = require('damerau-levenshtein-git');

var Cli = (function() {
	var Class = function(stack) {
		this.stack = stack || [];
	};
	Class.prototype = {
		normalize(args, _stack, command) {
			args = args || [];
			_stack = _stack || this.stack;
			command = command || '';
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
				return this.normalize(args.slice(1), param.childs, `${command} ${param.command}`);
			}
		}
	};
	return Class;
})();




module.exports = Cli;






