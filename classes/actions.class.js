

var cli = require('cli');


var Actions = (function() {
	var Class = function(stack) {
		this.stack = stack;
		this.actions = {};
	};
	Class.prototype = {
		run(stack) {
		},
		use(module) {
			module.call(this);
		},
		add(action, method) {
			this.actions[action] = method || function() {};
			return this.actions[action];
		},
		run(action, params) {
			action = action || '';
			params = params || [];
			cli.debug(`run task: ${action}, ${params.length ? 'with params: '+params.join(', ') : 'without params'}.`);
			return new Promise((resolve, reject)=> {
				if(typeof this.actions[action] !== 'function') {
					reject(`wrong action!`);
				} else {
					this.actions[action].apply(this, params.concat([resolve, reject]));
				}
			}).catch((error)=> {
				cli.error(`in action ${action}: ${error}`);
			});
		}
	};
	return Class;
})();




module.exports = Actions;



